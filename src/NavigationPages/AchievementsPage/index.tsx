import React, { createElement } from 'react'
import { Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import ProgressBar from '../../components/ProgressBar'
import Container from '../../components/Container'

import { useAchievements } from './useAchievements'
import { getHours } from './helpers'
import { EXPERT, SPECIALIST } from './constants'

const AchievementsPage = (): JSX.Element => {
  const { locale, achievements, iconSort } = useAchievements()

  if (!achievements.length) {
    return (
      <Title
        variant={TypeTittle.SMALL}
        classes="mt-5 text-center"
        title={locale.noAchievements}
      />
    )
  }

  return (
    <Container classes="mr-0 mt-4">
      <div className="flex gap-3 justify-end items-center w-[95%]">
        <button onClick={iconSort.onClick}>
          {createElement(iconSort.icon, {
            fontSize: 'small',
            className: 'hover:text-secondary-light dark:hover:text-purple-dark',
          })}
        </button>
        <Tooltip title={locale.info}>
          <HelpOutlineIcon
            fontSize="small"
            className="hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
          />
        </Tooltip>
      </div>
      <div className="h-[300px] overflow-y-scroll scrollbar-thin scrollbar scrollbar-thumb-secondary-light dark:scrollbar-track-white dark:scrollbar-thumb-purple-dark dark:scrollbar-track-black">
        {achievements.map((subject, index) => (
          <div key={subject.name} className="mt-4 w-[97%]">
            <span className="text-sm font-bold">
              {index + 1}. {subject.name}:{' '}
              <span className="text-secondary-light dark:text-purple-light">
                {subject.totalTime}
              </span>
            </span>
            <ProgressBar percents={subject.percents} classes="mt-3" />
            <div className="mt-1 flex justify-between relative">
              <span>{getHours(subject.totalTimeInSeconds)}</span>
              <span className="absolute right-[50%] text-secondary-light dark:text-purple-light">
                {Math.round(subject.percents)}%
              </span>
              <span>{subject.isSpec ? EXPERT : SPECIALIST}</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default AchievementsPage
