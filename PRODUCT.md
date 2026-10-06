# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

TrackerR is for people who study or practice independently and want to
understand how they spend focused session time without sending their activity
data to a remote service.

## Product Purpose

TrackerR helps users run study timers, review completed sessions, understand
their activity patterns, and make a concrete improvement to the next session.
Success means a user can finish a session and quickly understand what was done,
how focused it was, and what to do next.

## Positioning

Session history, visited-domain activity, focus feedback, and recommendations
are calculated locally in a Manifest V3 browser extension. Browsing history is
not transmitted to a remote analytics or AI service.

## Operating Context

Users operate TrackerR from a compact browser-extension popup or an optional
Chrome Side Panel. They start, pause, finish, or cancel a timer, then review
completed activity in History.
After a successful finish, a session report temporarily replaces the timer
screen until the user closes it.

## Capabilities and Constraints

- The extension uses completed timer logs and domain sessions stored locally.
- Canceling a timer must not create or open a session report.
- A domain can be marked as distracting without blocking it. The mark is
  reversible and influences future focus reports.
- Adding a domain to the blacklist is a separate action that blocks access only
  while the timer is active.
- Focus scoring and recommendations must be deterministic, explainable, and
  useful when little history is available.
- Session notes are optional and persisted with the completed timer log.
- The Side Panel uses the same locally persisted timer as the popup. Daily,
  weekly, and activity-specific weekly goals count completed sessions only.
  The existing daily target migrates without losing its configured value;
  new users start with a 60-minute daily target.
- Goals and their weekly plan are displayed only on Achievements and managed
  in Settings. Progress and plans are derived from the saved session history.
- The weekly plan uses local Monday–Sunday weeks, selected study days, recent
  workload, and a configurable daily workload limit (180 minutes by default).
  It reports unfinished time that cannot fit instead of exceeding the limit.
- Study streaks count days with completed study sessions and forgive one missed
  day per streak. Reaching a time target is not required to maintain a streak.
- Tracker shows locally saved session templates and up to three distinct recent
  session setups. Templates contain an activity, duration target, initial mood,
  focus toggle, and selected sites from the global blacklist. They support
  one-click start, editing, ordering, and deletion. New templates prefill from
  the latest completed session. Deleted blacklist entries are skipped.
- Template targets never stop the timer automatically. Popup and Side Panel
  show the target; completed sessions preserve their configuration for reuse.
  Session blocking presets do not replace the global blacklist. Manual sessions
  retain the existing global blocking behavior.
- User-facing text is available in English and Ukrainian.
- The interface supports light and dark themes at popup width.

## Evidence on Hand

- Product requirements are tracked in GitHub issue #60 and related issues #64,
  #66, #67, and #68.
- Daily and weekly goals and deterministic planning follow GitHub issue #58.
- Existing timer logs, tracked-domain sessions, blacklist behavior, local AI
  helpers, themes, localization, and History UI are implemented in the
  repository.

## Product Principles

- Keep finishing a session fast and optional details skippable.
- Explain conclusions with local evidence instead of opaque grades.
- Keep observation, distraction classification, and blocking separate.
- Show one useful next action before additional analysis.
- Preserve user privacy by defaulting to local processing and storage.
