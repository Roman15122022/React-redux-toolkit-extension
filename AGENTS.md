# AGENTS.md

## Project Overview

This repository contains TrackerR, a Manifest V3 browser extension for tracking
study time, activity history, statistics, moods, blocked domains, reminders, and
extension settings.

The app is built with React 18, TypeScript, Webpack 5, TailwindCSS, Redux
Toolkit, redux-persist, React Router, MUI components/icons, and Chrome extension
APIs.

## Entry Points

- `src/screens/Popup/index.tsx` mounts the popup UI and wraps it with Redux,
  redux-persist, and `HashRouter`.
- `src/screens/Settings/index.tsx` mounts the extension options/settings page.
- `src/background/background.ts` is the Manifest V3 background service worker for
  tab/session tracking, blacklist redirects, alarms, and notifications.
- `src/static/manifest.json` defines extension permissions, popup/options pages,
  icons, and the background worker.
- `webpack.common.js` defines the `popup`, `options`, and `background` bundles
  and copies static assets into `dist`.

## Commands

Use Yarn for this project.

- Install dependencies: `yarn`
- Development watch build: `yarn start`
- Production watch build: `yarn build`
- One-time production build: `yarn build:release`
- Create release zip from `dist`: `yarn postbuild`
- Lint: `yarn lint`
- Fix lint issues: `yarn lint:fix`
- Format source files: `yarn prettier`
- Check formatting: `yarn prettier:check`

CI runs `yarn`, `yarn prettier:check`, `yarn lint`, `yarn build:release`, and
`yarn postbuild` on Node 20.x.

## Repository Structure

- `src/screens` contains top-level popup and options screens.
- `src/NavigationPages` contains routed popup pages such as tracker, history,
  statistics, achievements, and AI helper.
- `src/features` contains feature-level UI and hooks.
- `src/components` contains shared UI primitives.
- `src/hooks` contains shared React hooks, including typed Redux hooks and
  timer/translation helpers.
- `src/store/reducers` contains Redux Toolkit slices and reducer-local types.
- `src/background` contains service-worker code and constants.
- `src/locales` contains English and Ukrainian translation JSON.
- `src/static` contains extension manifest and static assets.

## Coding Guidelines

- Keep components functional and typed with TypeScript.
- Follow the existing split between `index.tsx`, `use*.ts`, `types.ts`,
  `constants.ts`, and `helpers.ts` within features/pages.
- Use `useAppDispatch` and `useAppSelector` instead of raw React Redux hooks in
  app code.
- Add Redux state through Toolkit slices under `src/store/reducers` and register
  reducers in `src/store/index.ts`.
- Prefer existing shared components and feature patterns before adding new
  abstractions.
- Use Tailwind utility classes for styling and `cn()` from `src/utils` when
  merging conditional classes.
- Preserve Prettier settings: single quotes, no semicolons, 2-space indentation,
  trailing commas, and 80-character print width.
- Keep import ordering compatible with the ESLint config.

## Chrome Extension Notes

- Respect Manifest V3 service-worker constraints in `src/background/background.ts`.
- Be careful with `chrome.storage.local` keys such as `timerState`,
  `notificationState`, `sessionData`, and `blackList`; changing stored shapes can
  affect persisted user data.
- When changing tab, navigation, alarm, notification, or storage behavior, verify
  both popup UI behavior and background-worker behavior.
- `dist` and `build.zip` are generated artifacts and should not be committed
  unless explicitly requested.

## Localization

When adding or changing user-facing text, update both:

- `src/locales/en.json`
- `src/locales/ua.json`

Prefer using the existing `useTranslate` flow instead of hard-coded strings in UI
components.

## Validation

Before finishing code changes, run the checks relevant to the change:

- Formatting check: `yarn prettier:check`
- Lint: `yarn lint`
- Production build: `yarn build:release`
- Release package check when build output matters: `yarn postbuild`

There is currently no dedicated test script in `package.json`.
