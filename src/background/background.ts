import {
  DEFAULT_PERIOD_IN_MINUTES,
  MAX_SIZE_PERIODS,
  MIN_TIME_FOR_NOTE,
} from './constants'

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
