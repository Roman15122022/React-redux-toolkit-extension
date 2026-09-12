# Domain Time Tracking Design

## Goal

Make website time tracking reflect only the time when the timer is running and
an HTTP(S) tab is actively visible.

## Behaviour

- Start tracking the current active tab as soon as the timer starts.
- Stop and save the current website interval when the timer pauses, stops, the
  browser loses focus, or the active tab changes to a different domain.
- Start a fresh interval when the timer resumes, browser focus returns, or a
  trackable tab becomes active.
- Keep the interval when navigation remains on the same main domain.
- Do not track browser-internal or extension URLs.
- Persist the open interval in extension session storage so a Manifest V3
  service-worker restart does not lose it.
- Serialize transitions and session-data writes so rapid browser events cannot
  overwrite or duplicate intervals.
- Finishing a timer flushes the open interval before returning session data;
  cancelling discards it.

## Verification

Use a deterministic clock and Chrome API test double to cover timer start,
pause/resume, tab changes, focus changes, worker restoration, rapid transitions,
unsupported URLs, finish, and cancel behaviour.
