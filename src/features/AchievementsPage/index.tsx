import React from 'react'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useAchievements } from './useAchievements'

const AchievementsPage = (): JSX.Element => {
  const { locale, activities } = useAchievements()

  if (!activities.length) {
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
      <div></div>
    </Container>
  )
}

export default AchievementsPage
