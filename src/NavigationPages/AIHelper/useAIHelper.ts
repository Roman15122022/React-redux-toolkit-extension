import { useMemo, useState } from 'react'

import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

import { Predictions } from './types'
import { getPredictedFields } from './helpers'

export const useAIHelper = () => {
  const { interfaceLang } = useTranslate()

  const [predictions, setPredictions] = useState<Predictions>({
    mood: 3,
    learningTime: 7600,
    sessionsCount: 3,
  })
  const [isModelLoading, setIsModelLoading] = useState(false)

  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const predictionsFields = useMemo(
    () => getPredictedFields(predictions, interfaceLang),
    [predictions.sessionsCount, predictions.mood, predictions.learningTime],
  )

  return {
    dates,
    locale: interfaceLang.popup.aiHelper,
    isModelLoading,
    predictionsFields,
  }
}
