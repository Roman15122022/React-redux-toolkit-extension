# Issue #75: Focus Side Panel

## Goal

Show and control the current focus session in a narrow Chrome Side Panel, using the existing local timer and session log.

## Plan

- [x] Make elapsed time derive from the persisted timer state and wall clock; synchronize timer and session log changes between open extension pages.
- [x] Keep the optional in-progress note with the current timer and copy it to the completed log. Add a 60-minute daily goal setting and progress calculation.
- [x] Add a side-panel entry and responsive view for idle, active, paused, and completed states, with the current domain and accessible controls.
- [x] Add popup and action-menu entry points with Side Panel API feature detection; add EN and UA strings.
- [x] Verify behavior with focused tests, formatting, lint, production build, and a browser-rendered mocked side panel at 240–300px.
- [x] Toggle the popup action between opening and closing the panel based on live extension views in the current browser window; refresh after native panel closure and show EN/UA close errors when closing is unavailable.

## Boundaries

- The extension popup remains usable when the Side Panel API is unavailable.
- Installed-extension QA confirmed popup opening, closing, reopening, and recovery after closing with Chrome's panel-header cross. Runtime contexts reported `windowId: -1` for the panel; `chrome.extension.getViews({ windowId })` correctly identified it in the owning window and disappeared after closing. The popup was reloaded from the rebuilt local assets for verification.
- The extension action menu and MV3 worker restart lifecycle still need a loaded-extension check; they were not exercised during the popup toggle regression check.

## Summary height correction

- The shared summary defaults to the popup layout with its 520px internal scroll limit. The side panel requests the page layout, allowing the document to use the full viewport height and scroll naturally.
- Browser QA rendered the actual summary component with sample session data at 360 x 800: report height 1063.5px, no maximum height, no horizontal overflow; the save button remained reachable. The popup layout retained a 520px maximum height. This visual check used a local rendered fixture.

## History width and daily goal editing

- History now has balanced horizontal margins. Dense heatmap columns fit the available width; month labels at the right edge align inward, and the legend can wrap. Other heatmap sizes retain fixed-size cells and scrolling.
- The daily goal uses the existing minutes button pattern. Clicking opens an ordinary numeric input with a purple border, save and cancel controls. Enter saves a valid value; Escape cancels. Integer limits remain 1–1440.
- Chrome QA used actual History, NotificationSetting and DailyGoalSetting components with a real Redux store and sample data in a local fixture. At 400px, the heatmap scroller had equal client and scroll widths (350px), with no horizontal document overflow. Goal validation, saving with the button and Enter, and cancellation with the button and Escape passed. Installed-extension persistence was not rechecked for this layout correction.
- Formatting, lint (14 existing warnings), chart tests (2), store tests (10), production build (2 bundle warnings), release packaging and diff whitespace checks passed.

## Tracker-only popup action

- Show the popup panel toggle and its errors only on the tracker route.
- Verified the rebuilt installed Chrome extension: action present on Tracker, absent on History, Statistics, Achievements and AI Helper, and present again after returning to Tracker.
- Formatting, lint (14 existing warnings), 6 side-panel tests and production build passed.
