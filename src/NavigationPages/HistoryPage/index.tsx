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
    fullMonthName,
    handleSetCurrentPage,
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
        setCurrentPage={handleSetCurrentPage}
        currentPage={currentPage}
      />
      {!!selectedDate ? (
        <span className="text-[14px] font-[700]">{fullMonthName}</span>
      ) : (
        <span className="text-white text-[14px] font-[700] font-bold dark:text-black select-none">
          1
        </span>
      )}
      <StudyTimeInfoForDay
        date={selectedDate}
        isLastTimeNeeded={false}
        classes="mt-0"
        sxList="mt-0"
      />
    </Container>
  )
}

export default HistoryPage
