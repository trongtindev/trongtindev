# Repository Guidelines

Maintainer: Nguyen Trong Tin — Personal website built with Nuxt 4 and Nuxt UI.

## Project Structure & Module Organization
- `nuxt.config.ts`: Nuxt app config and modules.
- `app.vue`, `app.config.ts`: root shell and app metadata.
- `pages/`: route-driven pages (`kebab-case.vue` maps to `/kebab-case`).
- `components/`: reusable UI (PascalCase `.vue`), prefer Nuxt UI components.
- `layouts/`: shared page layouts.
- `composables/`: reusable logic (`useXxx.ts`).
- `server/api/`: Nitro endpoints (`*.ts` with `defineEventHandler`).
- `assets/`: unprocessed styles/images; `public/`: static served at `/`.
- `plugins/`, `middleware/`, `utils/`: app extensions and helpers.

## Build, Test, and Development Commands
- Install: `pnpm i` (or `npm ci`).
- Dev server: `pnpm dev` — starts Nuxt with HMR at `http://localhost:3000`.
- Typecheck: `pnpm typecheck` — Vue/TS type safety.
- Lint/format: `pnpm lint && pnpm format` — ESLint/Prettier.
- Build: `pnpm build` — production build; output via Nitro in `.output/`.
- Preview: `pnpm preview` — run the production server locally.
- Generate (optional SSG): `pnpm generate` — static output in `.output/public`.

## Coding Style & Naming Conventions
- Vue SFCs use `<script setup lang="ts">` and 2-space indent.
- Components: `PascalCase.vue`; pages: `kebab-case.vue`; composables: `useXxx.ts`.
- Prefer Nuxt UI primitives and props over custom CSS; keep Tailwind utility classes concise.
- Imports use `~/` alias; group and sort consistently.

## Testing Guidelines
- Unit tests: Vitest. Name files `*.spec.ts` colocated with source or under `tests/`.
- Run: `pnpm test` (watch: `pnpm test -- --watch`). Aim ≥ 80% coverage on changed code.
- E2E (optional): Playwright with basic happy paths for key pages.

## Commit & Pull Request Guidelines
- Conventional Commits, e.g., `feat(ui): add hero section` or `fix(seo): correct og:image`.
- PRs: clear summary, rationale, and UI screenshots (before/after). Link issues (`Closes #123`).
- All checks must pass (typecheck, lint, test, build) before merge.

## Security & Configuration Tips
- Secrets in `.env` only; mirror keys in `.env.example`. Access via `runtimeConfig` in `nuxt.config.ts`.
- Keep dependencies updated; review Nuxt UI releases before bumping.
- Validate server inputs in `server/api/*` and avoid exposing internal data.
