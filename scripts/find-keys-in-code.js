#!/usr/bin/env node

/**
 * Скрипт для поиска использования ключей локализации в коде
 * Проверяет реально ли используются "лишние" ключи из ru.json/en.json
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const SPA_DIR = path.join(__dirname, '../web/admin-spa/src')
const LOCALES_DIR = path.join(SPA_DIR, 'locales')

// Цветной вывод
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Получить лишние ключи из check-locale-keys.js
function getExtraKeys() {
  const checkScript = require('./check-locale-keys.js')
  return {
    extraInRu: checkScript.extraInRu,
    extraInEn: checkScript.extraInEn,
    ru: checkScript.ru,
    en: checkScript.en,
    getValueByPath: checkScript.getValueByPath
  }
}

// Поиск использования ключа в файлах
function findKeyUsageInFiles(key) {
  const results = []

  // Паттерны поиска для Vue файлов
  const patterns = [
    `$t\\(['"\`]${key.replace(/\./g, '\\.')}['"\`]\\)`,  // $t('key')
    `$t\\(['"\`]${key.replace(/\./g, '\\.')}['"\`],`,    // $t('key', ...)
    `t\\(['"\`]${key.replace(/\./g, '\\.')}['"\`]\\)`,   // t('key')
    `t\\(['"\`]${key.replace(/\./g, '\\.')}['"\`],`      // t('key', ...)
  ]

  for (const pattern of patterns) {
    try {
      // Ищем в .vue, .js, .ts файлах
      const grepCmd = `grep -r -n -E "${pattern}" ${SPA_DIR} --include="*.vue" --include="*.js" --include="*.ts" 2>/dev/null || true`
      const output = execSync(grepCmd, { encoding: 'utf-8' })

      if (output.trim()) {
        const lines = output.trim().split('\n')
        lines.forEach(line => {
          const match = line.match(/^(.+?):(\d+):(.+)$/)
          if (match) {
            const [, file, lineNum, content] = match
            results.push({
              file: file.replace(SPA_DIR + '/', ''),
              line: parseInt(lineNum),
              content: content.trim()
            })
          }
        })
      }
    } catch (error) {
      // Игнорируем ошибки grep (нет совпадений)
    }
  }

  return results
}

// Получить перевод из git diff с main
function getTranslationFromGitDiff(key, locale) {
  try {
    const filePath = `web/admin-spa/src/locales/${locale}.json`
    const diffCmd = `git diff main...HEAD -- ${filePath} | grep -A 1 '"${key}"' | tail -1 || true`
    const output = execSync(diffCmd, { encoding: 'utf-8', cwd: path.join(__dirname, '..') })

    if (output.trim()) {
      // Извлечь значение из строки типа: +    "key": "value",
      const match = output.match(/:\s*"(.+)"/)
      if (match) {
        return match[1]
      }
    }
  } catch (error) {
    // Игнорируем ошибки
  }
  return null
}

// Основная функция
function main() {
  log('\n🔍 Поиск использования лишних ключей локализации в коде\n', 'cyan')

  const { extraInRu, extraInEn, ru, en, getValueByPath } = getExtraKeys()

  // Объединяем уникальные ключи из ru и en
  const allExtraKeys = [...new Set([...extraInRu, ...extraInEn])]

  log(`📊 Найдено лишних ключей для проверки: ${allExtraKeys.length}`, 'blue')
  log(`   - Только в ru.json: ${extraInRu.length}`)
  log(`   - Только в en.json: ${extraInEn.length}`)
  log(`   - Уникальных: ${allExtraKeys.length}\n`)

  const usedKeys = []
  const unusedKeys = []

  log('🔎 Поиск в коде (это может занять некоторое время)...\n', 'yellow')

  allExtraKeys.forEach((key, index) => {
    process.stdout.write(`\rПрогресс: ${index + 1}/${allExtraKeys.length}`)

    const usage = findKeyUsageInFiles(key)

    if (usage.length > 0) {
      usedKeys.push({
        key,
        usage,
        ruValue: extraInRu.includes(key) ? getValueByPath(ru, key) : null,
        enValue: extraInEn.includes(key) ? getValueByPath(en, key) : null,
        ruDiff: extraInRu.includes(key) ? getTranslationFromGitDiff(key, 'ru') : null,
        enDiff: extraInEn.includes(key) ? getTranslationFromGitDiff(key, 'en') : null
      })
    } else {
      unusedKeys.push({
        key,
        ruValue: extraInRu.includes(key) ? getValueByPath(ru, key) : null,
        enValue: extraInEn.includes(key) ? getValueByPath(en, key) : null
      })
    }
  })

  console.log('\n')

  // Вывод результатов
  log('=' .repeat(80), 'cyan')
  log(`✅ ИСПОЛЬЗУЕМЫЕ КЛЮЧИ (нужно добавить в zh.json): ${usedKeys.length}`, 'green')
  log('=' .repeat(80), 'cyan')

  if (usedKeys.length > 0) {
    usedKeys.forEach(({ key, usage, ruValue, enValue, ruDiff, enDiff }) => {
      log(`\n📌 ${key}`, 'yellow')

      if (ruValue) {
        log(`   ru: "${ruValue}"`, 'magenta')
        if (ruDiff && ruDiff !== ruValue) {
          log(`   ru (из git diff): "${ruDiff}"`, 'cyan')
        }
      }

      if (enValue) {
        log(`   en: "${enValue}"`, 'magenta')
        if (enDiff && enDiff !== enValue) {
          log(`   en (из git diff): "${enDiff}"`, 'cyan')
        }
      }

      log(`   Использование (${usage.length} мест):`, 'blue')
      usage.slice(0, 3).forEach(({ file, line, content }) => {
        log(`     ${file}:${line}`, 'green')
        log(`       ${content}`, 'reset')
      })

      if (usage.length > 3) {
        log(`     ... и еще ${usage.length - 3} мест`, 'blue')
      }
    })

    log('\n💡 Эти ключи реально используются в коде и должны быть добавлены в zh.json', 'cyan')
    log('💡 Используйте переводы из git diff (если есть) или текущие значения из ru/en.json', 'cyan')
  }

  log('\n' + '='.repeat(80), 'cyan')
  log(`❌ НЕИСПОЛЬЗУЕМЫЕ КЛЮЧИ (можно удалить): ${unusedKeys.length}`, 'red')
  log('='.repeat(80), 'cyan')

  if (unusedKeys.length > 0) {
    unusedKeys.forEach(({ key, ruValue, enValue }) => {
      log(`\n🗑️  ${key}`, 'yellow')
      if (ruValue) log(`   ru: "${ruValue}"`, 'magenta')
      if (enValue) log(`   en: "${enValue}"`, 'magenta')
    })

    log('\n⚠️  Эти ключи не найдены в коде и могут быть удалены из ru.json и en.json', 'yellow')
  }

  // Итоги
  log('\n' + '='.repeat(80), 'cyan')
  log('📊 ИТОГИ:', 'blue')
  log(`   ✅ Используемые ключи: ${usedKeys.length} (добавить в zh.json)`)
  log(`   ❌ Неиспользуемые ключи: ${unusedKeys.length} (удалить из ru/en.json)`)
  log('=' .repeat(80) + '\n', 'cyan')
}

// Запуск
if (require.main === module) {
  main()
}

module.exports = { findKeyUsageInFiles, getTranslationFromGitDiff }
