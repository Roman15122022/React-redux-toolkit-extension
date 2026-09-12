import { MAX_SIZE_PERIODS, MIN_TIME_FOR_NOTE } from './constants'

export const ACTIVE_DOMAIN_SESSION_KEY = 'activeDomainSession'

type StorageValues = Record<string, unknown>

export type DomainTrackingStorageArea = {
  get(keys: string | string[]): Promise<StorageValues>
  remove(keys: string | string[]): Promise<void>
  set(items: StorageValues): Promise<void>
}

export type DomainTrackingTab = {
  active?: boolean
  url?: string
}

export type DomainTrackingTimerState = {
  isActive: boolean
  isPause: boolean
}

type ActiveDomainSession = {
  domain: string
  fullDomain: string
  startTime: string
}

type DomainSession = ActiveDomainSession & {
  duration: number
  endTime: string
}

type DomainTimeTrackerDependencies = {
  getActiveTab: () => Promise<DomainTrackingTab | null>
  getTimerState: () => Promise<DomainTrackingTimerState | null>
  localStorageArea: DomainTrackingStorageArea
  now?: () => number
  sessionStorageArea: DomainTrackingStorageArea
}

export type DomainTimeTracker = {
  cancel: () => Promise<void>
  flush: () => Promise<void>
  reconcile: () => Promise<void>
  reconcileTab: (tab: DomainTrackingTab | null) => Promise<void>
  reconcileTimerState: (
    timerState: DomainTrackingTimerState | null,
  ) => Promise<void>
  restore: () => Promise<void>
}

function extractMainDomain(url: string): string {
  const { hostname } = new URL(url)
  const parts = hostname.split('.')

  if (parts.length > 2) return parts.slice(-2).join('.')

  return hostname
}

function getSessionForTab(
  tab: DomainTrackingTab | null,
  timerState: DomainTrackingTimerState | null,
  startTime: number,
): ActiveDomainSession | null {
  if (!timerState?.isActive || timerState.isPause || !tab?.active || !tab.url) {
    return null
  }

  try {
    const url = new URL(tab.url)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

    return {
      domain: extractMainDomain(tab.url),
      fullDomain: url.hostname,
      startTime: new Date(startTime).toISOString(),
    }
  } catch {
    return null
  }
}

function isActiveDomainSession(value: unknown): value is ActiveDomainSession {
  if (!value || typeof value !== 'object') return false

  const session = value as Partial<ActiveDomainSession>

  return (
    typeof session.domain === 'string' &&
    typeof session.fullDomain === 'string' &&
    typeof session.startTime === 'string' &&
    Number.isFinite(new Date(session.startTime).getTime())
  )
}

export function createDomainTimeTracker(
  dependencies: DomainTimeTrackerDependencies,
): DomainTimeTracker {
  const getCurrentTime = dependencies.now ?? Date.now
  let activeDomainSession: ActiveDomainSession | null = null
  let transitionQueue = Promise.resolve()

  function enqueueTransition(operation: () => Promise<void>): Promise<void> {
    const transition = transitionQueue.then(operation, operation)

    transitionQueue = transition.catch(() => undefined)

    return transition
  }

  async function appendSession(session: DomainSession): Promise<void> {
    const storedData = await dependencies.localStorageArea.get('sessionData')
    const storedSessions = Array.isArray(storedData.sessionData)
      ? storedData.sessionData
      : []
    const sessions = [...storedSessions, session].slice(-MAX_SIZE_PERIODS)

    await dependencies.localStorageArea.set({ sessionData: sessions })
  }

  async function closeActiveSession(endTime: number): Promise<void> {
    if (!activeDomainSession) return

    const sessionToClose = activeDomainSession
    const endTimeIso = new Date(endTime).toISOString()
    const duration =
      new Date(endTimeIso).getTime() -
      new Date(sessionToClose.startTime).getTime()

    if (duration >= MIN_TIME_FOR_NOTE) {
      await appendSession({
        ...sessionToClose,
        duration,
        endTime: endTimeIso,
      })
    }

    activeDomainSession = null
    await dependencies.sessionStorageArea.remove(ACTIVE_DOMAIN_SESSION_KEY)
  }

  async function applyTrackingState(
    tab: DomainTrackingTab | null,
    timerState: DomainTrackingTimerState | null,
    transitionTime: number,
  ): Promise<void> {
    const nextSession = getSessionForTab(tab, timerState, transitionTime)

    if (nextSession?.domain === activeDomainSession?.domain) return

    await closeActiveSession(transitionTime)

    if (!nextSession) return

    activeDomainSession = nextSession
    await dependencies.sessionStorageArea.set({
      [ACTIVE_DOMAIN_SESSION_KEY]: activeDomainSession,
    })
  }

  return {
    cancel() {
      return enqueueTransition(async () => {
        activeDomainSession = null
        await dependencies.sessionStorageArea.remove(ACTIVE_DOMAIN_SESSION_KEY)
      })
    },
    flush() {
      const transitionTime = getCurrentTime()

      return enqueueTransition(() => closeActiveSession(transitionTime))
    },
    reconcile() {
      const transitionTime = getCurrentTime()

      return enqueueTransition(async () => {
        const [tab, timerState] = await Promise.all([
          dependencies.getActiveTab(),
          dependencies.getTimerState(),
        ])

        await applyTrackingState(tab, timerState, transitionTime)
      })
    },
    reconcileTab(tab) {
      const transitionTime = getCurrentTime()

      return enqueueTransition(async () => {
        const timerState = await dependencies.getTimerState()

        await applyTrackingState(tab, timerState, transitionTime)
      })
    },
    reconcileTimerState(timerState) {
      const transitionTime = getCurrentTime()

      return enqueueTransition(async () => {
        const tab = timerState?.isActive
          ? await dependencies.getActiveTab()
          : null

        await applyTrackingState(tab, timerState, transitionTime)
      })
    },
    restore() {
      return enqueueTransition(async () => {
        const storedData = await dependencies.sessionStorageArea.get(
          ACTIVE_DOMAIN_SESSION_KEY,
        )
        const storedSession = storedData[ACTIVE_DOMAIN_SESSION_KEY]

        activeDomainSession = isActiveDomainSession(storedSession)
          ? storedSession
          : null

        if (!activeDomainSession && storedSession) {
          await dependencies.sessionStorageArea.remove(
            ACTIVE_DOMAIN_SESSION_KEY,
          )
        }
      })
    },
  }
}
