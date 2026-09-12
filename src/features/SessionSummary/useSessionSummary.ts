import { useMemo, useState } from 'react'

import { MoodLabelKeys } from '../MoodSelect/constants'
import { TimePeriod } from '../../types'
import { timerLogsSlice } from '../../store/reducers/timeLogsReducer/TimerLogsSlice'
import { useTranslate } from '../../hooks/useTranslate'
import { useManageDistractingDomains } from '../../hooks/useManageDistractingDomains'
import { useManageBlackListDomain } from '../../hooks/useManageBlackListDomain'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import { createSessionSummary } from './helpers'

export const useSessionSummary = (session: TimePeriod, onClose: () => void) => {
  const dispatch = useAppDispatch()
  const { interfaceLang } = useTranslate()
  const { dates } = useAppSelector(state => state.TimerLogsReducer)
  const { blackList } = useAppSelector(state => state.SessionDataSlice)
  const { distractingDomains, handleToggleDistractingDomain } =
    useManageDistractingDomains()
  const { handleAddItemToBlackList } = useManageBlackListDomain()
  const [note, setNote] = useState(session.note || '')
  const history = dates.filter(date => date.startDate !== session.startDate)
  const summary = useMemo(
    () =>
      createSessionSummary({
        session,
        history,
        domainSessions: session.domainSessions || [],
        distractingDomains,
      }),
    [dates, distractingDomains, session],
  )
  const locale = interfaceLang.popup.sessionSummary
  const moodKey =
    MoodLabelKeys[Number(session.mood) as keyof typeof MoodLabelKeys]
  const moodLabel = interfaceLang.popup.statistics.moods[moodKey]

  async function handleToggleDomain(domain: string): Promise<void> {
    const updatedDistractingDomains = distractingDomains.includes(domain)
      ? distractingDomains.filter(item => item !== domain)
      : [...distractingDomains, domain]
    const updatedSummary = createSessionSummary({
      session,
      history,
      domainSessions: session.domainSessions || [],
      distractingDomains: updatedDistractingDomains,
    })

    await handleToggleDistractingDomain(domain)
    dispatch(
      timerLogsSlice.actions.updateTimeLog({
        startDate: session.startDate,
        changes: { focusScore: updatedSummary.focusScore },
      }),
    )
  }

  async function handleBlockDomain(domain: string): Promise<void> {
    await handleAddItemToBlackList(domain)
  }

  function handleSaveAndClose(): void {
    dispatch(
      timerLogsSlice.actions.updateTimeLog({
        startDate: session.startDate,
        changes: {
          focusScore: summary.focusScore,
          note: note.trim(),
        },
      }),
    )
    onClose()
  }

  return {
    blackList,
    distractingDomains,
    handleBlockDomain,
    handleSaveAndClose,
    handleToggleDomain,
    locale,
    moodLabel,
    note,
    setNote,
    summary,
  }
}
