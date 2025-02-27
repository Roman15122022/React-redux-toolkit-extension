import React, { useMemo, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'

import { stateSaverSlice } from '../../store/reducers/stateSaverReducer/StateSaverSlice'
import { useTranslate } from '../../hooks/useTranslate'
import { useStateSaver } from '../../hooks/useStateSaver'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import TextStatistics from '../../features/TextStatistics'
import { GraphStatistics } from '../../features/GraphStatistics'

import { Period } from './types'
import { getDatesByPeriod } from './helpers'
import { StatisticState } from './enums'

export const useStatisticsPage = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)
  const { isHintActive: startValueHint, periodStat } = useAppSelector(
    state => state.StateSaverReducer,
  )

  const dispatch = useAppDispatch()
  const { savePeriod } = stateSaverSlice.actions

  const { interfaceLang } = useTranslate()
  const { setIsActiveHint } = useStateSaver()

  const [isHintActive, setIsHintActive] = useState<boolean>(
    startValueHint ?? false,
  )
  const [period, setPeriod] = useState<Period>(periodStat || '0')
  const [statisticState, setStatisticState] = useState<StatisticState>(
    StatisticState.TEXT,
  )

  const handleToggleHint = (): void => {
    setIsHintActive(prevState => {
      setIsActiveHint(!prevState)

      return !prevState
    })
  }

  const handleChangePeriod = (event: SelectChangeEvent) => {
    const period = event.target.value as Period

    setPeriod(period)
    dispatch(savePeriod(period))
  }

  const dataByPeriod = useMemo(() => {
    return getDatesByPeriod(dates, period)
  }, [dates, period])

  const componentsByState = {
    [StatisticState.TEXT]: (
      <TextStatistics
        isHintActive={isHintActive}
        dates={dataByPeriod}
        period={period}
      />
    ),
    [StatisticState.GRAPH]: (
      <GraphStatistics dates={dataByPeriod} period={period} />
    ),
  }

  const selectStatStateVariants = [
    {
      id: 1,
      icon: <FormatListBulletedIcon sx={{ fontSize: 14 }} />,
      onClick: () => setStatisticState(StatisticState.TEXT),
      isActive: statisticState === StatisticState.TEXT,
    },
    {
      id: 2,
      icon: <DonutLargeIcon sx={{ fontSize: 14 }} />,
      onClick: () => setStatisticState(StatisticState.GRAPH),
      isActive: statisticState === StatisticState.GRAPH,
    },
  ]

  return {
    locale: interfaceLang.popup.statistics,
    isDataAvailable: dates.length > 0,
    isHintActive,
    colorHint: isHintActive ? 'text-secondary-light dark:text-purple-dark' : '',
    handleToggleHint,
    dates: dataByPeriod,
    period,
    handleChangePeriod,
    statisticState,
    statComponentByState: componentsByState[statisticState] || null,
    selectStatStateVariants,
  }
}
