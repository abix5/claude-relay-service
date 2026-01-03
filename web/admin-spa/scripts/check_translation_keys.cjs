#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Читаем JSON файлы
const basePath = path.join(__dirname, '../src/locales')
const enPath = path.join(basePath, 'en.json')
const ruPath = path.join(basePath, 'ru.json')
const zhPath = path.join(basePath, 'zh.json')

let enData, ruData, zhData

try {
  enData = JSON.parse(fs.readFileSync(enPath, 'utf8'))
  ruData = JSON.parse(fs.readFileSync(ruPath, 'utf8'))
  zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'))
} catch (error) {
  console.error('Ошибка при чтении JSON файлов:', error.message)
  process.exit(1)
}

// Функция для получения всех ключей объекта в формате массива
function getAllKeys(obj, prefix = '') {
  const keys = []

  for (const key in obj) {
    const currentKey = prefix ? `${prefix}.${key}` : key

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], currentKey))
    } else {
      keys.push(currentKey)
    }
  }

  return keys.sort()
}

// Получаем все ключи
const enKeys = getAllKeys(enData)
const ruKeys = getAllKeys(ruData)
const zhKeys = getAllKeys(zhData)

console.log('🔍 Анализ ключей локализации\n')

// Проверяем наличие tutorial секции
console.log('📋 Проверка секции tutorial:')
const enTutorialKeys = enKeys.filter((key) => key.startsWith('tutorial.'))
const ruTutorialKeys = ruKeys.filter((key) => key.startsWith('tutorial.'))
const zhTutorialKeys = zhKeys.filter((key) => key.startsWith('tutorial.'))

console.log(`  EN (эталон): ${enTutorialKeys.length} ключей`)
console.log(`  RU: ${ruTutorialKeys.length} ключей`)
console.log(`  ZH: ${zhTutorialKeys.length} ключей\n`)

// Находим отсутствующие ключи
const missingInRU = enTutorialKeys.filter((key) => !ruKeys.includes(key))
const missingInZH = enTutorialKeys.filter((key) => !zhKeys.includes(key))
const extraInRU = ruTutorialKeys.filter((key) => !enKeys.includes(key))
const extraInZH = zhTutorialKeys.filter((key) => !enKeys.includes(key))

console.log('❌ Отсутствующие ключи:')
if (missingInRU.length > 0) {
  console.log(`\n  В RU (${missingInRU.length} шт.):`)
  missingInRU.forEach((key) => console.log(`    - ${key}`))
}

if (missingInZH.length > 0) {
  console.log(`\n  В ZH (${missingInZH.length} шт.):`)
  missingInZH.forEach((key) => console.log(`    - ${key}`))
}

console.log('\n⚠️  Лишние ключи:')
if (extraInRU.length > 0) {
  console.log(`\n  В RU (${extraInRU.length} шт.):`)
  extraInRU.forEach((key) => console.log(`    - ${key}`))
}

if (extraInZH.length > 0) {
  console.log(`\n  В ZH (${extraInZH.length} шт.):`)
  extraInZH.forEach((key) => console.log(`    - ${key}`))
}

// Проверяем конкретные ключи для macOS
console.log('\n🔍 Детальная проверка tutorial.macos.step3.codex:')
const macosCodexKeys = [
  'tutorial.macos.step3.codex.title',
  'tutorial.macos.step3.codex.description',
  'tutorial.macos.step3.codex.configFile',
  'tutorial.macos.step3.codex.configToml',
  'tutorial.macos.step3.codex.authJson'
]

macosCodexKeys.forEach((key) => {
  const enExists = enKeys.includes(key)
  const ruExists = ruKeys.includes(key)
  const zhExists = zhKeys.includes(key)

  console.log(`  ${key}:`)
  console.log(`    EN: ${enExists ? '✅' : '❌'}`)
  console.log(`    RU: ${ruExists ? '✅' : '❌'}`)
  console.log(`    ZH: ${zhExists ? '✅' : '❌'}`)
})

// Статистика
console.log('\n📊 Общая статистика:')
console.log(`  Всего ключей в EN: ${enKeys.length}`)
console.log(`  Всего ключей в RU: ${ruKeys.length}`)
console.log(`  Всего ключей в ZH: ${zhKeys.length}`)
console.log(`  Ключей tutorial в EN: ${enTutorialKeys.length}`)
console.log(`  Ключей tutorial в RU: ${ruTutorialKeys.length}`)
console.log(`  Ключей tutorial в ZH: ${zhTutorialKeys.length}`)

// Сохраняем отчет в файл
const report = {
  timestamp: new Date().toISOString(),
  statistics: {
    en: { total: enKeys.length, tutorial: enTutorialKeys.length },
    ru: { total: ruKeys.length, tutorial: ruTutorialKeys.length },
    zh: { total: zhKeys.length, tutorial: zhTutorialKeys.length }
  },
  missing: {
    inRU: missingInRU,
    inZH: missingInZH
  },
  extra: {
    inRU: extraInRU,
    inZH: extraInZH
  },
  macosCodex: macosCodexKeys.map((key) => ({
    key,
    en: enKeys.includes(key),
    ru: ruKeys.includes(key),
    zh: zhKeys.includes(key)
  }))
}

fs.writeFileSync('/tmp/translation_keys_report.json', JSON.stringify(report, null, 2))
console.log('\n📄 Детальный отчет сохранен в /tmp/translation_keys_report.json')

// Возвращаем код выхода
const hasIssues =
  missingInRU.length > 0 || missingInZH.length > 0 || extraInRU.length > 0 || extraInZH.length > 0
process.exit(hasIssues ? 1 : 0)
