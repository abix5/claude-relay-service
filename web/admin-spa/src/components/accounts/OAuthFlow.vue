<template>
  <div class="space-y-6">
    <!-- Claude OAuth流程 -->
    <div v-if="platform === 'claude'">
      <div
        class="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-700 dark:bg-blue-900/30"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500"
          >
            <i class="fas fa-link text-white" />
          </div>
          <div class="flex-1">
            <h4 class="mb-3 font-semibold text-blue-900 dark:text-blue-200">
              {{ $t('accounts.oauth.claudeAuthTitle') }}
            </h4>
            <p class="mb-4 text-sm text-blue-800 dark:text-blue-300">
              {{ $t('accounts.oauth.instructionsClaude') }}
            </p>

            <div class="space-y-4">
              <!-- 步骤1: 生成授权链接 -->
              <div
                class="rounded-lg border border-blue-300 bg-white/80 p-4 dark:border-blue-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                  >
                    1
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-blue-900 dark:text-blue-200">
                      {{ $t('accounts.oauth.step1Title') }}
                    </p>
                    <button
                      v-if="!authUrl"
                      class="btn btn-primary px-4 py-2 text-sm"
                      :disabled="loading"
                      @click="generateAuthUrl"
                    >
                      <i v-if="!loading" class="fas fa-link mr-2" />
                      <div v-else class="loading-spinner mr-2" />
                      {{
                        loading
                          ? $t('accounts.oauth.generating')
                          : $t('accounts.oauth.generateAuthLink')
                      }}
                    </button>
                    <div v-else class="space-y-3">
                      <div class="flex items-center gap-2">
                        <input
                          class="form-input flex-1 bg-gray-50 font-mono text-xs dark:bg-gray-700"
                          readonly
                          type="text"
                          :value="authUrl"
                        />
                        <button
                          class="rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                          :title="$t('accounts.oauth.copyLink')"
                          @click="copyAuthUrl"
                        >
                          <i :class="copied ? 'fas fa-check text-green-500' : 'fas fa-copy'" />
                        </button>
                      </div>
                      <button
                        class="text-xs text-blue-600 hover:text-blue-700"
                        @click="regenerateAuthUrl"
                      >
                        <i class="fas fa-sync-alt mr-1" />{{ $t('accounts.oauth.regenerate') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤2: 访问链接并授权 -->
              <div
                class="rounded-lg border border-blue-300 bg-white/80 p-4 dark:border-blue-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                  >
                    2
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-blue-900 dark:text-blue-200">
                      {{ $t('accounts.oauth.step2Title') }}
                    </p>
                    <p class="mb-2 text-sm text-blue-700 dark:text-blue-300">
                      {{ $t('accounts.oauth.step2DescriptionClaude') }}
                    </p>
                    <div
                      class="rounded border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-700 dark:bg-yellow-900/30"
                    >
                      <p class="text-xs text-yellow-800 dark:text-yellow-300">
                        <i class="fas fa-exclamation-triangle mr-1" />
                        <strong>{{ $t('accounts.oauth.proxyNotice') }}</strong
                        >{{ $t('accounts.oauth.proxyWarning') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤3: 输入授权码 -->
              <div
                class="rounded-lg border border-blue-300 bg-white/80 p-4 dark:border-blue-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                  >
                    3
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-blue-900 dark:text-blue-200">
                      {{ $t('accounts.oauth.step3Title') }}
                    </p>
                    <p class="mb-3 text-sm text-blue-700 dark:text-blue-300">
                      {{ $t('accounts.oauth.step3DescriptionClaude') }}
                    </p>
                    <div class="space-y-3">
                      <div>
                        <label
                          class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          <i class="fas fa-key mr-2 text-blue-500" />{{
                            $t('accounts.oauth.authCodeLabel')
                          }}
                        </label>
                        <textarea
                          v-model="authCode"
                          class="form-input w-full resize-none font-mono text-sm"
                          :placeholder="$t('accounts.oauth.placeholderClaude')"
                          rows="3"
                        />
                      </div>
                      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <i class="fas fa-info-circle mr-1" />
                        {{ $t('accounts.oauth.helpTextClaude') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gemini OAuth流程 -->
    <div v-else-if="platform === 'gemini'">
      <div
        class="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-700 dark:bg-green-900/30"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-500"
          >
            <i class="fas fa-robot text-white" />
          </div>
          <div class="flex-1">
            <h4 class="mb-3 font-semibold text-green-900 dark:text-green-200">
              {{ $t('accounts.oauth.geminiAuthTitle') }}
            </h4>
            <p class="mb-4 text-sm text-green-800 dark:text-green-300">
              {{ $t('accounts.oauth.instructionsGemini') }}
            </p>

            <div class="space-y-4">
              <!-- 步骤1: 生成授权链接 -->
              <div
                class="rounded-lg border border-green-300 bg-white/80 p-4 dark:border-green-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
                  >
                    1
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-green-900 dark:text-green-200">
                      {{ $t('accounts.oauth.step1Title') }}
                    </p>
                    <button
                      v-if="!authUrl"
                      class="btn btn-primary px-4 py-2 text-sm"
                      :disabled="loading"
                      @click="generateAuthUrl"
                    >
                      <i v-if="!loading" class="fas fa-link mr-2" />
                      <div v-else class="loading-spinner mr-2" />
                      {{
                        loading
                          ? $t('accounts.oauth.generating')
                          : $t('accounts.oauth.generateAuthLink')
                      }}
                    </button>
                    <div v-else class="space-y-3">
                      <div class="flex items-center gap-2">
                        <input
                          class="form-input flex-1 bg-gray-50 font-mono text-xs dark:bg-gray-700"
                          readonly
                          type="text"
                          :value="authUrl"
                        />
                        <button
                          class="rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                          :title="$t('accounts.oauth.copyLink')"
                          @click="copyAuthUrl"
                        >
                          <i :class="copied ? 'fas fa-check text-green-500' : 'fas fa-copy'" />
                        </button>
                      </div>
                      <button
                        class="text-xs text-green-600 hover:text-green-700"
                        @click="regenerateAuthUrl"
                      >
                        <i class="fas fa-sync-alt mr-1" />{{ $t('accounts.oauth.regenerate') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤2: 操作说明 -->
              <div
                class="rounded-lg border border-green-300 bg-white/80 p-4 dark:border-green-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
                  >
                    2
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-green-900 dark:text-green-200">
                      {{ $t('accounts.oauth.step2Title') }}
                    </p>
                    <p class="mb-2 text-sm text-green-700 dark:text-green-300">
                      {{ $t('accounts.oauth.step2DescriptionGemini') }}
                    </p>
                    <div
                      class="rounded border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-700 dark:bg-yellow-900/30"
                    >
                      <p class="text-xs text-yellow-800 dark:text-yellow-300">
                        <i class="fas fa-exclamation-triangle mr-1" />
                        <strong>{{ $t('accounts.oauth.proxyNotice') }}</strong
                        >{{ $t('accounts.oauth.proxyWarning') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤3: 输入授权码 -->
              <div
                class="rounded-lg border border-green-300 bg-white/80 p-4 dark:border-green-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
                  >
                    3
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-green-900 dark:text-green-200">
                      {{ $t('accounts.oauth.step3Title') }}
                    </p>
                    <p class="mb-3 text-sm text-green-700 dark:text-green-300">
                      {{ $t('accounts.oauth.step3DescriptionGemini') }}
                    </p>
                    <div class="space-y-3">
                      <div>
                        <label
                          class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          <i class="fas fa-key mr-2 text-green-500" />{{
                            $t('accounts.oauth.authCodeLabel')
                          }}
                        </label>
                        <textarea
                          v-model="authCode"
                          class="form-input w-full resize-none font-mono text-sm"
                          :placeholder="$t('accounts.oauth.placeholderGemini')"
                          rows="3"
                        />
                      </div>
                      <div class="mt-2 space-y-1">
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          <i class="fas fa-check-circle mr-1 text-green-500" />
                          {{ $t('accounts.oauth.helpTextGemini') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- OpenAI OAuth流程 -->
    <div v-else-if="platform === 'openai'">
      <div
        class="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-700 dark:bg-orange-900/30"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500"
          >
            <i class="fas fa-brain text-white" />
          </div>
          <div class="flex-1">
            <h4 class="mb-3 font-semibold text-orange-900 dark:text-orange-200">
              {{ $t('accounts.oauth.openaiAuthTitle') }}
            </h4>
            <p class="mb-4 text-sm text-orange-800 dark:text-orange-300">
              {{ $t('accounts.oauth.instructionsOpenAI') }}
            </p>

            <div class="space-y-4">
              <!-- 步骤1: 生成授权链接 -->
              <div
                class="rounded-lg border border-orange-300 bg-white/80 p-4 dark:border-orange-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white"
                  >
                    1
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-orange-900 dark:text-orange-200">
                      {{ $t('accounts.oauth.step1Title') }}
                    </p>
                    <button
                      v-if="!authUrl"
                      class="btn btn-primary px-4 py-2 text-sm"
                      :disabled="loading"
                      @click="generateAuthUrl"
                    >
                      <i v-if="!loading" class="fas fa-link mr-2" />
                      <div v-else class="loading-spinner mr-2" />
                      {{
                        loading
                          ? $t('accounts.oauth.generating')
                          : $t('accounts.oauth.generateAuthLink')
                      }}
                    </button>
                    <div v-else class="space-y-3">
                      <div class="flex items-center gap-2">
                        <input
                          class="form-input flex-1 bg-gray-50 font-mono text-xs dark:bg-gray-700"
                          readonly
                          type="text"
                          :value="authUrl"
                        />
                        <button
                          class="rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                          :title="$t('accounts.oauth.copyLink')"
                          @click="copyAuthUrl"
                        >
                          <i :class="copied ? 'fas fa-check text-green-500' : 'fas fa-copy'" />
                        </button>
                      </div>
                      <button
                        class="text-xs text-orange-600 hover:text-orange-700"
                        @click="regenerateAuthUrl"
                      >
                        <i class="fas fa-sync-alt mr-1" />{{ $t('accounts.oauth.regenerate') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤2: 访问链接并授权 -->
              <div
                class="rounded-lg border border-orange-300 bg-white/80 p-4 dark:border-orange-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white"
                  >
                    2
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-orange-900 dark:text-orange-200">
                      {{ $t('accounts.oauth.step2Title') }}
                    </p>
                    <p class="mb-2 text-sm text-orange-700 dark:text-orange-300">
                      {{ $t('accounts.oauth.step2DescriptionOpenAI') }}
                    </p>
                    <div
                      class="mb-3 rounded border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/30"
                    >
                      <p class="text-xs text-amber-800 dark:text-amber-300">
                        <i class="fas fa-clock mr-1" />
                        <strong>{{ $t('accounts.oauth.openaiImportantNotice') }}</strong
                        >{{ $t('accounts.oauth.openaiWaitMessage') }}
                      </p>
                      <p class="mt-2 text-xs text-amber-700 dark:text-amber-400">
                        {{ $t('accounts.oauth.openaiAddressNotice') }}
                      </p>
                    </div>
                    <div
                      class="rounded border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-700 dark:bg-yellow-900/30"
                    >
                      <p class="text-xs text-yellow-800 dark:text-yellow-300">
                        <i class="fas fa-exclamation-triangle mr-1" />
                        <strong>{{ $t('accounts.oauth.proxyNotice') }}</strong
                        >{{ $t('accounts.oauth.proxyWarning') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤3: 输入授权码 -->
              <div
                class="rounded-lg border border-orange-300 bg-white/80 p-4 dark:border-orange-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white"
                  >
                    3
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-orange-900 dark:text-orange-200">
                      {{ $t('accounts.oauth.step3TitleOpenAI') }}
                    </p>
                    <p class="mb-3 text-sm text-orange-700 dark:text-orange-300">
                      {{ $t('accounts.oauth.step3DescriptionOpenAI') }}
                    </p>
                    <div class="space-y-3">
                      <div>
                        <label
                          class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          <i class="fas fa-link mr-2 text-orange-500" />{{
                            $t('accounts.oauth.authLinkOrCodeLabel')
                          }}
                        </label>
                        <textarea
                          v-model="authCode"
                          class="form-input w-full resize-none font-mono text-sm"
                          :placeholder="$t('accounts.oauth.placeholderOpenAI')"
                          rows="3"
                        />
                      </div>
                      <div
                        class="rounded border border-blue-300 bg-blue-50 p-2 dark:border-blue-700 dark:bg-blue-900/30"
                      >
                        <p class="text-xs text-blue-700 dark:text-blue-300">
                          <i class="fas fa-lightbulb mr-1" />
                          <strong>{{ $t('accounts.oauth.openaiTipTitle') }}</strong
                          >{{ $t('accounts.oauth.openaiTipDescription') }}
                        </p>
                        <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          {{ $t('accounts.oauth.openaiTipFullLink') }}
                        </p>
                        <p class="text-xs text-blue-600">
                          {{ $t('accounts.oauth.openaiTipCodeOnly') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Droid OAuth流程 -->
    <div v-else-if="platform === 'droid'">
      <div
        class="rounded-lg border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-700 dark:bg-cyan-900/30"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500"
          >
            <i class="fas fa-robot text-white" />
          </div>
          <div class="flex-1">
            <h4 class="mb-3 font-semibold text-cyan-900 dark:text-cyan-200">
              {{ $t('accounts.oauth.droidAuthTitle') }}
            </h4>
            <p class="mb-4 text-sm text-cyan-800 dark:text-cyan-300">
              {{ $t('accounts.oauth.instructionsDroid') }}
            </p>

            <div class="space-y-4">
              <!-- 步骤1: 生成授权链接 -->
              <div
                class="rounded-lg border border-cyan-300 bg-white/80 p-4 dark:border-cyan-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white"
                  >
                    1
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-cyan-900 dark:text-cyan-200">
                      {{ $t('accounts.oauth.step1Title') }}
                    </p>
                    <button
                      v-if="!authUrl"
                      class="btn btn-primary px-4 py-2 text-sm"
                      :disabled="loading"
                      @click="generateAuthUrl"
                    >
                      <i v-if="!loading" class="fas fa-link mr-2" />
                      <div v-else class="loading-spinner mr-2" />
                      {{
                        loading
                          ? $t('accounts.oauth.generating')
                          : $t('accounts.oauth.generateAuthLink')
                      }}
                    </button>
                    <div v-else class="space-y-4">
                      <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-600 dark:text-gray-300">{{
                          $t('accounts.oauth.droidAuthLink')
                        }}</label>
                        <div
                          class="flex flex-col gap-2 rounded-md border border-cyan-200 bg-white p-3 dark:border-cyan-700 dark:bg-gray-800"
                        >
                          <div class="flex items-center gap-2">
                            <input
                              class="form-input flex-1 bg-gray-50 font-mono text-xs dark:bg-gray-700"
                              readonly
                              type="text"
                              :value="authUrl"
                            />
                            <button
                              class="rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                              :title="$t('accounts.oauth.copyLink')"
                              @click="copyAuthUrl"
                            >
                              <i :class="copied ? 'fas fa-check text-green-500' : 'fas fa-copy'" />
                            </button>
                          </div>
                          <div class="flex flex-wrap items-center gap-2">
                            <button
                              class="inline-flex items-center gap-1 rounded-md border border-cyan-200 bg-white px-3 py-1.5 text-xs font-medium text-cyan-600 shadow-sm transition-colors hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200 dark:hover:border-cyan-500 dark:hover:bg-cyan-900/60"
                              @click="openVerificationPage"
                            >
                              <i class="fas fa-external-link-alt text-xs" />
                              {{ $t('accounts.oauth.droidOpenInNewTab') }}
                            </button>
                            <button
                              class="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200"
                              @click="regenerateAuthUrl"
                            >
                              <i class="fas fa-sync-alt text-xs" />{{
                                $t('accounts.oauth.regenerate')
                              }}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-600 dark:text-gray-300">{{
                          $t('accounts.oauth.droidAuthCode')
                        }}</label>
                        <div
                          class="flex items-center justify-between rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 dark:border-cyan-700 dark:bg-cyan-900/30"
                        >
                          <span
                            class="font-mono text-xl font-semibold text-cyan-700 dark:text-cyan-200"
                          >
                            {{ userCode || '------' }}
                          </span>
                          <button
                            class="rounded-lg bg-white px-3 py-1 text-sm text-cyan-600 transition-colors hover:bg-cyan-100 dark:bg-cyan-800 dark:text-cyan-200 dark:hover:bg-cyan-700"
                            @click="copyUserCode"
                          >
                            <i class="fas fa-copy mr-1" />{{ $t('accounts.oauth.droidCopy') }}
                          </button>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                      >
                        <span>
                          <i class="fas fa-hourglass-half mr-1 text-cyan-500" />
                          {{
                            $t('accounts.oauth.droidTimeRemaining', { time: formattedCountdown })
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤2: 访问链接并授权 -->
              <div
                class="rounded-lg border border-cyan-300 bg-white/80 p-4 dark:border-cyan-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white"
                  >
                    2
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-cyan-900 dark:text-cyan-200">
                      {{ $t('accounts.oauth.step2Title') }}
                    </p>
                    <div class="space-y-2 text-sm text-cyan-700 dark:text-cyan-300">
                      <p>
                        {{ $t('accounts.oauth.step2DescriptionDroid') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤3: 输入授权结果 -->
              <div
                class="rounded-lg border border-cyan-300 bg-white/80 p-4 dark:border-cyan-600 dark:bg-gray-800/80"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white"
                  >
                    3
                  </div>
                  <div class="flex-1">
                    <p class="mb-2 font-medium text-cyan-900 dark:text-cyan-200">
                      {{ $t('accounts.oauth.droidStep3Description') }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ $t('accounts.oauth.droidStep3Help') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        class="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        type="button"
        @click="$emit('back')"
      >
        {{ $t('accounts.oauth.previousStep') }}
      </button>
      <button
        class="btn btn-primary flex-1 px-6 py-3 font-semibold"
        :disabled="!canExchange || exchanging"
        type="button"
        @click="exchangeCode"
      >
        <div v-if="exchanging" class="loading-spinner mr-2" />
        {{ exchanging ? $t('accounts.oauth.verifying') : $t('accounts.oauth.completeAuth') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from '@/utils/toast'
import { useAccountsStore } from '@/stores/accounts'

const { t } = useI18n()

const props = defineProps({
  platform: {
    type: String,
    required: true
  },
  proxy: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['success', 'back'])

const accountsStore = useAccountsStore()

// 状态
const loading = ref(false)
const exchanging = ref(false)
const authUrl = ref('')
const authCode = ref('')
const copied = ref(false)
const sessionId = ref('') // 保存sessionId用于后续交换
const userCode = ref('')
const verificationUri = ref('')
const verificationUriComplete = ref('')
const remainingSeconds = ref(0)
let countdownTimer = null

// 计算是否可以交换code
const canExchange = computed(() => {
  if (props.platform === 'droid') {
    return !!sessionId.value
  }
  return authUrl.value && authCode.value.trim()
})

const formattedCountdown = computed(() => {
  if (!remainingSeconds.value || remainingSeconds.value <= 0) {
    return '00:00'
  }
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const startCountdown = (seconds) => {
  stopCountdown()
  if (!seconds || seconds <= 0) {
    remainingSeconds.value = 0
    return
  }

  remainingSeconds.value = Math.floor(seconds)
  countdownTimer = setInterval(() => {
    if (remainingSeconds.value <= 1) {
      remainingSeconds.value = 0
      stopCountdown()
    } else {
      remainingSeconds.value -= 1
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 监听授权码输入，自动提取URL中的code参数
watch(authCode, (newValue) => {
  if (props.platform === 'droid') return
  if (!newValue || typeof newValue !== 'string') return

  const trimmedValue = newValue.trim()

  // 如果内容为空，不处理
  if (!trimmedValue) return

  // 检查是否是 URL 格式（包含 http:// 或 https://）
  const isUrl = trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')

  // 如果是 URL 格式
  if (isUrl) {
    // 检查是否是正确的 localhost 回调 URL
    if (
      trimmedValue.startsWith('http://localhost:45462') ||
      trimmedValue.startsWith('http://localhost:1455')
    ) {
      try {
        const url = new URL(trimmedValue)
        const code = url.searchParams.get('code')

        if (code) {
          // 成功提取授权码
          authCode.value = code
          showToast(t('accounts.oauth.authCodeExtracted'), 'success')
        } else {
          // URL 中没有 code 参数
          showToast(t('accounts.oauth.authCodeNotFound'), 'error')
        }
      } catch (error) {
        // URL 解析失败
        showToast(t('accounts.oauth.oauthFlow.common.linkFormatError'), 'error')
      }
    } else if (props.platform === 'gemini' || props.platform === 'openai') {
      // Gemini 和 OpenAI 平台可能使用不同的回调URL
      // 尝试从任何URL中提取code参数
      try {
        const url = new URL(trimmedValue)
        const code = url.searchParams.get('code')

        if (code) {
          authCode.value = code
          showToast(t('accounts.oauth.authCodeExtracted'), 'success')
        }
      } catch (error) {
        // 不是有效的URL，保持原值
      }
    } else {
      // 错误的 URL（不是正确的 localhost 回调地址）
      showToast(t('accounts.oauth.oauthFlow.common.wrongCallbackUrl'), 'error')
    }
  }
  // 如果不是 URL，保持原值（兼容直接输入授权码）
})

// 生成授权URL
const generateAuthUrl = async () => {
  stopCountdown()
  authUrl.value = ''
  authCode.value = ''
  userCode.value = ''
  verificationUri.value = ''
  verificationUriComplete.value = ''
  remainingSeconds.value = 0
  sessionId.value = ''
  copied.value = false
  loading.value = true
  try {
    const proxyConfig = props.proxy?.enabled
      ? {
          proxy: {
            type: props.proxy.type,
            host: props.proxy.host,
            port: parseInt(props.proxy.port),
            username: props.proxy.username || null,
            password: props.proxy.password || null
          }
        }
      : {}

    if (props.platform === 'claude') {
      const result = await accountsStore.generateClaudeAuthUrl(proxyConfig)
      authUrl.value = result.authUrl
      sessionId.value = result.sessionId
    } else if (props.platform === 'gemini') {
      const result = await accountsStore.generateGeminiAuthUrl(proxyConfig)
      authUrl.value = result.authUrl
      sessionId.value = result.sessionId
    } else if (props.platform === 'openai') {
      const result = await accountsStore.generateOpenAIAuthUrl(proxyConfig)
      authUrl.value = result.authUrl
      sessionId.value = result.sessionId
    } else if (props.platform === 'droid') {
      const result = await accountsStore.generateDroidAuthUrl(proxyConfig)
      authUrl.value = result.verificationUriComplete || result.verificationUri
      verificationUri.value = result.verificationUri
      verificationUriComplete.value = result.verificationUriComplete || result.verificationUri
      userCode.value = result.userCode
      startCountdown(result.expiresIn || 300)
      sessionId.value = result.sessionId
    }
  } catch (error) {
    showToast(error.message || t('accounts.oauth.oauthFlow.common.generateAuthUrlFailed'), 'error')
  } finally {
    loading.value = false
  }
}

// 重新生成授权URL
const regenerateAuthUrl = () => {
  stopCountdown()
  authUrl.value = ''
  authCode.value = ''
  userCode.value = ''
  verificationUri.value = ''
  verificationUriComplete.value = ''
  remainingSeconds.value = 0
  sessionId.value = ''
  generateAuthUrl()
}

// 复制授权URL
const copyAuthUrl = async () => {
  if (!authUrl.value) {
    showToast(t('accounts.oauth.oauthFlow.common.generateFirst'), 'warning')
    return
  }
  try {
    await navigator.clipboard.writeText(authUrl.value)
    copied.value = true
    showToast(t('accounts.oauth.oauthFlow.common.linkCopied'), 'success')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    // 降级方案
    const input = document.createElement('input')
    input.value = authUrl.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    showToast(t('accounts.oauth.oauthFlow.common.linkCopied'), 'success')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

const copyUserCode = async () => {
  if (!userCode.value) {
    showToast(t('accounts.oauth.oauthFlow.common.generateCodeFirst'), 'warning')
    return
  }
  try {
    await navigator.clipboard.writeText(userCode.value)
    showToast(t('accounts.oauth.oauthFlow.common.codeCopied'), 'success')
  } catch (error) {
    const input = document.createElement('input')
    input.value = userCode.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    showToast(t('accounts.oauth.oauthFlow.common.codeCopied'), 'success')
  }
}

const openVerificationPage = () => {
  if (verificationUriComplete.value) {
    window.open(verificationUriComplete.value, '_blank', 'noopener')
  } else if (verificationUri.value) {
    window.open(verificationUri.value, '_blank', 'noopener')
  }
}

// 交换授权码
const exchangeCode = async () => {
  if (!canExchange.value) return

  exchanging.value = true
  try {
    let data = {}

    if (props.platform === 'claude') {
      // Claude使用sessionId和callbackUrl（即授权码）
      data = {
        sessionId: sessionId.value,
        callbackUrl: authCode.value.trim()
      }
    } else if (props.platform === 'gemini') {
      // Gemini使用code和sessionId
      data = {
        code: authCode.value.trim(),
        sessionId: sessionId.value
      }
    } else if (props.platform === 'openai') {
      // OpenAI使用code和sessionId
      data = {
        code: authCode.value.trim(),
        sessionId: sessionId.value
      }
    } else if (props.platform === 'droid') {
      data = {
        sessionId: sessionId.value
      }
    }

    // 添加代理配置（如果启用）
    if (props.proxy?.enabled) {
      data.proxy = {
        type: props.proxy.type,
        host: props.proxy.host,
        port: parseInt(props.proxy.port),
        username: props.proxy.username || null,
        password: props.proxy.password || null
      }
    }

    let tokenInfo
    if (props.platform === 'claude') {
      tokenInfo = await accountsStore.exchangeClaudeCode(data)
    } else if (props.platform === 'gemini') {
      tokenInfo = await accountsStore.exchangeGeminiCode(data)
    } else if (props.platform === 'openai') {
      tokenInfo = await accountsStore.exchangeOpenAICode(data)
    } else if (props.platform === 'droid') {
      const response = await accountsStore.exchangeDroidCode(data)
      if (!response.success) {
        if (response.pending) {
          const message =
            response.message || t('accounts.oauth.oauthFlow.common.authorizationPending')
          showToast(message, 'info')
          if (typeof response.expiresIn === 'number' && response.expiresIn >= 0) {
            startCountdown(response.expiresIn)
          }
          return
        }
        throw new Error(response.message || t('accounts.oauth.oauthFlow.common.authFailed'))
      }
      tokenInfo = response.data
      stopCountdown()
    }

    emit('success', tokenInfo)
  } catch (error) {
    showToast(error.message || t('accounts.oauth.oauthFlow.common.authFailed'), 'error')
  } finally {
    exchanging.value = false
  }
}

onBeforeUnmount(() => {
  stopCountdown()
})
</script>
