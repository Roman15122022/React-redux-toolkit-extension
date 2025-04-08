import React from 'react'

import { useDomainSiteInfo } from './useDomainSiteInfo'
import { DomainSiteInfoProps } from './types'

export const DomainSiteInfo = ({
  setIsActivityFilterVisible,
  period,
}: DomainSiteInfoProps): JSX.Element => {
  const {} = useDomainSiteInfo({ period, setIsActivityFilterVisible })

  return <div className="mt-2">123</div>
}
