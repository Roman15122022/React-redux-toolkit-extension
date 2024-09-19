import React from 'react'

import StudyTimeInfoForDay from '../StudyTimeInfoForDay'
import { TypeButton } from '../../types'
import Container from '../../components/Container'
import Button from '../../components/Button'

import { useHistoryPage } from './useHistoryPage'

const HistoryPage = (): JSX.Element => {
  const { historyDates, selectedDate } = useHistoryPage()

  return (
    <Container>
      <div className="flex gap-2 flex-wrap">
        {historyDates.map(({ name, onClick, isSelected }) => (
          <Button
            key={name}
            onClick={onClick}
            variant={isSelected ? TypeButton.SECONDARY : TypeButton.PRIMARY}
          >
            {name}
          </Button>
        ))}
      </div>
      <StudyTimeInfoForDay date={selectedDate} />
    </Container>
  )
}

export default HistoryPage
