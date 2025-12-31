<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <button
      class="language-switcher-btn flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      :title="$t('language.selectLanguage')"
    >
      <span class="text-lg">{{ currentFlag }}</span>
      <span class="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">
        {{ currentLanguageName }}
      </span>
      <i class="fas fa-chevron-down text-xs text-gray-500 dark:text-gray-400" />
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="locale in languageStore.getAvailableLocales"
          :key="locale.code"
          :class="{ 'is-active': locale.code === languageStore.getCurrentLocale }"
          :command="locale.code"
        >
          <div class="flex items-center gap-2">
            <span class="text-base">{{ locale.flag }}</span>
            <span>{{ locale.name }}</span>
            <i
              v-if="locale.code === languageStore.getCurrentLocale"
              class="fas fa-check ml-auto text-blue-500"
            />
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'

const languageStore = useLanguageStore()

const currentFlag = computed(() => {
  const locale = languageStore.getAvailableLocales.find(
    (l) => l.code === languageStore.getCurrentLocale
  )
  return locale ? locale.flag : '🇷🇺'
})

const currentLanguageName = computed(() => languageStore.getCurrentLocaleName)

const handleLanguageChange = (localeCode) => {
  languageStore.setLocale(localeCode)
}
</script>

<style scoped>
.language-switcher-btn {
  border: 1px solid transparent;
}

.language-switcher-btn:hover {
  border-color: rgba(99, 102, 241, 0.2);
}

.el-dropdown-menu__item.is-active {
  background-color: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.dark .el-dropdown-menu__item.is-active {
  background-color: rgba(99, 102, 241, 0.2);
}
</style>
