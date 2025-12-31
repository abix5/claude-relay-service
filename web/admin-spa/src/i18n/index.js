import { createI18n } from 'vue-i18n'
import ru from '../locales/ru.json'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

// Функция получения сохраненного языка
function getStoredLocale() {
  if (typeof window === 'undefined') return 'ru'

  const stored = localStorage.getItem('user-locale')
  return stored && ['ru', 'en', 'zh'].includes(stored) ? stored : 'ru'
}

// Функция установки языка с сохранением в localStorage
export function setLocale(locale) {
  if (typeof window !== 'undefined' && ['ru', 'en', 'zh'].includes(locale)) {
    localStorage.setItem('user-locale', locale)
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    ru,
    en,
    zh
  }
})

export default i18n
