import { TOTAL_VISIBLE_PAGES } from './constants'

export const usePaginationHistoryPages = (
  setCurrentPage: (page: number) => void,
  pages: Array<number>,
  currentPage: number,
) => {
  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= pages.length) {
      setCurrentPage(page)
    }
  }

  const handleSetFirstPage = (): void => {
    setCurrentPage(1)
  }

  const handleSetLastPage = (): void => {
    setCurrentPage(pages.length)
  }

  const handleNextPage = (): void => {
    if (currentPage === pages.length) return

    setCurrentPage(currentPage + 1)
  }

  const handlePreviousPage = (): void => {
    if (currentPage === 1) return

    setCurrentPage(currentPage - 1)
  }

  const renderPagination = (): Array<number> => {
    const pageNeighbours = Math.floor(TOTAL_VISIBLE_PAGES / 2)

    if (pages.length <= TOTAL_VISIBLE_PAGES) {
      return [...pages]
    }

    switch (true) {
      case currentPage <= pageNeighbours + 1:
        return pages.slice(0, TOTAL_VISIBLE_PAGES)

      case currentPage >= pages.length - pageNeighbours:
        return pages.slice(-TOTAL_VISIBLE_PAGES)

      default:
        const startPage = Math.max(0, currentPage - pageNeighbours - 1)

        return pages.slice(startPage, startPage + TOTAL_VISIBLE_PAGES)
    }
  }

  return {
    handleChangePage,
    handleSetLastPage,
    handleSetFirstPage,
    handleNextPage,
    handlePreviousPage,
    renderPagination: renderPagination(),
    isFirstArrowDisabled: currentPage === 1,
    isLastArrowDisabled: currentPage === pages.length,
  }
}
