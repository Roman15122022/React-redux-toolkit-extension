import { useLocation, useNavigate } from 'react-router-dom'

import { RoutesPath, TypeButton } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import { Links } from '../../components/Button/types'

export const usePopup = () => {
  useTheme()

  const { interfaceLang } = useTranslate()
  const location = useLocation()
  const navigate = useNavigate()

  function getActiveRoute(path: RoutesPath): TypeButton {
    return location.pathname === path ? TypeButton.ACTIVE_LINK : TypeButton.LINK
  }

  function handleClick(page: RoutesPath): void {
    navigate(page)
  }

  const links: Links[] = [
    {
      route: () => handleClick(RoutesPath.TRACKER),
      variant: getActiveRoute(RoutesPath.TRACKER),
      name: interfaceLang.popup.header.tracker,
    },
    {
      route: () => handleClick(RoutesPath.HISTORY),
      variant: getActiveRoute(RoutesPath.HISTORY),
      name: interfaceLang.popup.header.history,
    },
    {
      route: () => handleClick(RoutesPath.STATISTICS),
      variant: getActiveRoute(RoutesPath.STATISTICS),
      name: interfaceLang.popup.header.statistics,
    },
    {
      route: () => handleClick(RoutesPath.ACHIEVEMENTS),
      variant: getActiveRoute(RoutesPath.ACHIEVEMENTS),
      name: interfaceLang.popup.header.achievements,
    },
  ]

  return { links }
}
