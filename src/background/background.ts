import {
  DEFAULT_PERIOD_IN_MINUTES,
  MAX_SIZE_PERIODS,
  MIN_TIME_FOR_NOTE,
} from './constants'

/*Domain names*/

let currentSession: {
  domain: string
  startTime: string
} | null = null

function saveCurrentSession(): void {
  if (!currentSession) return

  const endTime = new Date().toISOString()
  const duration =
    new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()

  if (duration < MIN_TIME_FOR_NOTE) {
    currentSession = null

    return
  }

  const sessionData = {
    domain: currentSession.domain,
    startTime: currentSession.startTime,
    endTime,
    duration,
  }

  chrome.storage.local.get('sessionData', data => {
    const sessions = data.sessionData || []
    sessions.push(sessionData)

    if (sessions.length > MAX_SIZE_PERIODS) {
      sessions.splice(0, sessions.length - MAX_SIZE_PERIODS)
    }

    chrome.storage.local.set({ sessionData: sessions })
    console.log('Saved session:', sessionData)
  })

  currentSession = null
}

function tryStartSession(tab: chrome.tabs.Tab): void {
  if (!tab.url || !tab.active || !tab.url.startsWith('http')) return

  chrome.storage.local.get('timerState', result => {
    if (!result.timerState?.isActive) return

    const domain = new URL(tab.url!).hostname
    const startTime = new Date().toISOString()

    currentSession = { domain, startTime }
    console.log('Started session:', currentSession)
  })
}

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    saveCurrentSession()
    tryStartSession(tab)
  }
})

chrome.tabs.onActivated.addListener(activeInfo => {
  saveCurrentSession()

  chrome.tabs.get(activeInfo.tabId, tab => {
    tryStartSession(tab)
  })
})

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    saveCurrentSession()
  } else {
    chrome.tabs.query({ active: true, windowId }, tabs => {
      if (tabs[0]) tryStartSession(tabs[0])
    })
  }
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
    const { isActive } = changes.timerState.newValue
    const previousState = changes.timerState.oldValue?.isActive

    if (previousState && !isActive) {
      saveCurrentSession()
    }

    chrome.storage.local.get('notificationState', async result => {
      if (!result.notificationState.isNotificationActive) return

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
