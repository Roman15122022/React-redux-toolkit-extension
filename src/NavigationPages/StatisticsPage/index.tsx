import React from 'react'
import { Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { cn } from '../../utils'
import { TypeTittle } from '../../types'
import TextStatistics from '../../features/TextStatistics'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useStatisticsPage } from './useStatisticsPage'

const StatisticsPage = (): JSX.Element => {
  const { locale, isDataAvailable, colorHint, handleToggleHint, isHintActive } =
    useStatisticsPage()

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
      <div className="flex gap-3 justify-end items-center">
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
      <TextStatistics isHintActive={isHintActive} />
    </Container>
  )
}

export default StatisticsPage
