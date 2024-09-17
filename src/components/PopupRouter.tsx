import { Route, Routes } from 'react-router-dom'
import React from 'react'

import { RoutesPath } from '../types'
import TrackTimePage from '../features/TrackTimePage'
import StatisticsPage from '../features/StatisticsPage'
import HistoryPage from '../features/HistoryPage'

const PopupRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route path={RoutesPath.TRACKER} element={<TrackTimePage />} />
      <Route path={RoutesPath.HISTORY} element={<HistoryPage />} />
      <Route path={RoutesPath.STATISTICS} element={<StatisticsPage />} />
    </Routes>
  )
}

export default PopupRouter
