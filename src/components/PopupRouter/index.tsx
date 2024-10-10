import { Route, Routes } from 'react-router-dom'
import React from 'react'

import { RoutesPath } from '../../types'
import TrackTimePage from '../../NavigationPages/TrackTimePage'
import StatisticsPage from '../../NavigationPages/StatisticsPage'
import HistoryPage from '../../NavigationPages/HistoryPage'
import AchievementsPage from '../../NavigationPages/AchievementsPage'

const PopupRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route path={RoutesPath.TRACKER} element={<TrackTimePage />} />
      <Route path={RoutesPath.HISTORY} element={<HistoryPage />} />
      <Route path={RoutesPath.ACHIEVEMENTS} element={<AchievementsPage />} />
      <Route path={RoutesPath.STATISTICS} element={<StatisticsPage />} />
    </Routes>
  )
}

export default PopupRouter
