import React from 'react'
import { PieChart } from '@mui/x-charts'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'

import { useDomainSiteInfo } from './useDomainSiteInfo'
import { DomainSiteInfoProps } from './types'

export const DomainSiteInfo = ({
  setIsActivityFilterVisible,
  period,
}: DomainSiteInfoProps): JSX.Element => {
  const { locale, actualDomenData, colorText, valueFormatter } =
    useDomainSiteInfo({
      period,
      setIsActivityFilterVisible,
    })

  return (
    <div className="mt-2">
      <div>
        <Title variant={TypeTittle.SMALL} title={locale.title} />
      </div>
      <div>
        <PieChart
          className="pr-3"
          series={[
            {
              data: actualDomenData,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              valueFormatter,
            },
          ]}
          width={400}
          height={220}
          slotProps={{
            legend: {
              labelStyle: {
                fill: colorText,
                fontSize: 11,
              },
            },
          }}
        />
      </div>
    </div>
  )
}
