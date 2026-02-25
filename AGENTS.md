# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Shadix UI is a static documentation site and custom shadcn/ui component registry built with **Next.js 15** (App Router, Turbopack), **React 19**, **Fumadocs**, and **Tailwind CSS v4**. No database or Docker required.

### Package Manager

Use **pnpm** exclusively (lockfile: `pnpm-lock.yaml`, pinned to 10.20.0 via `packageManager` field). Node.js >=20 required.

### Key Commands

See `CONTRIBUTING.md` and `package.json` scripts for the full list. Summary:

- **Dev server**: `pnpm dev` (starts on port 3000 with Turbopack)
- **Lint**: `pnpm run lint` (Biome — only CSS class sort warnings are expected, exit code 0)
- **Format**: `pnpm run format`
- **Check (lint + format)**: `pnpm run check`
- **Build**: `pnpm run build` (runs registry:build then next build)
- **Registry build**: `pnpm run registry:build` (must run before dev/build to generate `registry/__index__.tsx` and `public/r/*.json`)

### Gotchas

- **Build scripts approval**: The `pnpm.onlyBuiltDependencies` field in `package.json` must list `@tailwindcss/oxide`, `esbuild`, `msw`, and `sharp` so their native postinstall scripts run. Without this, Tailwind CSS and the build toolchain will not work. Do NOT run `pnpm approve-builds` (it's interactive).
- **Registry must be built before dev/build**: `pnpm run registry:build` generates required files. The `dev:setup` script handles this automatically (`pnpm install && pnpm run registry:build`).
- **No ESLint**: This project uses **Biome** (not ESLint) for linting and formatting. Config is in `biome.json`.
- **No automated test suite**: There are no unit/integration tests. Validation is done through Biome lint/format checks and successful builds.
- **Pre-commit hook**: Husky runs `lint-staged` which applies Biome checks on staged files.
- **Environment variables**: All env vars are optional. Copy `.env.sample` to `.env` for defaults. `NEXT_GITHUB_TOKEN` is only needed for the GitHub contributor stats feature.
