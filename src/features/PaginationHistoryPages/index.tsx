import React from 'react'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

import { TypeButton } from '../../types'
import Button from '../../components/Button'

import { usePaginationHistoryPages } from './usePaginationHistoryPages'
import { PaginationHistoryPagesProps } from './types'
import { ARROW_SIZE } from './constants'

const PaginationHistoryPages = ({
  currentPage,
  pages,
  setCurrentPage,
}: PaginationHistoryPagesProps): JSX.Element => {
  const {
    handleChangePage,
    handleSetFirstPage,
    handleSetLastPage,
    handlePreviousPage,
    handleNextPage,
    renderPagination,
    isLastArrowDisabled,
    isFirstArrowDisabled,
  } = usePaginationHistoryPages(setCurrentPage, pages, currentPage)

  return (
    <div className="mt-3 flex justify-center items-center">
      <div>
        <Button
          classes="px-1"
          variant={TypeButton.LINK}
          disabled={isFirstArrowDisabled}
          onClick={handleSetFirstPage}
        >
          <KeyboardDoubleArrowLeftIcon sx={{ fontSize: ARROW_SIZE }} />
        </Button>
        <Button
          classes="px-1"
          variant={TypeButton.LINK}
          disabled={isFirstArrowDisabled}
          onClick={handlePreviousPage}
        >
          <KeyboardArrowLeftIcon sx={{ fontSize: ARROW_SIZE }} />
        </Button>
      </div>
      <div className="flex gap-2 mx-2 select-none">
        {renderPagination.map(page => (
          <Button
            variant={
              currentPage === page ? TypeButton.CURRENT_PAGE : TypeButton.PAGE
            }
            disabled={currentPage === page}
            classes="px-2 py-2 rounded-xl"
            key={page}
            onClick={() => handleChangePage(page)}
          >
            {page}
          </Button>
        ))}
      </div>
      <div>
        <Button
          classes="px-1"
          variant={TypeButton.LINK}
          disabled={isLastArrowDisabled}
          onClick={handleNextPage}
        >
          <KeyboardArrowRightIcon sx={{ fontSize: ARROW_SIZE }} />
        </Button>
        <Button
          classes="px-1"
          variant={TypeButton.LINK}
          disabled={isLastArrowDisabled}
          onClick={handleSetLastPage}
        >
          <KeyboardDoubleArrowRightIcon sx={{ fontSize: ARROW_SIZE }} />
        </Button>
      </div>
    </div>
  )
}

export default PaginationHistoryPages
