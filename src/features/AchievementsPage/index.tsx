import React from 'react'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import ProgressBar from '../../components/ProgressBar'
import Container from '../../components/Container'

import { useAchievements } from './useAchievements'
import { EXPERT, SPECIALIST } from './constants'
import { getHours } from './helpers'

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
    <Container>
      <div className="mt-10">
        {achievements.map((subject, index) => (
          <div key={subject.name} className="mt-4">
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
