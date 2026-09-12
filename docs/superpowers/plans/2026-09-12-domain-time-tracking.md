# Domain Time Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accurately record website time only while the timer and browser tab are actively in use.

**Architecture:** Move website-session transitions into a small tracker with injected Chrome storage, active-tab lookup, and clock dependencies. Route background browser events through one serialized queue and persist the open interval in `chrome.storage.session` so service-worker restarts retain state.

**Tech Stack:** TypeScript, Chrome Manifest V3 APIs, Node.js built-in test runner, Yarn

**Spec:** `docs/superpowers/specs/2026-09-12-domain-time-tracking.md`

## Global Constraints

- Do not add dependencies.
- Preserve the existing `sessionData` record shape and 5,000-record limit.
- Track only HTTP(S) tabs while `timerState.isActive === true` and `timerState.isPause === false`.
- Preserve unrelated uncommitted work.

---

### Task 1: Deterministic domain tracker

**Files:**

- Create: `src/background/domainTimeTracker.ts`
- Create: `scripts/domain-time-tracker.test.js`
- Modify: `package.json`

**Interfaces:**

- Consumes: Chrome-compatible local/session storage areas, an active-tab provider, and a clock function.
- Produces: `createDomainTimeTracker()` with `reconcile`, `flush`, `cancel`, and `restore` operations.

- [x] **Step 1: Write failing behavioural tests**

Cover immediate timer start, pause/resume exclusion, exact tab-switch intervals,
focus loss/restoration, persisted worker restoration, rapid transitions,
unsupported URLs, finish flush, and cancellation.

- [x] **Step 2: Run the focused test and verify failure**

Run: `yarn test:domain-tracking`

Expected: FAIL because `src/background/domainTimeTracker.ts` does not exist.

- [x] **Step 3: Implement the minimal tracker**

Implement a single promise queue for transitions, session-storage persistence of
the open interval, and serialized append/trim writes to local `sessionData`.

- [x] **Step 4: Run the focused test and verify success**

Run: `yarn test:domain-tracking`

Expected: all domain-tracking tests pass.

### Task 2: Background event integration

**Files:**

- Modify: `src/background/background.ts`
- Modify: `scripts/domain-time-tracker.test.js`

**Interfaces:**

- Consumes: `createDomainTimeTracker()` from Task 1.
- Produces: Chrome listener wiring for timer, tab, navigation, focus, suspend, finish, and cancel events.

- [x] **Step 1: Add failing listener integration tests**

Assert that timer-state changes reconcile the current tab, pause flushes the
interval, and finish waits for the queued flush before returning records.

- [x] **Step 2: Run focused tests and verify failure**

Run: `yarn test:domain-tracking`

Expected: listener assertions fail against the old background implementation.

- [x] **Step 3: Replace legacy listener logic with tracker calls**

Initialize/restores the tracker on worker startup and route relevant Chrome
events through its serialized public methods.

- [x] **Step 4: Run focused tests and verify success**

Run: `yarn test:domain-tracking`

Expected: all focused tests pass.

### Task 3: Full regression verification

**Files:**

- Modify only files required by failures caused by Tasks 1-2.

**Interfaces:**

- Consumes: completed tracker and background integration.
- Produces: verified production-ready change.

- [x] **Step 1: Run all behavioural tests**

Run: `yarn test:domain-tracking && yarn test:session-summary && yarn test:store`

- [x] **Step 2: Run static and production checks**

Run: `yarn prettier:check && yarn lint && yarn build:release && git diff --check`

- [x] **Step 3: Review the focused diff**

Confirm the new tracker does not change blacklist behaviour, stored historical
record format, localization, or unrelated popup UI.
