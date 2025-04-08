import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { RoutesPath, TypeButton } from '../../types'
import { stateSaverSlice } from '../../store/reducers/stateSaverReducer/StateSaverSlice'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import { useStateSaver } from '../../hooks/useStateSaver'
import { useSetSessionData } from '../../hooks/useSetSessionData'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { Links } from '../../components/Button/types'

export const usePopup = () => {
  const { saveStateAfterClose } = useAppSelector(state => state.SettingReducer)
  const { resetState } = stateSaverSlice.actions
  const dispatch = useAppDispatch()

  useTheme()
  const { updateSessionData } = useSetSessionData()

  const { interfaceLang } = useTranslate()
  const location = useLocation()
  const navigate = useNavigate()
  const { activeRouteLink, setActiveRoute } = useStateSaver()
  function getActiveRoute(path: RoutesPath): TypeButton {
    return location.pathname === path ? TypeButton.ACTIVE_LINK : TypeButton.LINK
  }

  function handleClick(page: RoutesPath): void {
    navigate(page)
    setActiveRoute(page)
  }

  const links: Links[] = [
    {
      route: () => handleClick(RoutesPath.TRACKER),
      variant: getActiveRoute(RoutesPath.TRACKER),
      name: interfaceLang.popup.header.tracker,
    },
    {
      route: () => handleClick(RoutesPath.AI_HELPER),
      variant: getActiveRoute(RoutesPath.AI_HELPER),
      name: interfaceLang.popup.header.aiHelper,
    },
    {
      route: () => handleClick(RoutesPath.HISTORY),
      variant: getActiveRoute(RoutesPath.HISTORY),
      name: interfaceLang.popup.header.history,
    },
    {
      route: () => handleClick(RoutesPath.ACHIEVEMENTS),
      variant: getActiveRoute(RoutesPath.ACHIEVEMENTS),
      name: interfaceLang.popup.header.achievements,
    },
    {
      route: () => handleClick(RoutesPath.STATISTICS),
      variant: getActiveRoute(RoutesPath.STATISTICS),
      name: interfaceLang.popup.header.statistics,
    },
  ]

  useEffect(() => {
    navigate(activeRouteLink)
    updateSessionData()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !saveStateAfterClose) {
        dispatch(resetState())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return { links }
}
