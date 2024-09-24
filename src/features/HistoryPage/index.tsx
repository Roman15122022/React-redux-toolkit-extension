import React from 'react'

import StudyTimeInfoForDay from '../StudyTimeInfoForDay'
import { TypeButton } from '../../types'
import Container from '../../components/Container'
import Button from '../../components/Button'

import { useHistoryPage } from './useHistoryPage'

const HistoryPage = (): JSX.Element => {
  const { historyDates, selectedDate, pages, currentPage, setCurrentPage } =
    useHistoryPage()

  return (
    <Container classes="mr-2 ">
      <div className="h-[118px]">
        <div className="flex gap-2 flex-wrap justify-start">
          {historyDates.map(({ name, onClick, isSelected }) => (
            <Button
              key={name}
              onClick={onClick}
              variant={isSelected ? TypeButton.SECONDARY : TypeButton.PRIMARY}
              classes="w-[85px]"
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2 justify-start">
        {pages.map(page => (
          <Button
            variant={
              currentPage === page ? TypeButton.CURRENT_PAGE : TypeButton.PAGE
            }
            disabled={currentPage === page}
            classes="px-2 py-2 rounded-xl"
            key={page}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </div>
      <StudyTimeInfoForDay date={selectedDate} isLastTimeNeeded={false} />
    </Container>
  )
}

export default HistoryPage
