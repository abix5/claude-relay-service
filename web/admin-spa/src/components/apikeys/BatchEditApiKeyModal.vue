<template>
  <Teleport to="body">
    <div class="modal fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        class="modal-content mx-auto flex max-h-[90vh] w-full max-w-4xl flex-col p-4 sm:p-6 md:p-8"
      >
        <div class="mb-4 flex items-center justify-between sm:mb-6">
          <div class="flex items-center gap-2 sm:gap-3">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 sm:h-10 sm:w-10 sm:rounded-xl"
            >
              <i class="fas fa-edit text-sm text-white sm:text-base" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
              {{ $t('batchEdit.titleWithCount', { count: selectedCount }) }}
            </h3>
          </div>
          <button
            class="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            @click="$emit('close')"
          >
            <i class="fas fa-times text-lg sm:text-xl" />
          </button>
        </div>

        <form
          class="modal-scroll-content custom-scrollbar flex-1 space-y-4 sm:space-y-6"
          @submit.prevent="batchUpdateApiKeys"
        >
          <!-- 说明文本 -->
          <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div class="flex items-start gap-3">
              <i class="fas fa-info-circle mt-1 text-blue-500" />
              <div>
                <p class="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {{ $t('batchEdit.description') }}
                </p>
                <p class="mt-1 text-sm text-blue-700 dark:text-blue-400">
                  {{ $t('batchEdit.instructions', { count: selectedCount }) }}
                </p>
              </div>
            </div>
          </div>

          <!-- 标签编辑 -->
          <div>
            <label
              class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 sm:mb-3 sm:text-sm"
            >
              {{ $t('batchEdit.tags.label') }}
            </label>
            <div class="space-y-4">
              <!-- 标签操作模式选择 -->
              <div class="flex flex-wrap gap-4">
                <label class="flex cursor-pointer items-center">
                  <input v-model="tagOperation" class="mr-2" type="radio" value="replace" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.tags.replace')
                  }}</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input v-model="tagOperation" class="mr-2" type="radio" value="add" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.tags.add')
                  }}</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input v-model="tagOperation" class="mr-2" type="radio" value="remove" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.tags.remove')
                  }}</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input v-model="tagOperation" class="mr-2" type="radio" value="none" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.tags.noChange')
                  }}</span>
                </label>
              </div>

              <!-- 标签编辑区域 -->
              <div v-if="tagOperation !== 'none'" class="space-y-3">
                <!-- 已选择的标签 -->
                <div v-if="form.tags.length > 0">
                  <div class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{
                      tagOperation === 'replace'
                        ? $t('batchEdit.tags.newTagList')
                        : tagOperation === 'add'
                          ? $t('batchEdit.tags.tagsToAdd')
                          : $t('batchEdit.tags.tagsToRemove')
                    }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in form.tags"
                      :key="'selected-' + index"
                      class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {{ tag }}
                      <button
                        class="ml-1 hover:text-blue-900"
                        type="button"
                        @click="removeTag(index)"
                      >
                        <i class="fas fa-times text-xs" />
                      </button>
                    </span>
                  </div>
                </div>

                <!-- 可选择的已有标签 -->
                <div v-if="unselectedTags.length > 0">
                  <div class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ $t('batchEdit.tags.selectExisting') }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tag in unselectedTags"
                      :key="'available-' + tag"
                      class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                      type="button"
                      @click="selectTag(tag)"
                    >
                      <i class="fas fa-tag text-xs text-gray-500 dark:text-gray-400" />
                      {{ tag }}
                    </button>
                  </div>
                </div>

                <!-- 创建新标签 -->
                <div>
                  <div class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ $t('batchEdit.tags.createNew') }}
                  </div>
                  <div class="flex gap-2">
                    <input
                      v-model="newTag"
                      class="form-input flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      :placeholder="$t('batchEdit.tags.placeholder')"
                      type="text"
                      @keypress.enter.prevent="addTag"
                    />
                    <button
                      class="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      type="button"
                      @click="addTag"
                    >
                      <i class="fas fa-plus" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 速率限制设置 -->
          <div
            class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/20"
          >
            <div class="mb-2 flex items-center gap-2">
              <div
                class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-blue-500"
              >
                <i class="fas fa-tachometer-alt text-xs text-white" />
              </div>
              <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('batchEdit.rateLimit.title') }}
              </h4>
            </div>

            <div class="space-y-2">
              <div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('batchEdit.rateLimit.window') }}
                  </label>
                  <input
                    v-model="form.rateLimitWindow"
                    class="form-input w-full border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    min="1"
                    :placeholder="$t('batchEdit.noChangePlaceholder')"
                    type="number"
                  />
                </div>

                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.rateLimit.requests')
                  }}</label>
                  <input
                    v-model="form.rateLimitRequests"
                    class="form-input w-full border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    min="1"
                    :placeholder="$t('batchEdit.noChangePlaceholder')"
                    type="number"
                  />
                </div>

                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.rateLimit.cost')
                  }}</label>
                  <input
                    v-model="form.rateLimitCost"
                    class="form-input w-full border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    min="0"
                    :placeholder="$t('batchEdit.noChangePlaceholder')"
                    step="0.01"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 每日费用限制 -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ $t('batchEdit.dailyCostLimit') }}
            </label>
            <input
              v-model="form.dailyCostLimit"
              class="form-input w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              min="0"
              :placeholder="$t('batchEdit.dailyCostPlaceholder')"
              step="0.01"
              type="number"
            />
          </div>

          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ $t('batchEdit.totalCostLimit') }}
            </label>
            <input
              v-model="form.totalCostLimit"
              class="form-input w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              min="0"
              :placeholder="$t('batchEdit.totalCostPlaceholder')"
              step="0.01"
              type="number"
            />
          </div>

          <!-- Opus 模型周费用限制 -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ $t('batchEdit.weeklyOpusCostLimit') }}
            </label>
            <input
              v-model="form.weeklyOpusCostLimit"
              class="form-input w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              min="0"
              :placeholder="$t('batchEdit.totalCostPlaceholder')"
              step="0.01"
              type="number"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ $t('batchEdit.weeklyOpusCostHint') }}
            </p>
          </div>

          <!-- 并发限制 -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
              $t('batchEdit.concurrencyLimit')
            }}</label>
            <input
              v-model="form.concurrencyLimit"
              class="form-input w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              min="0"
              :placeholder="$t('batchEdit.concurrencyPlaceholder')"
              type="number"
            />
          </div>

          <!-- 激活状态 -->
          <div>
            <div class="mb-3 flex items-center gap-4">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{
                $t('batchEdit.status.label')
              }}</label>
              <div class="flex gap-4">
                <label class="flex cursor-pointer items-center">
                  <input v-model="form.isActive" class="mr-2" type="radio" :value="true" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.status.active')
                  }}</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input v-model="form.isActive" class="mr-2" type="radio" :value="false" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.status.inactive')
                  }}</span>
                </label>
                <label class="flex cursor-pointer items-center">
                  <input v-model="form.isActive" class="mr-2" type="radio" :value="null" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    $t('batchEdit.status.noChange')
                  }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 服务权限 -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
              $t('batchEdit.permissions.label')
            }}</label>
            <div class="flex flex-wrap gap-4">
              <label class="flex cursor-pointer items-center">
                <input v-model="form.permissions" class="mr-2" type="radio" value="" />
                <span class="text-sm text-gray-700">{{
                  $t('batchEdit.permissions.noChange')
                }}</span>
              </label>
              <label class="flex cursor-pointer items-center">
                <input v-model="form.permissions" class="mr-2" type="radio" value="all" />
                <span class="text-sm text-gray-700">{{ $t('batchEdit.permissions.all') }}</span>
              </label>
              <label class="flex cursor-pointer items-center">
                <input v-model="form.permissions" class="mr-2" type="radio" value="claude" />
                <span class="text-sm text-gray-700">{{ $t('batchEdit.permissions.claude') }}</span>
              </label>
              <label class="flex cursor-pointer items-center">
                <input v-model="form.permissions" class="mr-2" type="radio" value="gemini" />
                <span class="text-sm text-gray-700">{{ $t('batchEdit.permissions.gemini') }}</span>
              </label>
              <label class="flex cursor-pointer items-center">
                <input v-model="form.permissions" class="mr-2" type="radio" value="openai" />
                <span class="text-sm text-gray-700">{{ $t('batchEdit.permissions.openai') }}</span>
              </label>
              <label class="flex cursor-pointer items-center">
                <input v-model="form.permissions" class="mr-2" type="radio" value="droid" />
                <span class="text-sm text-gray-700">{{ $t('batchEdit.permissions.droid') }}</span>
              </label>
            </div>
          </div>

          <!-- 专属账号绑定 -->
          <div>
            <div class="mb-3 flex items-center justify-between">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{
                $t('batchEdit.dedicatedAccounts.label')
              }}</label>
              <button
                class="flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
                :disabled="accountsLoading"
                :title="$t('batchEdit.dedicatedAccounts.refresh')"
                type="button"
                @click="refreshAccounts"
              >
                <i
                  :class="[
                    'fas',
                    accountsLoading ? 'fa-spinner fa-spin' : 'fa-sync-alt',
                    'text-xs'
                  ]"
                />
                <span>{{
                  accountsLoading
                    ? $t('batchEdit.dedicatedAccounts.refreshing')
                    : $t('batchEdit.dedicatedAccounts.refreshButton')
                }}</span>
              </button>
            </div>
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">{{
                  $t('batchEdit.dedicatedAccounts.claude')
                }}</label>
                <AccountSelector
                  v-model="claudeAccountSelectorValue"
                  :accounts="localAccounts.claude"
                  :default-option-text="$t('batchEdit.dedicatedAccounts.selectClaude')"
                  :disabled="!isServiceSelectable('claude')"
                  :groups="localAccounts.claudeGroups"
                  :placeholder="$t('batchEdit.dedicatedAccounts.selectClaude')"
                  platform="claude"
                  :special-options="accountSpecialOptions"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">{{
                  $t('batchEdit.dedicatedAccounts.gemini')
                }}</label>
                <AccountSelector
                  v-model="geminiAccountSelectorValue"
                  :accounts="localAccounts.gemini"
                  :default-option-text="$t('batchEdit.dedicatedAccounts.selectGemini')"
                  :disabled="!isServiceSelectable('gemini')"
                  :groups="localAccounts.geminiGroups"
                  :placeholder="$t('batchEdit.dedicatedAccounts.selectGemini')"
                  platform="gemini"
                  :special-options="accountSpecialOptions"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">{{
                  $t('batchEdit.dedicatedAccounts.openai')
                }}</label>
                <AccountSelector
                  v-model="openaiAccountSelectorValue"
                  :accounts="localAccounts.openai"
                  :default-option-text="$t('batchEdit.dedicatedAccounts.selectOpenai')"
                  :disabled="!isServiceSelectable('openai')"
                  :groups="localAccounts.openaiGroups"
                  :placeholder="$t('batchEdit.dedicatedAccounts.selectOpenai')"
                  platform="openai"
                  :special-options="accountSpecialOptions"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">{{
                  $t('batchEdit.dedicatedAccounts.bedrock')
                }}</label>
                <AccountSelector
                  v-model="bedrockAccountSelectorValue"
                  :accounts="localAccounts.bedrock"
                  :default-option-text="$t('batchEdit.dedicatedAccounts.selectBedrock')"
                  :disabled="!isServiceSelectable('openai')"
                  :groups="[]"
                  :placeholder="$t('batchEdit.dedicatedAccounts.selectBedrock')"
                  platform="bedrock"
                  :special-options="accountSpecialOptions"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">{{
                  $t('batchEdit.dedicatedAccounts.droid')
                }}</label>
                <AccountSelector
                  v-model="droidAccountSelectorValue"
                  :accounts="localAccounts.droid"
                  :default-option-text="$t('batchEdit.dedicatedAccounts.selectDroid')"
                  :disabled="!isServiceSelectable('droid')"
                  :groups="localAccounts.droidGroups"
                  :placeholder="$t('batchEdit.dedicatedAccounts.selectDroid')"
                  platform="droid"
                  :special-options="accountSpecialOptions"
                />
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              class="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              type="button"
              @click="$emit('close')"
            >
              {{ $t('batchEdit.cancel') }}
            </button>
            <button
              class="btn btn-primary flex-1 px-6 py-3 font-semibold"
              :disabled="loading"
              type="submit"
            >
              <div v-if="loading" class="loading-spinner mr-2" />
              <i v-else class="fas fa-save mr-2" />
              {{ loading ? $t('batchEdit.saving') : $t('batchEdit.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from '@/utils/toast'
import { useApiKeysStore } from '@/stores/apiKeys'
import { apiClient } from '@/config/api'
import AccountSelector from '@/components/common/AccountSelector.vue'

const { t } = useI18n()

const props = defineProps({
  selectedKeys: {
    type: Array,
    required: true
  },
  accounts: {
    type: Object,
    default: () => ({
      claude: [],
      gemini: [],
      openai: [],
      openaiResponses: [],
      bedrock: [],
      droid: [],
      claudeGroups: [],
      geminiGroups: [],
      openaiGroups: [],
      droidGroups: []
    })
  }
})

const emit = defineEmits(['close', 'success'])

const apiKeysStore = useApiKeysStore()
const loading = ref(false)
const accountsLoading = ref(false)
const localAccounts = ref({
  claude: [],
  gemini: [],
  openai: [],
  bedrock: [],
  droid: [],
  claudeGroups: [],
  geminiGroups: [],
  openaiGroups: [],
  droidGroups: []
})

// 标签相关
const newTag = ref('')
const availableTags = ref([])
const tagOperation = ref('none') // 'replace', 'add', 'remove', 'none'

const selectedCount = computed(() => props.selectedKeys.length)

// 计算未选择的标签
const unselectedTags = computed(() => {
  return availableTags.value.filter((tag) => !form.tags.includes(tag))
})

// 表单数据
const form = reactive({
  rateLimitCost: '', // 费用限制替代token限制
  rateLimitWindow: '',
  rateLimitRequests: '',
  concurrencyLimit: '',
  dailyCostLimit: '',
  totalCostLimit: '',
  weeklyOpusCostLimit: '', // 新增Opus周费用限制
  permissions: '', // 空字符串表示不修改
  claudeAccountId: '',
  geminiAccountId: '',
  openaiAccountId: '',
  bedrockAccountId: '',
  droidAccountId: '',
  tags: [],
  isActive: null // null表示不修改
})

const UNCHANGED_OPTION_VALUE = '__KEEP_ORIGINAL__'

const accountSpecialOptions = [
  { value: UNCHANGED_OPTION_VALUE, label: t('batchEdit.dedicatedAccounts.noChange') },
  { value: 'SHARED_POOL', label: t('batchEdit.dedicatedAccounts.sharedPool') }
]

const createAccountSelectorModel = (field) =>
  computed({
    get: () => (form[field] === '' ? UNCHANGED_OPTION_VALUE : form[field]),
    set: (value) => {
      if (!value || value === UNCHANGED_OPTION_VALUE) {
        form[field] = ''
      } else {
        form[field] = value
      }
    }
  })

const claudeAccountSelectorValue = createAccountSelectorModel('claudeAccountId')
const geminiAccountSelectorValue = createAccountSelectorModel('geminiAccountId')
const openaiAccountSelectorValue = createAccountSelectorModel('openaiAccountId')
const bedrockAccountSelectorValue = createAccountSelectorModel('bedrockAccountId')
const droidAccountSelectorValue = createAccountSelectorModel('droidAccountId')

const isServiceSelectable = (service) => {
  if (!form.permissions) return true
  if (form.permissions === 'all') return true
  return form.permissions === service
}

// 标签管理方法
const addTag = () => {
  if (newTag.value && newTag.value.trim()) {
    const tag = newTag.value.trim()
    if (!form.tags.includes(tag)) {
      form.tags.push(tag)
    }
    newTag.value = ''
  }
}

const selectTag = (tag) => {
  if (!form.tags.includes(tag)) {
    form.tags.push(tag)
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

// 刷新账号列表
const refreshAccounts = async () => {
  accountsLoading.value = true
  try {
    const [
      claudeData,
      claudeConsoleData,
      geminiData,
      geminiApiData,
      openaiData,
      openaiResponsesData,
      bedrockData,
      droidData,
      groupsData
    ] = await Promise.all([
      apiClient.get('/admin/claude-accounts'),
      apiClient.get('/admin/claude-console-accounts'),
      apiClient.get('/admin/gemini-accounts'),
      apiClient.get('/admin/gemini-api-accounts'), // 获取 Gemini-API 账号
      apiClient.get('/admin/openai-accounts'),
      apiClient.get('/admin/openai-responses-accounts'),
      apiClient.get('/admin/bedrock-accounts'),
      apiClient.get('/admin/droid-accounts'),
      apiClient.get('/admin/account-groups')
    ])

    // 合并Claude OAuth账户和Claude Console账户
    const claudeAccounts = []

    if (claudeData.success) {
      claudeData.data?.forEach((account) => {
        claudeAccounts.push({
          ...account,
          platform: 'claude-oauth',
          isDedicated: account.accountType === 'dedicated'
        })
      })
    }

    if (claudeConsoleData.success) {
      claudeConsoleData.data?.forEach((account) => {
        claudeAccounts.push({
          ...account,
          platform: 'claude-console',
          isDedicated: account.accountType === 'dedicated'
        })
      })
    }

    localAccounts.value.claude = claudeAccounts

    // 合并 Gemini OAuth 和 Gemini API 账号
    const geminiAccounts = []

    if (geminiData.success) {
      ;(geminiData.data || []).forEach((account) => {
        geminiAccounts.push({
          ...account,
          platform: 'gemini',
          isDedicated: account.accountType === 'dedicated'
        })
      })
    }

    if (geminiApiData.success) {
      ;(geminiApiData.data || []).forEach((account) => {
        geminiAccounts.push({
          ...account,
          platform: 'gemini-api',
          isDedicated: account.accountType === 'dedicated'
        })
      })
    }

    localAccounts.value.gemini = geminiAccounts

    const openaiAccounts = []

    if (openaiData.success) {
      ;(openaiData.data || []).forEach((account) => {
        openaiAccounts.push({
          ...account,
          platform: 'openai',
          isDedicated: account.accountType === 'dedicated'
        })
      })
    }

    if (openaiResponsesData.success) {
      ;(openaiResponsesData.data || []).forEach((account) => {
        openaiAccounts.push({
          ...account,
          platform: 'openai-responses',
          isDedicated: account.accountType === 'dedicated'
        })
      })
    }

    localAccounts.value.openai = openaiAccounts

    if (bedrockData.success) {
      localAccounts.value.bedrock = (bedrockData.data || []).map((account) => ({
        ...account,
        isDedicated: account.accountType === 'dedicated'
      }))
    }

    if (droidData.success) {
      localAccounts.value.droid = (droidData.data || []).map((account) => ({
        ...account,
        platform: 'droid',
        isDedicated: account.accountType === 'dedicated'
      }))
    }

    // 处理分组数据
    if (groupsData.success) {
      const allGroups = groupsData.data || []
      localAccounts.value.claudeGroups = allGroups.filter((g) => g.platform === 'claude')
      localAccounts.value.geminiGroups = allGroups.filter((g) => g.platform === 'gemini')
      localAccounts.value.openaiGroups = allGroups.filter((g) => g.platform === 'openai')
      localAccounts.value.droidGroups = allGroups.filter((g) => g.platform === 'droid')
    }

    showToast(t('batchEdit.dedicatedAccounts.refreshSuccess'), 'success')
  } catch (error) {
    showToast(t('batchEdit.dedicatedAccounts.refreshFailed'), 'error')
  } finally {
    accountsLoading.value = false
  }
}

// 批量更新API Keys
const batchUpdateApiKeys = async () => {
  loading.value = true

  try {
    // 准备提交的数据
    const updates = {}

    // 只有非空值才添加到更新对象中
    if (form.rateLimitCost !== '' && form.rateLimitCost !== null) {
      updates.rateLimitCost = parseFloat(form.rateLimitCost)
    }
    if (form.rateLimitWindow !== '' && form.rateLimitWindow !== null) {
      updates.rateLimitWindow = parseInt(form.rateLimitWindow)
    }
    if (form.rateLimitRequests !== '' && form.rateLimitRequests !== null) {
      updates.rateLimitRequests = parseInt(form.rateLimitRequests)
    }
    if (form.concurrencyLimit !== '' && form.concurrencyLimit !== null) {
      updates.concurrencyLimit = parseInt(form.concurrencyLimit)
    }
    if (form.dailyCostLimit !== '' && form.dailyCostLimit !== null) {
      updates.dailyCostLimit = parseFloat(form.dailyCostLimit)
    }
    if (form.totalCostLimit !== '' && form.totalCostLimit !== null) {
      updates.totalCostLimit = parseFloat(form.totalCostLimit)
    }
    if (form.weeklyOpusCostLimit !== '' && form.weeklyOpusCostLimit !== null) {
      updates.weeklyOpusCostLimit = parseFloat(form.weeklyOpusCostLimit)
    }

    // 权限设置
    if (form.permissions !== '') {
      updates.permissions = form.permissions
    }

    // 账户绑定
    if (form.claudeAccountId !== '') {
      if (form.claudeAccountId === 'SHARED_POOL') {
        updates.claudeAccountId = null
        updates.claudeConsoleAccountId = null
      } else if (form.claudeAccountId.startsWith('console:')) {
        updates.claudeConsoleAccountId = form.claudeAccountId.substring(8)
        updates.claudeAccountId = null
      } else if (!form.claudeAccountId.startsWith('group:')) {
        updates.claudeAccountId = form.claudeAccountId
        updates.claudeConsoleAccountId = null
      } else {
        updates.claudeAccountId = form.claudeAccountId
        updates.claudeConsoleAccountId = null
      }
    }

    if (form.geminiAccountId !== '') {
      if (form.geminiAccountId === 'SHARED_POOL') {
        updates.geminiAccountId = null
      } else {
        updates.geminiAccountId = form.geminiAccountId
      }
    }

    if (form.openaiAccountId !== '') {
      if (form.openaiAccountId === 'SHARED_POOL') {
        updates.openaiAccountId = null
      } else {
        updates.openaiAccountId = form.openaiAccountId
      }
    }

    if (form.bedrockAccountId !== '') {
      if (form.bedrockAccountId === 'SHARED_POOL') {
        updates.bedrockAccountId = null
      } else {
        updates.bedrockAccountId = form.bedrockAccountId
      }
    }

    if (form.droidAccountId !== '') {
      if (form.droidAccountId === 'SHARED_POOL') {
        updates.droidAccountId = null
      } else {
        updates.droidAccountId = form.droidAccountId
      }
    }

    // 激活状态
    if (form.isActive !== null) {
      updates.isActive = form.isActive
    }

    // 标签处理
    if (tagOperation.value !== 'none') {
      updates.tags = form.tags
      updates.tagOperation = tagOperation.value
    }

    const result = await apiClient.put('/admin/api-keys/batch', {
      keyIds: props.selectedKeys,
      updates
    })

    if (result.success) {
      const { successCount, failedCount, errors } = result.data

      if (successCount > 0) {
        showToast(t('batchEdit.success', { count: successCount }), 'success')

        if (failedCount > 0) {
          const errorMessages = errors.map((e) => `${e.keyId}: ${e.error}`).join('\n')
          showToast(
            t('batchEdit.partialSuccess', { count: failedCount, errors: errorMessages }),
            'warning'
          )
        }
      } else {
        showToast(t('batchEdit.allFailed'), 'error')
      }

      emit('success')
      emit('close')
    } else {
      showToast(result.message || t('batchEdit.failed'), 'error')
    }
  } catch (error) {
    showToast(t('batchEdit.failed'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 加载已存在的标签
  availableTags.value = await apiKeysStore.fetchTags()

  // 初始化账号数据
  if (props.accounts) {
    // props.accounts.gemini 已经包含了 OAuth 和 API 两种类型的账号（父组件已合并）
    // 保留原有的 platform 属性，不要覆盖
    const geminiAccounts = (props.accounts.gemini || []).map((account) => ({
      ...account,
      platform: account.platform || 'gemini' // 保留原有 platform，只在没有时设默认值
    }))

    // props.accounts.openai 只包含 openai 类型，openaiResponses 需要单独处理
    const openaiAccounts = []
    if (props.accounts.openai) {
      props.accounts.openai.forEach((account) => {
        openaiAccounts.push({
          ...account,
          platform: account.platform || 'openai'
        })
      })
    }
    if (props.accounts.openaiResponses) {
      props.accounts.openaiResponses.forEach((account) => {
        openaiAccounts.push({
          ...account,
          platform: account.platform || 'openai-responses'
        })
      })
    }

    localAccounts.value = {
      claude: props.accounts.claude || [],
      gemini: geminiAccounts,
      openai: openaiAccounts,
      bedrock: props.accounts.bedrock || [],
      droid: (props.accounts.droid || []).map((account) => ({
        ...account,
        platform: account.platform || 'droid'
      })),
      claudeGroups: props.accounts.claudeGroups || [],
      geminiGroups: props.accounts.geminiGroups || [],
      openaiGroups: props.accounts.openaiGroups || [],
      droidGroups: props.accounts.droidGroups || []
    }
  }
})
</script>

<style scoped>
/* 表单样式由全局样式提供 */
</style>
