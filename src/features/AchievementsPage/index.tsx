import React from 'react'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import ProgressBar from '../../components/ProgressBar'
import Container from '../../components/Container'

import { useAchievements } from './useAchievements'
import { getHours } from './helpers'
import { EXPERT, SPECIALIST } from './constants'

const AchievementsPage = (): JSX.Element => {
  const { locale, achievements } = useAchievements()

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
    <Container classes="mr-0">
      <div className="mt-10 h-[300px] overflow-y-scroll scrollbar-thin scrollbar scrollbar-thumb-secondary-light dark:scrollbar-track-white dark:scrollbar-thumb-purple-dark dark:scrollbar-track-black">
        {achievements.map((subject, index) => (
          <div key={subject.name} className="mt-4 w-[95%]">
            <span className="text-sm font-bold">
              {index + 1}. {subject.name}: {subject.totalTime}
            </span>
            <ProgressBar percents={subject.percents} classes="mt-3" />
            <div className="flex justify-between">
              <span>{getHours(subject.totalTimeInSeconds)}</span>
              <span>{subject.isSpec ? EXPERT : SPECIALIST}</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default AchievementsPage
