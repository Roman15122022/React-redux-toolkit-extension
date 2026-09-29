import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import {
  closeSidePanel,
  getSidePanelApi,
  isSidePanelOpen,
  openSidePanel,
} from '../../utils/sidePanel'
import { RoutesPath, TypeButton } from '../../types'
import { stateSaverSlice } from '../../store/reducers/stateSaverReducer/StateSaverSlice'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import { useStateSaver } from '../../hooks/useStateSaver'
import { useSetSessionData } from '../../hooks/useSetSessionData'
import { useManageDistractingDomains } from '../../hooks/useManageDistractingDomains'
import { useManageBlackListDomain } from '../../hooks/useManageBlackListDomain'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { Links } from '../../components/Button/types'

export const usePopup = () => {
  const { saveStateAfterClose } = useAppSelector(state => state.SettingReducer)
  const { resetState } = stateSaverSlice.actions
  const dispatch = useAppDispatch()

  useTheme()
  const { updateSessionData } = useSetSessionData()
  const { handleSetBlackList } = useManageBlackListDomain()
  const { handleSetDistractingDomains } = useManageDistractingDomains()

  const { interfaceLang } = useTranslate()
  const [panelError, setPanelError] = useState<'open' | 'close' | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelBusy, setPanelBusy] = useState(false)
  const [panelWindowId, setPanelWindowId] = useState<number>()
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

  function handleToggleSidePanel(): void {
    if (panelWindowId === undefined || panelBusy) return

    setPanelError(null)
    setPanelBusy(true)
    const operation = panelOpen
      ? closeSidePanel(panelWindowId)
      : openSidePanel(panelWindowId)

    void operation
      .then(() => setPanelOpen(!panelOpen))
      .catch(() => setPanelError(panelOpen ? 'close' : 'open'))
      .finally(() => setPanelBusy(false))
  }

  useEffect(() => {
    if (!getSidePanelApi()) return undefined

    let disposed = false
    let refreshInterval: ReturnType<typeof setInterval> | undefined

    chrome.windows.getCurrent(currentWindow => {
      if (disposed) return

      if (currentWindow.id === undefined) {
        setPanelError('open')

        return
      }

      const windowId = currentWindow.id
      setPanelWindowId(windowId)
      const refreshPanelState = () => {
        void isSidePanelOpen(windowId)
          .then(isOpen => {
            if (!disposed) setPanelOpen(isOpen)
          })
          .catch(() => {
            if (!disposed) setPanelError('open')
          })
      }

      refreshPanelState()
      refreshInterval = setInterval(refreshPanelState, 500)
    })

    return () => {
      disposed = true
      clearInterval(refreshInterval)
    }
  }, [])

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
    updateSessionData()
    handleSetBlackList()
    handleSetDistractingDomains()
    navigate(activeRouteLink)

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

  return {
    links,
    canOpenSidePanel:
      location.pathname === RoutesPath.TRACKER && Boolean(getSidePanelApi()),
    handleToggleSidePanel,
    panelOpen,
    panelDisabled: panelBusy || panelWindowId === undefined,
    panelError,
    panelLocale: interfaceLang.sidePanel,
  }
}
