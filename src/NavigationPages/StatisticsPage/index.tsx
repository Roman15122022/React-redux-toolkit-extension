import React from 'react'

import { TypeTittle } from '../../types'
import TextStatistics from '../../features/TextStatistics'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useStatisticsPage } from './useStatisticsPage'

const StatisticsPage = (): JSX.Element => {
  const { locale, isDataAvailable } = useStatisticsPage()

  if (!isDataAvailable)
    return (
      <Title
        classes="mt-5 text-center"
        title={locale.noStatistics}
        variant={TypeTittle.SMALL}
      />
    )

  return (
    <Container>
      <TextStatistics />
    </Container>
  )
}

export default StatisticsPage
