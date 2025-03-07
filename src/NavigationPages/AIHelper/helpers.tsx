import { customizedTime, formatTime } from '../TrackTimePage/helpers'
import { Locale } from '../../types'
import { MoodDictionary } from '../../constants/specConstants'

import { Predictions, PredictionsFields } from './types'

export const getPredictedFields = (
  predictions: Predictions,
  locale: Locale,
): PredictionsFields[] => {
  const { predictMood, predictCountSession, predictTimeLearning } =
    locale.popup.aiHelper

  return [
    {
      id: 'mood',
      title: predictMood + ':',
      value: MoodDictionary[predictions.mood],
    },
    {
      id: 'time',
      title: predictTimeLearning + ':',
      value: customizedTime(
        formatTime(predictions.learningTime, false),
        locale,
      ),
    },
    {
      id: 'count',
      title: predictCountSession + ':',
      value: predictions.sessionsCount.toString(),
    },
  ]
}
