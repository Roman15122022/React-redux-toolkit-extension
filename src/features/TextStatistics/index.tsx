import React from 'react'
import { Tooltip } from '@mui/material'

import { cn } from '../../utils'

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
      {statisticsFields.map(({ name, value, description }, index) => {
        if (period.toString() === '1' && unnecessaryForDay.includes(name))
          return null

        const isLast = index === statisticsFields.length - 1

        return (
          <div
            key={name}
            className={cn(
              "font-bold text-[14px] group relative py-1.5 flex justify-between items-center cursor-pointer after:content-[''] after:absolute after:left-1/2 after:w-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 after:bg-secondary-light dark:after:bg-purple-light",
              `${isLast ? 'after:h-[0]' : 'after:h-[2px]'}`,
            )}
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
