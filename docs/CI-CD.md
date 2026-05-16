# CI/CD Pipeline Documentation

> **Last Updated:** 2026-05-16
> **Repository:** [hariz-indratama/HRIS](https://github.com/hariz-indratama/HRIS)

---

## Table of Contents

1. [Overview](#overview)
2. [Workflow Architecture](#workflow-architecture)
3. [Step-by-Step: GitHub Actions Setup](#step-by-step-github-actions-setup)
4. [Workflow Details](#workflow-details)
   - [API CI (Laravel)](#api-ci-laravel)
   - [Web CI (Vue)](#web-ci-vue)
5. [Branch Protection](#branch-protection)
6. [Secrets & Environment Variables](#secrets--environment-variables)
7. [Monitoring CI Runs](#monitoring-ci-runs)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses **GitHub Actions** for CI/CD. Every push and pull request triggers automated checks:

```
Push / PR → GitHub Actions → Automated Tests → Result
```

Both workflows are defined in `.github/workflows/` and run **in parallel** when relevant files change.

---

## Workflow Architecture

```
┌─────────────────────────────────────────────────────┐
│                    GitHub Repository                  │
│              github.com/hariz-indratama/HRIS          │
└──────────────────────┬────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                              ▼
┌───────────────┐              ┌───────────────┐
│   API CI      │              │   Web CI      │
│  (api-ci.yml) │              │ (web-ci.yml)  │
├───────────────┤              ├───────────────┤
│ PHP Lint      │              │ ESLint        │
│ PHPStan       │              │ vue-tsc       │
│ PHPUnit       │              │ Vite Build    │
└───────────────┘              └───────────────┘
        │                              │
        └──────────────┬──────────────┘
                       ▼
              ┌───────────────┐
              │  PR Status    │
              │  Checks Pass? │
              └───────────────┘
```

### Path Filtering

Each workflow only runs when its relevant files change:

| Workflow | Triggers When |
|---|---|
| `api-ci.yml` | `api/**` or `.github/workflows/api-ci.yml` changes |
| `web-ci.yml` | `web/**` or `.github/workflows/web-ci.yml` changes |

---

## Step-by-Step: GitHub Actions Setup

### Step 1: Push Code to GitHub

```bash
# API
cd c:/HRIS\ APP\ V2/hris/api
git remote add origin https://github.com/hariz-indratama/HRIS.git
git branch -M main
git push -u origin main

# Web
cd c:/HRIS\ APP\ V2/hris/web
git remote add origin https://github.com/hariz-indratama/HRIS.git
git branch -M main
git push -u origin main
```

### Step 2: View Workflows on GitHub

1. Go to → https://github.com/hariz-indratama/HRIS/actions
2. You should see the workflows listed:
   - **API — Laravel CI**
   - **Web — Vue CI**

### Step 3: First Workflow Run

After pushing, GitHub Actions automatically runs the workflows.

1. Go to → https://github.com/hariz-indratama/HRIS/actions
2. Click on a workflow name
3. See the real-time job progress

### Step 4: Enable Branch Protection (Recommended)

Protect the `main` branch so code can't be pushed directly — only via Pull Requests:

1. Go to → https://github.com/hariz-indratama/HRIS/settings/branches
2. Click **Add rule**
3. Set:
   - **Branch name pattern:** `main`
   - ✅ **Require pull request before merging**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merge**
4. Click **Save**

### Step 5: Add Status Badge to README

Add this to your `README.md` to show CI status:

```markdown
[![API CI](https://github.com/hariz-indratama/HRIS/actions/workflows/api-ci.yml/badge.svg)](https://github.com/hariz-indratama/HRIS/actions/workflows/api-ci.yml)
[![Web CI](https://github.com/hariz-indratama/HRIS/actions/workflows/web-ci.yml/badge.svg)](https://github.com/hariz-indratama/HRIS/actions/workflows/web-ci.yml)
```

---

## Workflow Details

### API CI (Laravel)

**File:** `.github/workflows/api-ci.yml`

#### Job 1: PHP Lint (Laravel Pint)

```yaml
- name: Laravel Pint (Code Style)
  run: ./vendor/bin/pint --test
```

**What it does:**
- Runs Laravel Pint to check code style
- Uses project rules from `pint.json` (if exists) or defaults
- Fails if code doesn't match style rules

**Fix style errors automatically:**
```bash
cd api
./vendor/bin/pint
```

#### Job 2: PHPStan Static Analysis

```yaml
- name: PHPStan
  run: ./vendor/bin/phpstan analyse --memory-limit=512M
```

**What it does:**
- Runs PHPStan at maximum strictness
- Detects type errors, undefined variables, wrong return types
- Fails before runtime if code has type issues

**Install PHPStan (if not installed):**
```bash
cd api
composer require --dev phpstan/phpstan larastan/larastan --dev
php artisan vendor:publish --provider="Larastan\LarastanServiceProvider"
./vendor/bin/phpstan analyse
```

#### Job 3: PHPUnit Tests

```yaml
- name: PHPUnit
  run: ./vendor/bin/phpunit --testdox
```

**What it does:**
- Runs all unit and feature tests
- Uses MySQL 8.0 service container
- Runs migrations before tests
- `--testdox` flag shows human-readable test names

**Write a test:**
```bash
cd api
./vendor/bin/phpunit --testdox
```

**Run a specific test:**
```bash
./vendor/bin/phpunit --filter=AttendanceTest --testdox
```

---

### Web CI (Vue)

**File:** `.github/workflows/web-ci.yml`

#### Job 1: ESLint + Type Check

```yaml
- name: ESLint
  run: npm run lint

- name: TypeScript Check
  run: npx vue-tsc --noEmit
```

**What ESLint does:**
- Checks code style and potential bugs
- Uses rules from `.eslintrc.js`

**Fix ESLint errors automatically:**
```bash
cd web
npm run lint
```

**What vue-tsc does:**
- Type-checks all TypeScript files
- Fails if any type error exists
- Does NOT modify files

**Fix TypeScript errors:**
```bash
# Find errors
npx vue-tsc --noEmit

# Fix type errors manually (no auto-fix for types)
# Edit the files flagged by vue-tsc
```

#### Job 2: Vite Build

```yaml
- name: Vite Build
  run: npm run build
```

**What it does:**
- Builds production bundle
- Runs `vue-tsc -b && vite build`
- Fails if build has errors
- Uploads `dist/` as a GitHub Artifact (retained 7 days)

**Preview production build locally:**
```bash
cd web
npm run build
npm run preview
```

---

## Branch Protection

### Without Branch Protection (Default)

Anyone can push directly to `main`:
```bash
git push origin main  # ✅ Allowed — no review needed
```

### With Branch Protection (Recommended)

Only PRs can merge to `main`:

```bash
git push origin my-feature  # ✅ Push feature branch
# → Open PR on GitHub
# → CI runs automatically
# → If CI passes → merge button enabled
# → If CI fails → merge blocked
```

### Recommended Branch Strategy

```
main          ← protected, CI must pass
develop       ← integration branch (optional)
feat/my-branch ← your feature branches
```

```bash
# Create feature branch
git checkout -b feat/my-feature

# Work on feature...
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push -u origin feat/my-feature
# → GitHub shows "Compare & pull request" button
```

---

## Secrets & Environment Variables

### GitHub Secrets (for private repos)

For private projects, add secrets at:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description |
|---|---|
| `MYSQL_PASSWORD` | MySQL password for test database |
| `APP_DEBUG_KEY` | Debug API key (optional) |

### Environment Variables for CI

The API CI creates a `.env` automatically:

```yaml
- name: Setup Env
  run: |
    cp .env.example .env
    php artisan key:generate
```

For the Web CI, the build uses `.env` (or `.env.example`):

```yaml
VITE_API_BASE_URL=https://your-api.com/api/v1
```

### Adding Environment Variables to GitHub

1. Go to → https://github.com/hariz-indratama/HRIS/settings/secrets/actions
2. Click **New repository secret**
3. Add:
   - **Name:** `VITE_API_BASE_URL`
   - **Secret:** `https://your-production-api.com/api/v1`
4. Use in workflow:

```yaml
- name: Build
  env:
    VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
  run: npm run build
```

---

## Monitoring CI Runs

### View All Runs

```
https://github.com/hariz-indratama/HRIS/actions
```

### View Specific Workflow

```
https://github.com/hariz-indratama/HRIS/actions/workflows/api-ci.yml
https://github.com/hariz-indratama/HRIS/actions/workflows/web-ci.yml
```

### View Run Details

1. Click on a workflow run
2. See each job's logs in real-time
3. Download build artifacts

### Enable Notifications

1. Go to → https://github.com/hariz-indratama/HRIS/settings/notifications
2. Under **GitHub Actions**, choose:
   - **Email** — get notified on failure
   - **Discord/Slack** — via GitHub webhook integration

---

## Troubleshooting

### CI Fails — Common Issues

#### PHP Lint Fail (Pint)

```
✖ Laravel Pint found 12 files that need formatting
```

**Fix:**
```bash
cd api
./vendor/bin/pint
git add .
git commit -m "style: fix pint formatting"
git push
```

#### PHPStan Fail

```
Line 42: Call to undefined method User::getId()
```

**Fix:** Check the method exists in the model:
```bash
cd api
./vendor/bin/phpstan analyse app/Models/User.php --memory-limit=512M
```

#### PHPUnit Fail

```
1) Tests\Feature\AttendanceTest::test_clock_in
   Expected status 200, got 500.
```

**Fix:** Check the error in the CI log:
1. Go to GitHub Actions → click the failing run
2. Expand the PHPUnit job
3. Scroll to the error message
4. Fix the bug locally, commit, push

#### ESLint Fail

```
error: Unexpected console statement  no-console
```

**Fix:**
```bash
cd web
npm run lint  # Auto-fixes most issues
git add .
git commit -m "fix: resolve eslint errors"
git push
```

#### vue-tsc Fail

```
error TS2322: Type 'string | null' is not assignable to type 'string'.
```

**Fix:** Add proper null check:
```typescript
// Before
const name = user.name

// After
const name = user.name ?? ''
```

#### Build Fail

```
vite v8.x.x building for production...
error: Pre-transform error: Failed to resolve import
```

**Fix:** Check for:
1. Missing dependency → `npm install`
2. Wrong import path → fix the import
3. Environment variable not set → add to `.env`

---

### Retry a Failed Run

1. Go to → https://github.com/hariz-indratama/HRIS/actions
2. Click the failed workflow
3. Click **Re-run all jobs** (top right)

---

### Skip CI for a Commit

Add `[skip ci]` or `[ci skip]` to your commit message:

```bash
git commit -m "docs: update README [skip ci]"
```

---

### Enable Debug Logging

Add `debug: true` to a job in the workflow:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    debug: true  # ← Enables runner debug mode
    steps:
      - uses: actions/checkout@v4
```

---

## Summary: Git Workflow with CI

```bash
# 1. Create feature branch
git checkout -b feat/my-feature

# 2. Write code
# ... make changes ...

# 3. Run checks locally
cd api && ./vendor/bin/pint && ./vendor/bin/phpstan analyse
cd ../web && npm run lint && npx vue-tsc --noEmit

# 4. Commit
git add .
git commit -m "feat: add attendance history page"

# 5. Push & create PR
git push -u origin feat/my-feature
# → GitHub opens PR → CI runs automatically

# 6. If CI fails → fix locally, amend or push new commit
git push

# 7. If CI passes → Merge button enabled on GitHub
# → Click "Squash and merge"
```

---

## Resources

| Resource | URL |
|---|---|
| GitHub Actions Docs | https://docs.github.com/en/actions |
| Laravel Pint | https://pint.dev |
| PHPStan | https://phpstan.org |
| PHPUnit | https://phpunit.de |
| ESLint | https://eslint.org |
| vue-tsc | https://github.com/vuejs/language-tools |
