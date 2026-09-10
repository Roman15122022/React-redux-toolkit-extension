import { useEffect, useState } from 'react'

import { fullFormatTime } from '../TrackTimePage/helpers'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { AIResult } from './types'
import { getFallbackPrediction, getNeededSessions } from './helpers'
import { getAIResult } from './aiModel'

export const useAIHelper = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)
  const { interfaceLang } = useTranslate()
  const [aiResult, setAIResult] = useState<AIResult>({
    status: 'notEnoughData',
    prediction: getFallbackPrediction([]),
    neededSessions: getNeededSessions(0),
  })

  useEffect(() => {
    let isActual = true

    async function syncAIResult(): Promise<void> {
      setAIResult(prevState => ({
        ...prevState,
        status: dates.length >= 5 ? 'training' : 'notEnoughData',
        neededSessions: getNeededSessions(dates.length),
      }))

      const result = await getAIResult(dates)

      if (isActual) {
        setAIResult(result)
      }
    }

    void syncAIResult()

    return () => {
      isActual = false
    }
  }, [dates])

  return {
    aiResult,
    dates,
    locale: interfaceLang.popup.aiHelper,
    studyTime: fullFormatTime(
      aiResult.prediction.studyTimeSeconds,
      interfaceLang,
      false,
    ),
  }
}
