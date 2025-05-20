import { Dispatch, SetStateAction } from 'react'

import { Period } from '../../NavigationPages/StatisticsPage/types'

export type DomainSiteInfoProps = {
  setIsActivityFilterVisible: Dispatch<SetStateAction<boolean>>
  period: Period
}

export type ChartData = {
  label: string
  value: number
  color?: string
}
