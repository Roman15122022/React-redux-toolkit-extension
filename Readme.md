# TrackerR

TrackerR is a Manifest V3 browser extension for tracking study time, reviewing
activity history, analyzing productivity patterns, blocking distracting sites
during focus sessions, and getting local AI-powered study recommendations.

The extension runs locally in the browser. It stores user data in extension
storage, persisted Redux state, and IndexedDB, with no backend account system or
cloud synchronization.

## Features

### Time Tracker

- Create a study session by entering an activity name and selecting a mood.
- Start, pause, resume, finish, or cancel the active timer.
- Review the last completed session directly from the tracker screen.
- See the total tracked study time for the current day.
- Keep timer state between popup openings when save-state behavior is enabled.

### History

- Browse saved timer sessions.
- Review sessions grouped by day.
- Move through older and newer history pages with pagination controls.
- Inspect previous activity names, moods, dates, and tracked durations.

### Statistics

- Filter statistics by period.
- Filter statistics by activity.
- See total tracked time and total session count.
- Review average mood, average time per day, and average session length.
- Compare maximum and minimum session durations.
- Identify the most and least productive days.
- Find the most productive time window based on tracked sessions.

### Graphs

- Mood distribution pie chart.
- Activity distribution pie chart.
- Mood and study-time line chart.
- Day-of-week productivity line chart.
- Mood-over-day chart for reviewing mood changes across tracked periods.

### Site Tracking

- Track active domains while the timer is running.
- Save domain sessions in extension storage.
- Review domain statistics for timer sessions.
- Split domain stats into top domains and other domains for easier scanning.
- Add or remove domains from the blacklist directly from statistics.

### Blacklist

- Maintain a list of blocked domains.
- Match blocked domains and their subdomains.
- Redirect blocked pages while a timer session is active.
- Quickly add distracting sites from statistics.
- Remove domains from the blacklist when they should be allowed again.

### AI Tab

- Uses a local TensorFlow.js model trained from the user's own completed timer
  sessions.
- Trains after each completed block of 5 sessions.
- Saves the local model to IndexedDB after training.
- Keeps AI metadata and the latest prediction locally in IndexedDB.
- Treats the model as per browser profile / extension storage instance.
- Predicts likely next mood, study time, and session count.
- Shows bad mood risk, fatigue score, and consistency score in user-friendly
  terms.
- Provides recommendations based on prediction results and recent session
  patterns.
- Falls back to heuristic results when there is not enough data or when a saved
  model is unavailable.

### Achievements

- Includes an achievement view built around long-term study progress.
- Tracks progress toward the 10,000-hour study concept.
- Helps users see study time as cumulative progress, not only isolated sessions.

### Settings

- Switch between light and dark themes.
- Switch the interface language.
- Configure save-state behavior.
- Enable reminders and set the notification period.
- Manage the blacklist.
- Export extension data as JSON.
- Import extension data from JSON.
- Reset saved statistics and tracked data.

### Localization

- The interface supports English and Ukrainian.
- User-facing strings are stored in locale JSON files under `src/locales`.

### Persistence And Privacy

- Timer logs and app state are stored with Redux Toolkit and redux-persist.
- Timer, notification, domain-session, and blacklist state are stored in
  `chrome.storage.local`.
- The AI model is stored locally in IndexedDB.
- Export/import uses JSON for moving local extension data manually.
- There is no backend AI service, global user model, account system, or
  cross-device model sharing.

## Installation And Development

Use Yarn for this project.

- Install dependencies: `yarn`
- Development watch build: `yarn start`
- One-time production build: `yarn build:release`
- Create a release zip from `dist`: `yarn postbuild`
- Lint source code: `yarn lint`
- Check formatting: `yarn prettier:check`

Additional scripts are available for production watch builds, lint fixes, and
formatting:

- Production watch build: `yarn build`
- Fix lint issues: `yarn lint:fix`
- Format source files: `yarn prettier`

## Loading The Extension In A Browser

1. Build the extension with `yarn build:release`.
2. Open the browser extensions page.
3. Enable developer mode.
4. Choose the option to load an unpacked extension.
5. Select the generated `dist` directory.

The popup entry is `popup.html`, the options page is `options.html`, and the
Manifest V3 background service worker is bundled as `background.js`.

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- redux-persist
- React Router
- TensorFlow.js
- MUI components and icons
- MUI X Charts
- TailwindCSS
- Webpack 5
- Chrome Extension APIs

## Project Structure

- `src/screens/Popup/index.tsx` mounts the popup UI.
- `src/screens/Settings/index.tsx` mounts the options/settings page.
- `src/background/background.ts` contains the Manifest V3 background worker.
- `src/static/manifest.json` defines permissions, pages, icons, and the
  background worker.
- `src/NavigationPages` contains routed popup pages such as tracker, history,
  statistics, achievements, and AI helper.
- `src/features` contains feature-level UI, hooks, helpers, and types.
- `src/components` contains shared UI components.
- `src/hooks` contains shared React hooks.
- `src/store` contains Redux store configuration and slices.
- `src/locales` contains translation JSON files.
- `src/static` contains extension static assets.

## Data And Storage

- Timer logs are stored in persisted Redux state.
- Active timer state, notification state, domain sessions, and blacklist data are
  stored in `chrome.storage.local`.
- Domain tracking data is collected only around timer sessions.
- The TensorFlow.js AI model is saved in IndexedDB.
- AI metadata and the latest local prediction are saved in an app-owned
  IndexedDB store.
- Data export/import uses JSON for local backup and restore workflows.

## Permissions

TrackerR uses the following extension permissions:

- `storage`: saves timer state, settings, domain sessions, blacklist data, and
  other extension state.
- `notifications`: shows reminder notifications.
- `alarms`: schedules reminder checks while timer sessions are active.
- `webNavigation`: detects navigation to blocked domains.
- `tabs`: reads active tab information for domain tracking and blocking flows.
- `<all_urls>` host permission: allows the extension to observe and handle
  domains across visited pages for tracking and blacklist behavior.

## Build Artifacts

- `dist` is generated by the Webpack build.
- `build.zip` is generated by the release packaging script.
- These files are build outputs and normally should not be committed.

## Validation

Before finishing changes, run the checks relevant to the work:

- Formatting check: `yarn prettier:check`
- Lint: `yarn lint`
- Production build: `yarn build:release`
- Release package check when build output matters: `yarn postbuild`

There is currently no dedicated test script in `package.json`.
