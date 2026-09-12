import React from 'react'

import { cn } from '../../utils'

import { useStudyTimeInfoForDay } from './useStudyTimeInfoForDay'
import { StudyTimeInfoProps } from './types'

const StudyTimeInfoForDay = ({
  lastTime,
  date,
  isLastTimeNeeded,
  classes,
  sxList,
  onSelectPeriod,
  compactTotal = false,
  heading,
}: StudyTimeInfoProps): JSX.Element => {
  const { locale, periods, summaryLocale, totalForDay } =
    useStudyTimeInfoForDay(date)
  const hasTotalForDay = Boolean(totalForDay.trim())

  return (
    <div
      className={cn(
        'theme-text mt-5 select-none font-semibold text-sm',
        classes,
      )}
    >
      {isLastTimeNeeded &&
        (lastTime ? (
          <div className="flex items-center">
            <span>{locale.lastTime}:</span>
            <span className="ml-2 text-secondary-light dark:text-purple-light">
              {lastTime}
            </span>
          </div>
        ) : (
          <div className="invisible" aria-hidden="true">
            1
          </div>
        ))}
      {compactTotal && (heading || hasTotalForDay) && (
        <div className="mb-2 flex min-h-7 items-center justify-between gap-3">
          {heading && (
            <span className="min-w-0 truncate text-[14px] font-bold">
              {heading}
            </span>
          )}
          {hasTotalForDay && (
            <span className="ml-auto inline-flex shrink-0 items-baseline gap-1.5 rounded-full border border-orange-200 bg-[#fff7f1] px-2.5 py-1 text-[11px] leading-none dark:border-purple-dark dark:bg-[#201124]">
              <span className="text-gray-700 dark:text-gray-200">
                {locale.dayTotal}
              </span>
              <span className="tabular-nums text-[13px] font-bold text-secondary-light dark:text-purple-light">
                {totalForDay}
              </span>
            </span>
          )}
        </div>
      )}
      {periods.length > 0 && (
        <div
          className={cn(
            'mt-2 h-[125px] overflow-y-auto pr-1 scrollbar-thin scrollbar scrollbar-track-transparent scrollbar-thumb-secondary-light dark:scrollbar-thumb-purple-dark',
            compactTotal && 'mt-0',
            sxList,
          )}
        >
          {periods
            .map(({ period, activityName, source }, index) => (
              <button
                type="button"
                key={period + index}
                disabled={!onSelectPeriod}
                title={onSelectPeriod ? summaryLocale.openReport : undefined}
                onClick={() => onSelectPeriod?.(source)}
                className="flex w-full items-center rounded-lg px-1.5 py-1 text-left text-xs transition-colors enabled:hover:bg-orange-50 enabled:focus-visible:outline enabled:focus-visible:outline-2 enabled:focus-visible:outline-secondary-light dark:enabled:hover:bg-purple-dark/20 dark:enabled:focus-visible:outline-purple-light"
              >
                <span className="min-w-0 flex-1 truncate">
                  {index + 1}. {activityName}:
                </span>
                <span className="ml-2 text-secondary-light dark:text-purple-light">
                  {period}
                </span>
              </button>
            ))
            .reverse()}
        </div>
      )}

      {!compactTotal && hasTotalForDay && (
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
