import {
  NotificationSettingState,
  SessionsDomainInfo,
  TimePeriod,
} from '../../types'

import {
  ChromeStorageData,
  DataTransferSummary,
  DateRange,
  DateRangeBounds,
  ExportDataParams,
  ExportedAppData,
  MergeDataParams,
} from './types'

const DEFAULT_TIMER_STATE = {
  isActive: false,
  isPause: false,
}

const DEFAULT_NOTIFICATION_STATE = {
  isNotificationActive: true,
  periodInMinutes: 60,
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return Boolean(data && typeof data === 'object')
}

function isFiniteNumber(data: unknown): data is number {
  return typeof data === 'number' && Number.isFinite(data)
}

function isString(data: unknown): data is string {
  return typeof data === 'string'
}

function isBoolean(data: unknown): data is boolean {
  return typeof data === 'boolean'
}

function isTimerState(data: unknown): boolean {
  if (data === null || data === undefined) return true

  if (!isRecord(data)) return false

  return isBoolean(data.isActive) && isBoolean(data.isPause)
}

function isNotificationState(data: unknown): data is NotificationSettingState {
  if (!isRecord(data)) return false

  return (
    isBoolean(data.isNotificationActive) && isFiniteNumber(data.periodInMinutes)
  )
}

function isTimePeriod(data: unknown): data is TimePeriod {
  if (!isRecord(data)) return false

  return (
    isString(data.activityName) &&
    isFiniteNumber(data.startDate) &&
    isFiniteNumber(data.endDate) &&
    isFiniteNumber(data.dayOfWeek) &&
    isFiniteNumber(data.totalTimeForSession) &&
    isString(data.mood)
  )
}

function isSessionDomainInfo(data: unknown): data is SessionsDomainInfo {
  if (!isRecord(data)) return false

  return (
    isString(data.domain) &&
    isString(data.fullDomain) &&
    isFiniteNumber(data.duration) &&
    isString(data.endTime) &&
    isString(data.startTime)
  )
}

function isStringArray(data: unknown): data is string[] {
  return Array.isArray(data) && data.every(isString)
}

export function isExportedAppData(data: unknown): data is ExportedAppData {
  if (!data || typeof data !== 'object') return false

  const value = data as ExportedAppData
  const { chromeStorage, redux } = value

  return Boolean(
    value.version === 1 &&
      isString(value.exportedAt) &&
      !Number.isNaN(new Date(value.exportedAt).getTime()) &&
      isRecord(redux) &&
      isRecord(chromeStorage) &&
      isRecord(redux.ClickerReducer) &&
      isFiniteNumber(redux.ClickerReducer.count) &&
      isRecord(redux.CurrentTimerReducer) &&
      isFiniteNumber(redux.CurrentTimerReducer.startDate) &&
      isFiniteNumber(redux.CurrentTimerReducer.elapsedTime) &&
      isTimerState(redux.CurrentTimerReducer.stateTimer) &&
      isRecord(redux.SettingReducer) &&
      isString(redux.SettingReducer.language) &&
      isString(redux.SettingReducer.theme) &&
      isBoolean(redux.SettingReducer.saveStateAfterClose) &&
      isNotificationState(redux.SettingReducer.notification) &&
      isRecord(redux.StateSaverReducer) &&
      isRecord(redux.TimerLogsReducer) &&
      Array.isArray(redux.TimerLogsReducer.dates) &&
      redux.TimerLogsReducer.dates.every(isTimePeriod) &&
      isFiniteNumber(redux.TimerLogsReducer.lastStartDate) &&
      isString(redux.TimerLogsReducer.lastMood) &&
      isString(redux.TimerLogsReducer.lastNameActivity) &&
      isRecord(redux.SessionDataSlice) &&
      Array.isArray(redux.SessionDataSlice.sessions) &&
      redux.SessionDataSlice.sessions.every(isSessionDomainInfo) &&
      isStringArray(redux.SessionDataSlice.blackList) &&
      (chromeStorage.timerState === undefined ||
        isTimerState(chromeStorage.timerState)) &&
      (chromeStorage.notificationState === undefined ||
        isNotificationState(chromeStorage.notificationState)) &&
      Array.isArray(chromeStorage.sessionData) &&
      chromeStorage.sessionData.every(isSessionDomainInfo) &&
      isStringArray(chromeStorage.blackList),
  )
}

function getDatePartTimestamp(value: string, isEndDate = false): number {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) return Number.NaN

  return new Date(
    year,
    month - 1,
    day,
    isEndDate ? 23 : 0,
    isEndDate ? 59 : 0,
    isEndDate ? 59 : 0,
    isEndDate ? 999 : 0,
  ).getTime()
}

export function getDateRangeBounds(
  dateRange: DateRange,
): DateRangeBounds | null {
  const startDate = dateRange.from
    ? getDatePartTimestamp(dateRange.from)
    : Number.NEGATIVE_INFINITY
  const endDate = dateRange.to
    ? getDatePartTimestamp(dateRange.to, true)
    : Number.POSITIVE_INFINITY

  if (Number.isNaN(startDate) || Number.isNaN(endDate) || startDate > endDate) {
    return null
  }

  return { startDate, endDate }
}

export function isDateRangeEmpty(dateRange: DateRange): boolean {
  return !dateRange.from && !dateRange.to
}

function isTimestampInRange(
  timestamp: number,
  bounds: DateRangeBounds | null,
): boolean {
  if (!bounds) return true

  return timestamp >= bounds.startDate && timestamp <= bounds.endDate
}

function isTimePeriodInRange(
  timePeriod: TimePeriod,
  bounds: DateRangeBounds | null,
): boolean {
  if (!bounds) return true

  return (
    isTimestampInRange(timePeriod.startDate, bounds) ||
    isTimestampInRange(timePeriod.endDate, bounds) ||
    (timePeriod.startDate <= bounds.startDate &&
      timePeriod.endDate >= bounds.endDate)
  )
}

function getSessionTimestamp(value: string): number {
  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function isDomainSessionInRange(
  session: SessionsDomainInfo,
  bounds: DateRangeBounds | null,
): boolean {
  if (!bounds) return true

  const startTime = getSessionTimestamp(session.startTime)
  const endTime = getSessionTimestamp(session.endTime)

  return (
    isTimestampInRange(startTime, bounds) ||
    isTimestampInRange(endTime, bounds) ||
    (startTime <= bounds.startDate && endTime >= bounds.endDate)
  )
}

function getTimePeriodKey(value: TimePeriod): string {
  return [
    value.startDate,
    value.endDate,
    value.totalTimeForSession,
    value.activityName,
    value.mood,
  ].join('|')
}

function getDomainSessionKey(value: SessionsDomainInfo): string {
  return [
    value.domain,
    value.fullDomain,
    value.startTime,
    value.endTime,
    value.duration,
  ].join('|')
}

function mergeUniqueByKey<T>(
  currentValues: T[],
  importedValues: T[],
  getKey: (value: T) => string,
): T[] {
  const valuesByKey = new Map<string, T>()

  currentValues.forEach(value => valuesByKey.set(getKey(value), value))
  importedValues.forEach(value => valuesByKey.set(getKey(value), value))

  return Array.from(valuesByKey.values())
}

function mergeStringValues(
  currentValues: string[],
  importedValues: string[],
): string[] {
  return Array.from(new Set([...currentValues, ...importedValues]))
}

function getChromeSessionData(
  chromeStorage: ChromeStorageData,
  fallback: SessionsDomainInfo[],
): SessionsDomainInfo[] {
  return chromeStorage.sessionData?.length
    ? chromeStorage.sessionData
    : fallback
}

function getChromeBlackList(
  chromeStorage: ChromeStorageData,
  fallback: string[],
): string[] {
  return chromeStorage.blackList?.length ? chromeStorage.blackList : fallback
}

export function createExportedAppData({
  state,
  chromeStorage,
  dateRange,
}: ExportDataParams): ExportedAppData | null {
  const bounds = getDateRangeBounds(dateRange)

  if (!bounds) return null

  const timerDates = isDateRangeEmpty(dateRange)
    ? state.TimerLogsReducer.dates
    : state.TimerLogsReducer.dates.filter(timePeriod =>
        isTimePeriodInRange(timePeriod, bounds),
      )
  const reduxSessions = isDateRangeEmpty(dateRange)
    ? state.SessionDataSlice.sessions
    : state.SessionDataSlice.sessions.filter(session =>
        isDomainSessionInRange(session, bounds),
      )
  const chromeStorageSessions = isDateRangeEmpty(dateRange)
    ? chromeStorage.sessionData
    : chromeStorage.sessionData.filter(session =>
        isDomainSessionInRange(session, bounds),
      )

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    redux: {
      ...state,
      TimerLogsReducer: {
        ...state.TimerLogsReducer,
        dates: timerDates,
      },
      SessionDataSlice: {
        ...state.SessionDataSlice,
        sessions: reduxSessions,
      },
    },
    chromeStorage: {
      ...chromeStorage,
      sessionData: chromeStorageSessions,
    },
  }
}

export function createMergedAppData({
  currentState,
  currentChromeStorage,
  importedData,
}: MergeDataParams): ExportedAppData {
  const importedSessionData = getChromeSessionData(
    importedData.chromeStorage,
    importedData.redux.SessionDataSlice.sessions,
  )
  const currentSessionData = getChromeSessionData(
    currentChromeStorage,
    currentState.SessionDataSlice.sessions,
  )
  const importedBlackList = getChromeBlackList(
    importedData.chromeStorage,
    importedData.redux.SessionDataSlice.blackList,
  )
  const currentBlackList = getChromeBlackList(
    currentChromeStorage,
    currentState.SessionDataSlice.blackList,
  )
  const mergedTimerDates = mergeUniqueByKey(
    currentState.TimerLogsReducer.dates,
    importedData.redux.TimerLogsReducer.dates,
    getTimePeriodKey,
  ).sort((a, b) => a.startDate - b.startDate)
  const mergedSessionData = mergeUniqueByKey(
    currentSessionData,
    importedSessionData,
    getDomainSessionKey,
  ).sort(
    (a, b) =>
      getSessionTimestamp(a.startTime) - getSessionTimestamp(b.startTime),
  )
  const mergedBlackList = mergeStringValues(currentBlackList, importedBlackList)
  const latestTimerLog = mergedTimerDates[mergedTimerDates.length - 1]

  return {
    version: 1,
    exportedAt: importedData.exportedAt,
    redux: {
      ...currentState,
      TimerLogsReducer: {
        ...currentState.TimerLogsReducer,
        dates: mergedTimerDates,
        lastStartDate:
          latestTimerLog?.startDate ||
          currentState.TimerLogsReducer.lastStartDate,
        lastMood:
          latestTimerLog?.mood || currentState.TimerLogsReducer.lastMood,
        lastNameActivity:
          latestTimerLog?.activityName ||
          currentState.TimerLogsReducer.lastNameActivity,
      },
      SessionDataSlice: {
        ...currentState.SessionDataSlice,
        sessions: mergedSessionData,
        blackList: mergedBlackList,
      },
    },
    chromeStorage: {
      timerState:
        currentChromeStorage.timerState ||
        currentState.CurrentTimerReducer.stateTimer ||
        DEFAULT_TIMER_STATE,
      notificationState:
        currentChromeStorage.notificationState ||
        currentState.SettingReducer.notification ||
        DEFAULT_NOTIFICATION_STATE,
      sessionData: mergedSessionData,
      blackList: mergedBlackList,
    },
  }
}

export function getDataTransferSummary(
  data: ExportedAppData,
): DataTransferSummary {
  const timerDates = data.redux.TimerLogsReducer.dates
  const domainSessions = getChromeSessionData(
    data.chromeStorage,
    data.redux.SessionDataSlice.sessions,
  )
  const blackList = getChromeBlackList(
    data.chromeStorage,
    data.redux.SessionDataSlice.blackList,
  )
  const sortedDates = [...timerDates].sort((a, b) => a.startDate - b.startDate)

  return {
    timerSessionsCount: timerDates.length,
    domainSessionsCount: domainSessions.length,
    blackListCount: blackList.length,
    firstSessionDate: sortedDates[0]?.startDate,
    lastSessionDate: sortedDates[sortedDates.length - 1]?.startDate,
  }
}
