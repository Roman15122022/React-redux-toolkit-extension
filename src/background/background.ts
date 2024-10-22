async function updateAlarmBasedOnTimer(
  isActive: boolean,
  periodInMin: number,
): Promise<void> {
  if (isActive) {
    chrome.alarms.create('chromeAlarm', {
      periodInMinutes: periodInMin,
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
    message: `Another ${period} minute(s) of training has passed, don't forget to rest!`,
    priority: 2,
  })
}

async function checkTimerAndSendNotification(): Promise<void> {
  chrome.storage.local.get('timerState', async result => {
    await updateAlarmBasedOnTimer(result.timerState.isActive, 1)

    if (result.timerState.isActive) {
      createNotification(1)
    }
  })
}

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && changes.timerState) {
    const { isActive } = changes.timerState.newValue
    await updateAlarmBasedOnTimer(isActive, 1)
  }
})

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === 'chromeAlarm') {
    await checkTimerAndSendNotification()
  }
})
