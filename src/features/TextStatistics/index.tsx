import React from 'react'
import { Tooltip } from '@mui/material'

import { useTextStatistics } from './useTextStatistics'
import { TextStatisticsProps } from './types'

const TextStatistics = ({
  isHintActive,
  dates,
  period,
}: TextStatisticsProps): JSX.Element => {
  const { statisticsFields, unnecessaryForDay } = useTextStatistics(dates)

  return (
    <div className="mt-2">
      {statisticsFields.map(({ name, value, description }) => {
        if (period.toString() === '1' && unnecessaryForDay.includes(name))
          return

        return (
          <div
            key={name}
            className="py-1.5 font-bold text-[14px] flex justify-between items-center border-b dark:border-white hover:dark:border-purple-light cursor-pointer"
          >
            <Tooltip title={isHintActive ? description : ''}>
              <span>{name}</span>
            </Tooltip>
            <span className="text-secondary-light dark:text-purple-light">
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default TextStatistics
