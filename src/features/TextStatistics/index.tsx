import React from 'react'

import { useTextStatistics } from './useTextStatistics'

const TextStatistics = (): JSX.Element => {
  const { statisticsFields } = useTextStatistics()

  return (
    <div className="mt-12">
      {statisticsFields.map(({ name, value }) => {
        return (
          <div
            key={name}
            className="py-1 font-bold text-[14px] flex justify-between items-center border-b dark:border-purple-light"
          >
            <span>{name}</span>
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
