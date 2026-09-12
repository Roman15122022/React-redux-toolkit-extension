import {
  CANCEL_TIMER_SESSION_MESSAGE,
  FINISH_TIMER_SESSION_MESSAGE,
} from '../constants'

import {
  createDomainTimeTracker,
  DomainTrackingStorageArea,
  DomainTrackingTab,
  DomainTrackingTimerState,
} from './domainTimeTracker'
import { DEFAULT_PERIOD_IN_MINUTES } from './constants'

/*Domain names*/

const sessionStorageArea = (
  chrome.storage as unknown as {
    session: DomainTrackingStorageArea
  }
).session

function getTimerState(): Promise<DomainTrackingTimerState | null> {
  return chrome.storage.local.get('timerState').then(result => {
    const timerState = result.timerState as
      | Partial<DomainTrackingTimerState>
      | undefined

    if (typeof timerState?.isActive !== 'boolean') return null

    return {
      isActive: timerState.isActive,
      isPause: timerState.isPause ?? false,
    }
  })
}

function getActiveTab(): Promise<DomainTrackingTab | null> {
  return new Promise(resolve => {
    chrome.windows.getLastFocused({ populate: true }, currentWindow => {
      if (!currentWindow.focused) {
        resolve(null)

        return
      }

      const activeTab = currentWindow.tabs?.find(tab => tab.active)

      resolve(
        activeTab ? { active: activeTab.active, url: activeTab.url } : null,
      )
    })
  })
}

const domainTimeTracker = createDomainTimeTracker({
  getActiveTab,
  getTimerState,
  localStorageArea: chrome.storage.local,
  sessionStorageArea,
})
const domainTimeTrackerReady = domainTimeTracker
  .restore()
  .then(() => domainTimeTracker.reconcile())

chrome.runtime.onMessage.addListener(
  (message: { type?: string }, _sender, sendResponse) => {
    if (message?.type === CANCEL_TIMER_SESSION_MESSAGE) {
      domainTimeTrackerReady
        .then(() => domainTimeTracker.cancel())
        .then(() => sendResponse({ success: true }))

      return true
    }

    if (message?.type === FINISH_TIMER_SESSION_MESSAGE) {
      domainTimeTrackerReady
        .then(() => domainTimeTracker.flush())
        .then(() => chrome.storage.local.get('sessionData'))
        .then(result => {
          sendResponse({ sessions: result.sessionData || [], success: true })
        })

      return true
    }

    return false
  },
)

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (!tab.active || (!changeInfo.url && changeInfo.status !== 'complete')) {
    return
  }

  void domainTimeTrackerReady.then(() =>
    domainTimeTracker.reconcileTab({
      active: tab.active,
      url: changeInfo.url ?? tab.url,
    }),
  )
})

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    void domainTimeTrackerReady.then(() =>
      domainTimeTracker.reconcileTab({ active: tab.active, url: tab.url }),
    )
  })
})

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    void domainTimeTrackerReady.then(() => domainTimeTracker.reconcileTab(null))

    return
  }

  void domainTimeTrackerReady.then(() => domainTimeTracker.reconcile())
})

chrome.webNavigation.onBeforeNavigate.addListener(
  async details => {
    if (details.frameId !== 0) return

    try {
      const url = new URL(details.url)
      const domain = url.hostname
      const cleanDomain = domain.replace(/^www\./, '').toLowerCase()
      const fullUrl = details.url.toLowerCase()

      // Get timer state and blacklist from storage
      const { timerState, blackList = [] } = await chrome.storage.local.get([
        'timerState',
        'blackList',
      ])

      const isActive = timerState?.isActive

      if (!isActive) return

      // Check if the site is in the blacklist (including subdomains)
      const isBlocked = blackList.some(blockedDomain => {
        const cleanBlockedDomain = blockedDomain
          .replace(/^www\./, '')
          .toLowerCase()

        // Check domain match
        const domainMatch =
          cleanDomain === cleanBlockedDomain ||
          cleanDomain.endsWith('.' + cleanBlockedDomain)

        // Check if URL contains the blocked domain (for search results)
        const urlContainsBlockedDomain = fullUrl.includes(cleanBlockedDomain)

        // For YouTube specific handling
        const isYouTubeSearch =
          cleanBlockedDomain === 'youtube.com' &&
          fullUrl.includes('search') &&
          fullUrl.includes('youtube')

        return (
          domainMatch ||
          (cleanBlockedDomain === 'youtube.com' && urlContainsBlockedDomain) ||
          isYouTubeSearch
        )
      })

      const isMainFrame = details.parentFrameId === -1

      // Block the site if it's in the blacklist and timer is active and no temporary access
      if (isBlocked && isMainFrame) {
        chrome.tabs.update(details.tabId, {
          url:
            chrome.runtime.getURL('blocked.html') +
            `?from=${encodeURIComponent(details.url)}`,
        })
      }
    } catch (error) {
      console.error('Error in blocking logic:', error)
    }
  },
  { url: [{ schemes: ['http', 'https'] }] },
)

/*END DOMAIN*/

async function updateAlarmBasedOnTimer(
  isActive: boolean,
  periodInMin: number,
): Promise<void> {
  if (isActive) {
    chrome.alarms.create('chromeAlarm', {
      periodInMinutes: periodInMin || DEFAULT_PERIOD_IN_MINUTES,
    })
    console.log('Created')

    return
  }

  await chrome.alarms.clear('chromeAlarm')
  console.log('Clear')
}
function createNotification(period: number): void {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Knowledge is power',
    message: `Another ${period || DEFAULT_PERIOD_IN_MINUTES} minute(s) of training has passed, don't forget to rest!`,
    priority: 2,
  })
}

async function checkTimerAndSendNotification(): Promise<void> {
  chrome.storage.local.get('timerState', resultTimerState => {
    chrome.storage.local.get('notificationState', async resultNot => {
      if (!resultNot.notificationState.isNotificationActive) return

      await updateAlarmBasedOnTimer(
        resultTimerState.timerState.isActive,
        resultNot.notificationState.periodInMinutes,
      )

      if (resultTimerState.timerState.isActive) {
        createNotification(resultNot.notificationState.periodInMinutes)
      }
    })
  })
}

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && changes.timerState) {
    const timerState = changes.timerState.newValue as
      | DomainTrackingTimerState
      | undefined
    const isActive = timerState?.isActive ?? false

    await domainTimeTrackerReady
    await domainTimeTracker.reconcileTimerState(timerState ?? null)

    chrome.storage.local.get('notificationState', async result => {
      if (!result.notificationState?.isNotificationActive) return

      await updateAlarmBasedOnTimer(
        isActive,
        result.notificationState.periodInMinutes,
      )
    })
  }
})

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === 'chromeAlarm') {
    await checkTimerAndSendNotification()
  }
})
