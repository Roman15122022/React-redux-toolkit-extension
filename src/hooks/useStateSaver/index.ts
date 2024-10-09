import { useAppSelector } from '../useAppSelector'
import { stateSaverSlice } from '../../store/reducers/stateSaverReducer/StateSaverSlice'
import { useAppDispatch } from '../useAppDispatch'
import { RoutesPath, Sort } from '../../types'
import { StateHistoryPage } from '../../store/reducers/stateSaverReducer/types'

export const useStateSaver = () => {
  const { activityNameInput, historyPage, sortAchievement, activeRouteLink } =
    useAppSelector(state => state.StateSaverReducer)
  const {
    saveHistoryState,
    saveSortAchievement,
    saveActivityName,
    saveActiveRoute,
  } = stateSaverSlice.actions

  const dispatch = useAppDispatch()

  const setSelectedNameInput = (value: string): void => {
    dispatch(saveActivityName(value))
  }

  const setHistoryState = (state: StateHistoryPage): void => {
    dispatch(saveHistoryState(state))
  }

  const setTypeOfSortAchievement = (sort: Sort): void => {
    dispatch(saveSortAchievement(sort))
  }

  const setActiveRoute = (route: RoutesPath): void => {
    dispatch(saveActiveRoute(route))
  }

  return {
    activityNameInput,
    historyPage,
    sortAchievement,
    activeRouteLink,
    setSelectedNameInput,
    setHistoryState,
    setTypeOfSortAchievement,
    setActiveRoute,
  }
}
