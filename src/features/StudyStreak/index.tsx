import React from 'react'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'

import { StudyStreakProgressProps } from './types'

const StudyStreakProgress = ({
  locale,
  streak,
}: StudyStreakProgressProps): JSX.Element => {
  const currentDayLabel = streak.currentStreak === 1 ? locale.day : locale.days
  const bestDayLabel = streak.bestStreak === 1 ? locale.day : locale.days
  const recoveryText = streak.isRecoveryDayUsed
    ? locale.recoveryUsed
    : locale.recoveryAvailable

  return (
    <section
      aria-labelledby="study-streak-title"
      className="mb-4 rounded-2xl border border-[#eadeda] bg-[#fffaf8] p-3 dark:border-[#3b2a3d] dark:bg-[#211721]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-secondary-light dark:bg-[#35143d] dark:text-purple-light">
            <LocalFireDepartmentRoundedIcon sx={{ fontSize: 20 }} />
          </span>
          <h2
            id="study-streak-title"
            className="theme-text text-sm font-extrabold"
          >
            {locale.title}
          </h2>
        </div>
        <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white px-2 py-1 text-right text-[10px] font-bold leading-tight text-[#665c57] dark:bg-[#2d202e] dark:text-[#d2c7d2]">
          <ShieldOutlinedIcon sx={{ fontSize: 13 }} />
          {recoveryText}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 divide-x divide-[#eadeda] dark:divide-[#3b2a3d]">
        <div className="pr-3">
          <p className="text-[10px] font-semibold text-[#665c57] dark:text-[#d2c7d2]">
            {locale.current}
          </p>
          <p className="theme-text mt-0.5 font-extrabold tabular-nums">
            <span className="text-xl text-secondary-light dark:text-purple-light">
              {streak.currentStreak}
            </span>{' '}
            <span className="text-xs">{currentDayLabel}</span>
          </p>
        </div>
        <div className="pl-3">
          <p className="text-[10px] font-semibold text-[#665c57] dark:text-[#d2c7d2]">
            {locale.best}
          </p>
          <p className="theme-text mt-0.5 font-extrabold tabular-nums">
            <span className="text-xl">{streak.bestStreak}</span>{' '}
            <span className="text-xs">{bestDayLabel}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default StudyStreakProgress
