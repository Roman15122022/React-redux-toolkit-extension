import React from 'react'

import { useStudyTimeInfoForDay } from './useStudyTimeInfoForDay'
import { StudyTimeInfoProps } from './types'

const StudyTimeInfoForDay = ({ lastTime }: StudyTimeInfoProps): JSX.Element => {
  const { locale, periods, totalForDay } = useStudyTimeInfoForDay()

  return (
    <div className="mt-5 font-semibold text-sm">
      {lastTime && (
        <div className="flex items-center">
          <span>{locale.lastTime}:</span>
          <span className="ml-2 text-secondary-light dark:text-purple-light">
            {lastTime}
          </span>
        </div>
      )}

      {periods.length > 0 && (
        <div className="my-1.5 h-32 overflow-y-scroll scrollbar-thin scrollbar scrollbar-thumb-secondary-light dark:scrollbar-track-white dark:scrollbar-thumb-purple-dark dark:scrollbar-track-black">
          {periods
            .map((period, index) => (
              <div key={period} className="flex items-center mt-1">
                <span>
                  {index + 1}. {locale.period}:
                </span>
                <span className="ml-2 text-secondary-light dark:text-purple-light">
                  {period}
                </span>
              </div>
            ))
            .reverse()}
        </div>
      )}

      {totalForDay.trim() && (
        <div className="flex items-center mt-2 text-lg">
          <span>{locale.totalForDay}:</span>
          <span className="ml-2 text-secondary-light dark:text-purple-light">
            {totalForDay}
          </span>
        </div>
      )}
    </div>
  )
}

export default StudyTimeInfoForDay
