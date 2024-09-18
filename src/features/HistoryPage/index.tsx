import React from 'react'

import { TypeButton } from '../../types'
import Container from '../../components/Container'
import Button from '../../components/Button'

import { useHistoryPage } from './useHistoryPage'

const HistoryPage = (): JSX.Element => {
  const { historyDates } = useHistoryPage()

  return (
    <Container>
      <div className="flex gap-2 flex-wrap">
        {historyDates.map(({ name, onClick, isSelected }) => (
          <Button
            onClick={onClick}
            variant={isSelected ? TypeButton.SECONDARY : TypeButton.PRIMARY}
          >
            {name}
          </Button>
        ))}
      </div>
    </Container>
  )
}

export default HistoryPage
