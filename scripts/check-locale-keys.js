#!/usr/bin/env node

/**
 * Скрипт для проверки различий в ключах локализации
 * Показывает какие ключи отсутствуют в ru.json и en.json по сравнению с zh.json
 */

const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '../web/admin-spa/src/locales')

// Рекурсивно получить все ключи из объекта
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

// Получить значение по ключу
function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Загрузить и проанализировать
const zh = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'zh.json'), 'utf-8'))
const ru = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'ru.json'), 'utf-8'))
const en = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf-8'))

const zhKeys = getAllKeys(zh)
const ruKeys = new Set(getAllKeys(ru))
const enKeys = new Set(getAllKeys(en))

console.log('📊 Анализ файлов локализации\n')
console.log(`zh.json: ${zhKeys.length} ключей`)
console.log(`ru.json: ${ruKeys.size} ключей`)
console.log(`en.json: ${enKeys.size} ключей\n`)

const missingInRu = zhKeys.filter(k => !ruKeys.has(k))
const missingInEn = zhKeys.filter(k => !enKeys.has(k))

// Найти лишние ключи (есть в ru/en, но отсутствуют в zh)
const zhKeysSet = new Set(zhKeys)
const extraInRu = getAllKeys(ru).filter(k => !zhKeysSet.has(k))
const extraInEn = getAllKeys(en).filter(k => !zhKeysSet.has(k))

console.log(`❌ Отсутствует в ru.json: ${missingInRu.length} ключей`)
console.log(`❌ Отсутствует в en.json: ${missingInEn.length} ключей`)
console.log(`⚠️  Лишние в ru.json (нет в zh): ${extraInRu.length} ключей`)
console.log(`⚠️  Лишние в en.json (нет в zh): ${extraInEn.length} ключей\n`)

if (missingInRu.length > 0) {
  console.log('=== ОТСУТСТВУЮЩИЕ КЛЮЧИ В ru.json ===\n')
  missingInRu.forEach(key => {
    const zhValue = getValueByPath(zh, key)
    console.log(`${key}`)
    console.log(`  zh: "${zhValue}"`)
    console.log()
  })
}

if (missingInEn.length > 0) {
  console.log('\n=== ОТСУТСТВУЮЩИЕ КЛЮЧИ В en.json ===\n')
  missingInEn.forEach(key => {
    const zhValue = getValueByPath(zh, key)
    console.log(`${key}`)
    console.log(`  zh: "${zhValue}"`)
    console.log()
  })
}

if (extraInRu.length > 0) {
  console.log('\n=== ЛИШНИЕ КЛЮЧИ В ru.json (нет в zh.json) ===\n')
  extraInRu.forEach(key => {
    const ruValue = getValueByPath(ru, key)
    console.log(`${key}`)
    console.log(`  ru: "${ruValue}"`)
    console.log()
  })
}

if (extraInEn.length > 0) {
  console.log('\n=== ЛИШНИЕ КЛЮЧИ В en.json (нет в zh.json) ===\n')
  extraInEn.forEach(key => {
    const enValue = getValueByPath(en, key)
    console.log(`${key}`)
    console.log(`  en: "${enValue}"`)
    console.log()
  })
}

// Экспорт для использования из другого скрипта
if (require.main !== module) {
  module.exports = { missingInRu, missingInEn, extraInRu, extraInEn, zh, ru, en, getValueByPath }
}
