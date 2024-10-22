async function updateAlarmBasedOnTimer(isActive: boolean): Promise<void> {
  if (isActive) {
    chrome.alarms.create('chromeAlarm', {
      periodInMinutes: 60, // period
    })
    console.log('Created')

    return
  }

  await chrome.alarms.clear('chromeAlarm')
  console.log('Clear')
}
function createNotification(): void {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Knowledge is power',
    message: "Another hour of training has passed, don't forget to rest!",
    priority: 2,
  })
}

async function checkTimerAndSendNotification(): Promise<void> {
  chrome.storage.local.get('timerState', async result => {
    await updateAlarmBasedOnTimer(result.timerState.isActive)

    if (result.timerState.isActive) {
      createNotification()
    }
  })
}

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local' && changes.timerState) {
    const { isActive } = changes.timerState.newValue
    await updateAlarmBasedOnTimer(isActive)
  }
})

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === 'chromeAlarm') {
    await checkTimerAndSendNotification()
  }
})
