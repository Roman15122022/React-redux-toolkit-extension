import React from 'react'

import { useHistoryPage } from './useHistoryPage'

const HistoryPage = (): JSX.Element => {
  const { interfaceLang, arrayUniqDates } = useHistoryPage()

  return (
    <div>
      {arrayUniqDates.map(date => (
        <div>{date}</div>
      ))}
    </div>
  )
}

export default HistoryPage
