# Contributing to Shadix UI

## Branch Strategy

- **`dev`**: Primary development branch (target for all PRs)
- **`main`**: Production branch (deployments only)

## Getting Started

### 1. Setup
```bash
git clone <repository-url>
cd shadix-ui
pnpm run dev:setup
```

### 2. Create Feature Branch
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Edit components, add new features, fix bugs
- Pre-commit hooks will automatically format and lint your code

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new component"
```

### 5. Push and Create PR
```bash
git push -u origin feature/your-feature-name
```
Then create a Pull Request targeting the `dev` branch.

## Code Quality

All code is automatically checked for:
- ✅ **Formatting** (Biome)
- ✅ **Linting** (Biome)
- ✅ **Import Organization** (Biome)
- ✅ **Registry Build** (shadcn)

## Available Commands

```bash
# Check code quality
pnpm run check

# Format all files
pnpm run format

# Lint all files
pnpm run lint

# Build registry
pnpm run registry:build

# Build everything
pnpm run build:all
```

## PR Requirements

- ✅ All CI checks must pass
- ✅ Code must be properly formatted
- ✅ No linting errors
- ✅ Registry must build successfully

## Questions?

If you have any questions, please open an issue or reach out to the maintainers.
