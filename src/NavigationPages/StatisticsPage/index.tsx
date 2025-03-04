import React from 'react'
import { Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { cn } from '../../utils'
import { TypeTittle } from '../../types'
import { SelectStatPeriod } from '../../features/SelectStatPeriod'
import { SelectStatActivityName } from '../../features/SelectStatActivityName'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useStatisticsPage } from './useStatisticsPage'

const StatisticsPage = (): JSX.Element => {
  const {
    locale,
    isDataAvailable,
    colorHint,
    handleToggleHint,
    period,
    activityName,
    handleChangePeriod,
    handleChangeActivityName,
    statComponentByState,
    selectStatStateVariants,
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
        <div className="flex gap-3">
          <SelectStatPeriod value={period} onChange={handleChangePeriod} />
          <SelectStatActivityName
            value={activityName}
            onChange={handleChangeActivityName}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex">
            {selectStatStateVariants.map(({ icon, onClick, isActive, id }) => (
              <div
                className={`cursor-pointer ${isActive ? 'bg-secondary-light dark:bg-purple-dark' : ''} py-1 pb-1.5 px-3 border-[1px] border-secondary-light dark:border-purple-dark ${id === 1 && 'rounded-l-lg'} ${id === 2 && 'rounded-r-lg'}`}
                key={id}
                onClick={onClick}
              >
                {icon}
              </div>
            ))}
          </div>
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
      </div>
      {statComponentByState}
    </Container>
  )
}

export default StatisticsPage
