import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '../i18n'

export const useLanguageStore = defineStore('language', () => {
  // State
  const currentLocale = ref(localStorage.getItem('user-locale') || 'ru')
  const availableLocales = ref([
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ])

  // Getters
  const getCurrentLocale = computed(() => currentLocale.value)
  const getAvailableLocales = computed(() => availableLocales.value)
  const getCurrentLocaleName = computed(() => {
    const locale = availableLocales.value.find((l) => l.code === currentLocale.value)
    return locale ? locale.name : 'Русский'
  })

  // Actions
  const setLocale = (locale) => {
    if (['ru', 'en', 'zh'].includes(locale)) {
      currentLocale.value = locale
      i18n.global.locale.value = locale
      localStorage.setItem('user-locale', locale)
      // Обновить HTML lang атрибут
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale
      }
    }
  }

  const initLocale = () => {
    const stored = localStorage.getItem('user-locale')
    if (stored && ['ru', 'en', 'zh'].includes(stored)) {
      setLocale(stored)
    } else {
      setLocale('ru')
    }
  }

  return {
    // State
    currentLocale,
    availableLocales,

    // Getters
    getCurrentLocale,
    getAvailableLocales,
    getCurrentLocaleName,

    // Actions
    setLocale,
    initLocale
  }
})
