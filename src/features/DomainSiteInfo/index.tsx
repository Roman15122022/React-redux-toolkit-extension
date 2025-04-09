import React from 'react'
import { PieChart } from '@mui/x-charts'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useDomainSiteInfo } from './useDomainSiteInfo'
import { DomainSiteInfoProps } from './types'

export const DomainSiteInfo = ({
  setIsActivityFilterVisible,
  period,
}: DomainSiteInfoProps): JSX.Element => {
  const {
    locale,
    filterToOtherData,
    colorText,
    valueFormatter,
    isGraph,
    handleToggleGraphText,
  } = useDomainSiteInfo({
    period,
    setIsActivityFilterVisible,
  })

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <Title variant={TypeTittle.SMALL} title={locale.title} />
        <Button
          classes="bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
          onClick={() => {}}
        >
          {locale.blackList}
        </Button>
      </div>
      <div className="mt-2">
        <PieChart
          className="pr-3"
          series={[
            {
              data: filterToOtherData,
              highlightScope: { fade: 'global', highlight: 'item' },
              innerRadius: 60,
              faded: { innerRadius: 60, additionalRadius: -20, color: 'gray' },
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
