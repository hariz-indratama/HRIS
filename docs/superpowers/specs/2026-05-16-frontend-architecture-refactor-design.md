# Frontend Architecture Refactoring — Design Spec

> **Project:** HRIS APP V2 Frontend (`hris/web/src/`)\
> **Date:** 2026-05-16\
> **Scope:** Comprehensive 4-phase refactoring targeting 18 findings (6 CRITICAL, 7 WARNING, 5 OPTIMIZATION)\
> **Branch:** `refactor/frontend-architecture`

---

## 1. Context & Motivation

The HRIS V2 frontend is architecturally mature compared to V1, demonstrating clean separation of API clients, Pinia stores, composables, and views. However, accumulated technical debt across design tokens, component size, PWA UX, and auth flow creates risk for maintainability and dark mode readiness. This refactoring eliminates all critical and warning findings in a structured 4-phase approach.

**Key existing strengths preserved:**
- 3-layer data architecture: `API Client → Pinia Store → Composable → View`
- Correct Shadcn semantic color usage in desktop views
- Skeleton loaders, empty states, and error states in PWA pages
- All API calls isolated in dedicated service files
- Typed TypeScript throughout

---

## 2. Design Token Unification (Shadcn-Only)

### Decision
**Approach A: Migrate Everything to Shadcn** — Delete Stitch tokens entirely, map any unique Stitch colors into Shadcn HSL variables in `tailwind.config.js`.

### Rationale
- Single source of truth — eliminates dual token maintenance burden
- Full Shadcn ecosystem compatibility
- Lighter Tailwind config (removes dead `stitch-*` tokens)
- Clean dark mode preparation (Shadcn CSS variable dark mode is standard)

### Scope
- Delete all `stitch-*` class references in components → map to Shadcn equivalents
- Update `tailwind.config.js` to remove Stitch palette, extend Shadcn HSL tokens with any unique Stitch colors
- Replace `bg-white` in all PWA pages → `bg-card`
- Replace `bg-stitch-surface` → `bg-card`
- Replace `text-stitch-primary` → `text-foreground`
- Replace `border-stitch-outline-variant` → `border-border`

### Dark Mode
**Excluded from this phase** — light mode only. Dark mode implementation is a future dedicated pass. The Shadcn token system is architected to support it when ready.

---

## 3. Phase Breakdown

### Phase 1 — Critical Debt Elimination (Days 1–2)

| # | Task | Files |
|---|---|---|
| 1.1 | Delete scaffold boilerplate: remove `HelloWorld.vue`, strip `style.css` to only `@tailwind` directives and Shadcn CSS variable definitions | `HelloWorld.vue`, `style.css` |
| 1.2 | Unify token system: delete all `stitch-*` class references, remove Stitch palette from `tailwind.config.js`, extend Shadcn with any unique Stitch values | All PWA pages, `tailwind.config.js` |
| 1.3 | Fix `useStatusStyles`: replace `bg-green-50` → `bg-success/10`, `text-green-700` → `text-success`, `bg-amber-50` → `bg-warning/10`, `text-amber-700` → `text-warning` | `composables/useStatusStyles.ts` |
| 1.4 | Fix auth flow: inspect Laravel Sanctum config, verify cookie vs token auth, either remove misleading Bearer interceptor (if cookie-based) or fix `setAuth()` to pass the real token | `services/api/client.ts`, `authStore.ts`, `LoginPage.vue`, `useAuth.ts` |
| 1.5 | Replace all `bg-white` in PWA pages → `bg-card` | All PWA pages |
| 1.6 | Replace `bg-amber-400` literal leak → `bg-warning` in `AttPwaRiwayatPage.vue` | `AttPwaRiwayatPage.vue` |

### Phase 2 — Component Decomposition (Days 3–4)

| # | Task | Files |
|---|---|---|
| 2.1 | Extract `ClockHeroCard`, `MonthlySummary`, `GeofenceBadge`, `ClockInOutCta` to `components/pwa/` | Decompose `AttPwaHomePage.vue` |
| 2.2 | Extract `BiometricScanner`, `VerificationResult`, `RecentActivity` to `components/pwa/` | Decompose `AttPwaAbsenPage.vue` |
| 2.3 | Wire `useAttendance` composable into all PWA pages, delete duplicated `getDeviceId()` | `AttPwaHomePage.vue`, `useAttendance.ts` |
| 2.4 | Wire `useAuth` composable in `LoginPage.vue`, remove raw `authApi.login()` call | `LoginPage.vue`, `useAuth.ts` |

### Phase 3 — UX Hardening (Day 5)

| # | Task | Files |
|---|---|---|
| 3.1 | Fix bottom nav touch targets: `py-1` → `py-2.5 min-h-[44px] min-w-[44px]` | `AppPwaLayout.vue` |
| 3.2 | Convert inline `:style` safe-area bindings → Tailwind arbitrary utilities: `pt-[env(safe-area-inset-top)]`, `pb-[calc(0.5rem+env(safe-area-inset-bottom))]` | `AppPwaLayout.vue` |
| 3.3 | Install Shadcn Sonner, create `useToast` composable wrapper, replace all `alert()` calls with toast | `AttPwaHomePage.vue`, new composable |
| 3.4 | Fix 401 interceptor: replace `window.location.href` → Vue Router `router.push('/login')` | `services/api/client.ts` |
| 3.5 | Replace `<p>Loading...</p>` with `SkeletonCard` component in `HistoryPage.vue` | `HistoryPage.vue` |

### Phase 4 — Polish (Day 6)

| # | Task | Files |
|---|---|---|
| 4.1 | Create `useDateFormat` composable: extract date/time formatting from `HistoryPage.vue` and `AttPwaRiwayatPage.vue` | New composable, refactored pages |
| 4.2 | Create `extractApiError()` utility in `lib/utils.ts`: shared Axios error extraction for all stores | `lib/utils.ts`, all stores |
| 4.3 | Remove dead `status.*` tokens from `tailwind.config.js` OR wire them into `useStatusStyles` | `tailwind.config.js` |

---

## 4. Component Architecture

### New `components/pwa/` Directory

```
components/pwa/
  ClockHeroCard.vue      # Clock display hero with date/time
  MonthlySummary.vue     # Monthly attendance summary card
  GeofenceBadge.vue      # Geofence status indicator
  ClockInOutCta.vue      # Clock-in / Clock-out action button
  BiometricScanner.vue   # Biometric verification UI
  VerificationResult.vue # Post-verification result display
  RecentActivity.vue     # Recent activity list component
```

Each component is self-contained, receives props for data, emits events for actions. Target: max 80–100 lines per component.

### New Shared Composables

```
composables/
  useDateFormat.ts       # formatDate(), formatTime(), formatDateTime()
  useToast.ts            # useToast() wrapper around Sonner
```

### Utility Extension

```
lib/utils.ts
  extractApiError(err: unknown): string  # Extracts server message from Axios errors
```

---

## 5. Testing Strategy

### Track 1 — Unit Tests (Vitest)

| Test File | Coverage |
|---|---|
| `composables/useStatusStyles.test.ts` | Token returns correct classes for all 4 status states |
| `composables/useAuth.test.ts` | Login flow, token handling, redirect logic |
| `composables/useAttendance.test.ts` | clockIn, clockOut, fetchToday, getDeviceId |
| `lib/utils.test.ts` | `extractApiError()` with Axios error, plain error, string error |
| `composables/useDateFormat.test.ts` | formatDate, formatTime, formatDateTime |

### Track 2 — E2E Tests (Playwright)

| Test File | Coverage |
|---|---|
| `e2e/auth.spec.ts` | Login success, login failure, redirect guards |
| `e2e/attendance.spec.ts` | Clock-in, clock-out, geofence validation error |
| `e2e/pwa-navigation.spec.ts` | PWA bottom nav, home → absen → riwayat → profil flow |

---

## 6. Git Strategy

- **Branch:** `refactor/frontend-architecture` (from `main`)
- **Commits:** Per-phase commits — `phase 1: critical debt`, `phase 2: decomposition`, `phase 3: ux hardening`, `phase 4: polish`, `tests: unit + e2e`
- **PR:** Single PR at the end covering all 4 phases and tests

---

## 7. Success Criteria

- All 6 CRITICAL findings resolved
- All 7 WARNING findings resolved
- All 5 OPTIMIZATION findings resolved
- All unit tests passing
- All E2E tests passing
- No `alert()` calls remaining in codebase
- No `HelloWorld.vue` or scaffold CSS in `style.css`
- All PWA pages under 200 lines
- `bg-card` used instead of `bg-white` in all PWA pages
- `useAuth`, `useAttendance`, `useStatusStyles` composables wired correctly everywhere