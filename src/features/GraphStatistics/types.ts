import { Dispatch, SetStateAction } from 'react'

import { TimePeriod } from '../../types'
import { Period } from '../../NavigationPages/StatisticsPage/types'

export type GraphStatisticsProps = {
  dates: TimePeriod[]
  dataFilteredOnlyByTimePeriod: TimePeriod[]
  setIsActivityFilterVisible: Dispatch<SetStateAction<boolean>>
  period: Period
}
