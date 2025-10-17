# Branch Protection Setup Guide

## How to Enable Branch Protection for PRs

### 1. Go to Repository Settings
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar

### 2. Add Branch Protection Rule
1. Click **Add rule**
2. Set **Branch name pattern** to `main` (or `dev`)
3. Enable these options:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Restrict pushes that create files larger than 100 MB**

### 3. Select Required Status Checks
In the "Require status checks to pass before merging" section:
- ✅ **Check "Require branches to be up to date before merging"**
- ✅ **Add status check**: `check` (this is your Biome CI job)

### 4. Additional Options (Recommended)
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (optional)
- ✅ **Require linear history** (optional)

### 5. Save the Rule
Click **Create** to save the branch protection rule.

## What This Achieves

### For Contributors:
- 🔒 **Cannot push directly** to `main` branch
- 🔄 **Must create PR** for all changes
- ✅ **CI must pass** before PR can be merged
- 🛡️ **Code quality enforced** automatically

### For Maintainers:
- 🔍 **Review required** for all changes
- ✅ **Quality assurance** through automated checks
- 🚫 **No broken code** can be merged
- 📊 **Clear status** of PR checks

## PR Workflow Example

```bash
# 1. Contributor creates feature branch
git checkout -b feature/new-component
git push -u origin feature/new-component

# 2. Contributor creates PR on GitHub
# 3. GitHub Actions runs automatically:
#    - Installs dependencies
#    - Builds registry
#    - Runs Biome checks
#    - Reports status

# 4. If checks pass ✅:
#    - PR can be merged
#    - Maintainer reviews and approves

# 5. If checks fail ❌:
#    - PR is blocked
#    - Contributor fixes issues
#    - Pushes new commits
#    - CI runs again
```

## Status Check Names

Your CI job is named `check`, so you'll see:
- ✅ **check** - Biome formatting, linting, and registry build
- ✅ **All checks passed** - Ready to merge
- ❌ **check** - Issues found, PR blocked

## Benefits

1. **🛡️ Quality Gate**: No low-quality code reaches main branch
2. **🔄 Consistency**: All code follows same standards
3. **⚡ Fast Feedback**: Issues caught early in PR process
4. **👥 Team Confidence**: Everyone knows code meets standards
5. **🚀 Smooth Deployments**: Main branch always deployable
