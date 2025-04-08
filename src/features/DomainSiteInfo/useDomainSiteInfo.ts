import { useLayoutEffect } from 'react'

import { useAppSelector } from '../../hooks/useAppSelector'

import { DomainSiteInfoProps } from './types'

export const useDomainSiteInfo = ({
  setIsActivityFilterVisible,
  period,
}: DomainSiteInfoProps) => {
  const { sessions } = useAppSelector(state => state.SessionDataSlice)

  useLayoutEffect(() => {
    setIsActivityFilterVisible(false)

    return () => {
      setIsActivityFilterVisible(true)
    }
  }, [])

  return {}
}
