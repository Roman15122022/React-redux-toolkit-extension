import React from 'react'

import { TypeButton, TypeTittle } from '../../types'
import StudyTimeInfoForDay from '../../features/StudyTimeInfoForDay'
import PaginationHistoryPages from '../../features/PaginationHistoryPages'
import Title from '../../components/Title'
import Container from '../../components/Container'
import Button from '../../components/Button'

import { useHistoryPage } from './useHistoryPage'

const HistoryPage = (): JSX.Element => {
  const {
    interfaceLang,
    historyDates,
    selectedDate,
    pages,
    currentPage,
    setCurrentPage,
  } = useHistoryPage()

  if (!historyDates.length) {
    return (
      <Title
        variant={TypeTittle.SMALL}
        classes="mt-5 text-center"
        title={interfaceLang.popup.history.noHistory}
      />
    )
  }

  return (
    <Container>
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
      <PaginationHistoryPages
        pages={pages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <StudyTimeInfoForDay
        date={selectedDate}
        isLastTimeNeeded={false}
        classes="mt-3"
      />
    </Container>
  )
}

export default HistoryPage
