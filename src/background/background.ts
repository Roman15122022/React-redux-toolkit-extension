async function updateAlarmBasedOnTimer(
  isActive: boolean,
  periodInMin: number,
): Promise<void> {
  if (isActive) {
    chrome.alarms.create('chromeAlarm', {
      periodInMinutes: periodInMin || 60,
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
    message: `Another ${period || 60} minute(s) of training has passed, don't forget to rest!`,
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
