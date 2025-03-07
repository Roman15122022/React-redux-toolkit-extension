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
  const {
    isHintActive: startValueHint,
    periodStat,
    activityNameFilter,
  } = useAppSelector(state => state.StateSaverReducer)

  const dispatch = useAppDispatch()
  const { savePeriod, saveActivityNameFilter } = stateSaverSlice.actions

  const { interfaceLang } = useTranslate()
  const { setIsActiveHint } = useStateSaver()

  const [isHintActive, setIsHintActive] = useState<boolean>(
    startValueHint ?? false,
  )
  const [period, setPeriod] = useState<Period>(periodStat || '0')
  const [activityName, setActivityName] = useState<string>(
    activityNameFilter || '0',
  )
  const [isActivityFilterVisible, setIsActivityFilterVisible] =
    useState<boolean>(true)

  const [statisticState, setStatisticState] = useState<StatisticState>(
    StatisticState.TEXT,
  )

  const handleToggleHint = (): void => {
    setIsHintActive(prevState => {
      setIsActiveHint(!prevState)

      return !prevState
    })
  }

  const handleChangePeriod = (event: SelectChangeEvent): void => {
    const period = event.target.value as Period

    setPeriod(period)
    dispatch(savePeriod(period))
  }

  const handleChangeActivityName = (event: SelectChangeEvent): void => {
    const activityName = event.target.value.toString()

    setActivityName(activityName)
    dispatch(saveActivityNameFilter(activityName))
  }

  const dataByPeriod = useMemo(() => {
    return getDatesByPeriod(dates, period)
  }, [dates, period])

  const filteredData = useMemo(() => {
    if (activityNameFilter.toString() === '0') return dataByPeriod

    return dataByPeriod.filter(item => item.activityName === activityNameFilter)
  }, [dataByPeriod, activityName])

  const componentsByState = {
    [StatisticState.TEXT]: (
      <TextStatistics
        isHintActive={isHintActive}
        dates={filteredData}
        period={period}
      />
    ),
    [StatisticState.GRAPH]: (
      <GraphStatistics
        dates={filteredData}
        dataFilteredOnlyByTimePeriod={dataByPeriod}
        setIsActivityFilterVisible={setIsActivityFilterVisible}
        period={period}
      />
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
    dates: filteredData,
    period,
    activityName,
    handleChangePeriod,
    handleChangeActivityName,
    statisticState,
    statComponentByState: componentsByState[statisticState] || null,
    selectStatStateVariants,
    isActivityFilterVisible,
  }
}
