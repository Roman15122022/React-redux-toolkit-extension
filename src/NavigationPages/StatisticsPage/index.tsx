import React from 'react'
import { Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { cn } from '../../utils'
import { TypeTittle } from '../../types'
import TextStatistics from '../../features/TextStatistics'
import { SelectStatPeriod } from '../../features/SelectStatPeriod'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useStatisticsPage } from './useStatisticsPage'

const StatisticsPage = (): JSX.Element => {
  const {
    locale,
    isDataAvailable,
    colorHint,
    handleToggleHint,
    isHintActive,
    dates,
    period,
    handleChangePeriod,
  } = useStatisticsPage()

  if (!isDataAvailable)
    return (
      <Title
        classes="mt-5 text-center"
        title={locale.noStatistics}
        variant={TypeTittle.SMALL}
      />
    )

  return (
    <Container classes="mt-4">
      <div className="flex gap-3 justify-between items-center">
        <SelectStatPeriod value={period} onChange={handleChangePeriod} />
        <Tooltip title={locale.hint}>
          <button onClick={handleToggleHint}>
            <HelpOutlineIcon
              fontSize="small"
              className={cn(
                'hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer',
                colorHint,
              )}
            />
          </button>
        </Tooltip>
      </div>
      <TextStatistics
        isHintActive={isHintActive}
        dates={dates}
        period={period}
      />
    </Container>
  )
}

export default StatisticsPage
