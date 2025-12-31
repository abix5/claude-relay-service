#!/usr/bin/env node

/**
 * Скрипт для проверки наличия всех ключей из Vue компонентов в файлах локализации
 * Ищет $t('key') и t('key') в .vue файлах и проверяет их наличие в zh.json, ru.json, en.json
 * Группирует результаты по файлам
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const LOCALES_DIR = path.join(__dirname, '../web/admin-spa/src/locales')
const COMPONENTS_DIR = path.join(__dirname, '../web/admin-spa/src')

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
}

// Рекурсивно получить все ключи из объекта локализации
function getAllKeys(obj, prefix = '') {
  const keys = []
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

// Извлечь ключи из Vue файлов с информацией о файле
function extractKeysFromVueFiles() {
  const keysByFile = {}

  try {
    // Получаем список всех Vue файлов
    const findCommand = `find ${COMPONENTS_DIR} -name "*.vue" -type f`
    const files = execSync(findCommand, { encoding: 'utf-8' })
      .split('\n')
      .filter(Boolean)

    for (const file of files) {
      const relativePath = file.replace(COMPONENTS_DIR + '/', '')
      const content = fs.readFileSync(file, 'utf-8')

      // Ищем все ключи в файле
      const keyPattern = /\$?t\('([^']+)'\)/g
      const keys = new Set()
      let match

      while ((match = keyPattern.exec(content)) !== null) {
        const key = match[1]
        // Игнорируем интерполяцию, служебные ключи и CSS-селекторы (начинающиеся с точки)
        if (!key.includes('${') && !key.includes('{') && key.includes('.') && !key.startsWith('.')) {
          keys.add(key)
        }
      }

      if (keys.size > 0) {
        keysByFile[relativePath] = Array.from(keys).sort()
      }
    }
  } catch (error) {
    console.error(
      `${colors.red}Ошибка при извлечении ключей из Vue файлов:${colors.reset}`,
      error.message
    )
  }

  return keysByFile
}

// Загрузить файлы локализации
console.log(`${colors.cyan}🔍 Проверка ключей локализации в Vue компонентах${colors.reset}\n`)

const zh = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'zh.json'), 'utf-8'))
const ru = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'ru.json'), 'utf-8'))
const en = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf-8'))

const zhKeys = new Set(getAllKeys(zh))
const ruKeys = new Set(getAllKeys(ru))
const enKeys = new Set(getAllKeys(en))

console.log(`${colors.blue}📊 Файлы локализации:${colors.reset}`)
console.log(`   zh.json: ${zhKeys.size} ключей`)
console.log(`   ru.json: ${ruKeys.size} ключей`)
console.log(`   en.json: ${enKeys.size} ключей\n`)

// Извлекаем ключи из Vue файлов
console.log(`${colors.yellow}🔎 Извлечение ключей из Vue компонентов...${colors.reset}`)
const keysByFile = extractKeysFromVueFiles()

const totalFiles = Object.keys(keysByFile).length
const totalKeys = Object.values(keysByFile).reduce((sum, keys) => sum + keys.length, 0)

console.log(`${colors.blue}📊 Проанализировано ${totalFiles} файлов${colors.reset}`)
console.log(`${colors.blue}📊 Найдено уникальных ключей: ${totalKeys}${colors.reset}\n`)

// Проверяем наличие ключей и группируем по файлам
const missingByFile = {}
let totalMissingZh = 0
let totalMissingRu = 0
let totalMissingEn = 0

for (const [file, keys] of Object.entries(keysByFile)) {
  const missing = {
    zh: keys.filter((k) => !zhKeys.has(k)),
    ru: keys.filter((k) => !ruKeys.has(k)),
    en: keys.filter((k) => !enKeys.has(k))
  }

  if (missing.zh.length > 0 || missing.ru.length > 0 || missing.en.length > 0) {
    missingByFile[file] = missing
    totalMissingZh += missing.zh.length
    totalMissingRu += missing.ru.length
    totalMissingEn += missing.en.length
  }
}

// Вывод результатов
console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}`)
console.log(`${colors.cyan}РЕЗУЛЬТАТЫ ПРОВЕРКИ${colors.reset}`)
console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`)

if (Object.keys(missingByFile).length === 0) {
  console.log(
    `${colors.green}✅ Все ключи из Vue компонентов присутствуют во всех файлах локализации!${colors.reset}\n`
  )
} else {
  console.log(`${colors.red}❌ Найдены недостающие ключи в ${Object.keys(missingByFile).length} файлах:${colors.reset}\n`)
  console.log(`   zh.json: ${totalMissingZh} ключей`)
  console.log(`   ru.json: ${totalMissingRu} ключей`)
  console.log(`   en.json: ${totalMissingEn} ключей\n`)

  // Выводим детали по каждому файлу
  for (const [file, missing] of Object.entries(missingByFile)) {
    console.log(`${colors.magenta}📄 ${file}${colors.reset}`)

    if (missing.zh.length > 0) {
      console.log(`   ${colors.red}❌ zh.json (${missing.zh.length}):${colors.reset}`)
      missing.zh.forEach((key) => console.log(`      - ${key}`))
    }

    if (missing.ru.length > 0) {
      console.log(`   ${colors.red}❌ ru.json (${missing.ru.length}):${colors.reset}`)
      missing.ru.forEach((key) => console.log(`      - ${key}`))
    }

    if (missing.en.length > 0) {
      console.log(`   ${colors.red}❌ en.json (${missing.en.length}):${colors.reset}`)
      missing.en.forEach((key) => console.log(`      - ${key}`))
    }

    console.log()
  }
}

console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`)

// Статистика по категориям
const allKeys = Object.values(keysByFile).flat()
const categories = {}
allKeys.forEach((key) => {
  const category = key.split('.')[0]
  categories[category] = (categories[category] || 0) + 1
})

console.log(`${colors.blue}📊 Статистика использования по категориям:${colors.reset}`)
Object.entries(categories)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    console.log(`   ${category}: ${count} ключей`)
  })
console.log()

// Код выхода
const exitCode = totalMissingZh + totalMissingRu + totalMissingEn > 0 ? 1 : 0
process.exit(exitCode)
