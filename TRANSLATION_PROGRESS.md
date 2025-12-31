# Translation Progress Tracker

## Views (web/admin-spa/src/views/)

| File | Status | Keys Added | Date | Notes |
|------|--------|------------|------|-------|
| ApiKeysView.vue | ✅ DONE | 43 | 2025-11-27 | Fully translated |
| AccountsView.vue | ✅ DONE | 0 | 2025-11-27 | Already translated (105 keys exist) |
| ApiStatsView.vue | ✅ DONE | 1 | 2025-11-27 | Already translated, added adminPanel |
| DashboardView.vue | ✅ DONE | 1 | 2025-11-27 | Already translated, added common.times |
| LoginView.vue | ✅ DONE | 0 | 2025-11-27 | Already translated (9 keys exist) |
| SettingsView.vue | ✅ DONE | 94 | 2025-11-27 | Fully translated (Telegram, Bark, SMTP) |
| TutorialView.vue | ✅ DONE | 15 | 2025-11-27 | macOS troubleshooting section |
| UserDashboardView.vue | ✅ DONE | 20 | 2025-11-27 | Dashboard overview, stats, account info |
| UserLoginView.vue | ✅ DONE | 12 | 2025-11-27 | User login form complete |
| UserManagementView.vue | ✅ DONE | 45 | 2025-11-27 | User management complete |

## Components - API Keys (web/admin-spa/src/components/apikeys/)

| File | Status | Keys Added | Date | Notes |
|------|--------|------------|------|-------|
| BatchApiKeyModal.vue | ✅ DONE | 35 | 2025-11-27 | Manual translation |
| CreateApiKeyModal.vue | ✅ DONE | 0 | - | Already translated |
| EditApiKeyModal.vue | ✅ DONE | 6 | 2025-11-27 | Agent translated |
| NewApiKeyModal.vue | ✅ DONE | 28 | 2025-11-27 | Agent translated |
| RenewApiKeyModal.vue | ✅ DONE | 17 | 2025-11-27 | Agent translated |
| BatchEditApiKeyModal.vue | ✅ DONE | 48 | 2025-11-27 | Agent translated (batchEdit namespace) |
| ExpiryEditModal.vue | ✅ DONE | 24 | 2025-11-27 | Agent translated (apiKeys.expiryModal) |
| UsageDetailModal.vue | ✅ DONE | 8 | 2025-11-27 | Agent translated (apikeys namespace) |
| WindowLimitBar.vue | ✅ DONE | 4 | 2025-11-27 | Agent translated (apiKeys.windowLimitBar) |
| WindowCountdown.vue | ✅ DONE | 10 | 2025-11-27 | Agent translated (apiKeys.windowCountdown) |
| ViewApiKeyModal.vue | ⏳ TODO | - | - | Not found / doesn't exist |
| LimitBadge.vue | ⏳ TODO | - | - | - |

## Components - Other

| Directory | Files to Check |
|-----------|---------------|
| web/admin-spa/src/components/accounts/ | All files |
| web/admin-spa/src/components/apistats/ | All files |
| web/admin-spa/src/components/common/ | All files |
| web/admin-spa/src/components/layout/ | All files |
| web/admin-spa/src/components/user/ | All files |

## Current Locale Stats
- Total keys: ~2287 per language (+3 missing keys restored)
- Previous session: +184 keys
- Total added today: +281 keys (including 3 missing key fixes)
- Languages: zh (Chinese), en (English), ru (Russian)
- All files in sync: ✅

## Recent Fixes (2025-11-27)
- ✅ Fixed 3 missing keys found in tmp_missing_keys.json:
  - `accounts.dedicated` (专属 / Dedicated / Выделенный)
  - `accounts.form.updating` (更新中... / Updating... / Обновление...)
  - `accounts.enable` (是 / Yes / Да)
- Created automated script: `scripts/add-missing-keys.js`

## Views Summary
- Total views: 10
- Completed: 10 ✅
- Remaining: 0

## API Keys Components Summary
- Total components: 12
- Completed: 11 ✅
- Remaining: 1 (LimitBadge.vue)

## Next Files for Parallel Processing
1. LimitBadge.vue (apikeys/)
2. Components in accounts/ directory
3. Components in apistats/ directory
4. Components in common/ directory
5. Components in layout/ directory
