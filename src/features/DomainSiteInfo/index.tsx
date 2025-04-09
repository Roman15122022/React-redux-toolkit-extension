import React from 'react'
import { PieChart } from '@mui/x-charts'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'

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
    allActualDomenDataText,
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
          classes="flex items-center gap-2"
          onClick={handleToggleGraphText}
        >
          {locale.mode}
          {isGraph ? (
            <DonutLargeIcon sx={{ fontSize: 16 }} />
          ) : (
            <FormatListNumberedIcon sx={{ fontSize: 16 }} />
          )}
        </Button>
      </div>
      <div className="mt-2">
        {isGraph ? (
          <PieChart
            className="pr-3"
            series={[
              {
                data: filterToOtherData,
                highlightScope: { fade: 'global', highlight: 'item' },
                innerRadius: 60,
                faded: {
                  innerRadius: 60,
                  additionalRadius: -20,
                  color: 'gray',
                },
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
        ) : (
          <div className="-mr-4 h-[250px] overflow-y-scroll scrollbar-thin scrollbar scrollbar-thumb-secondary-light dark:scrollbar-track-white dark:scrollbar-thumb-purple-dark dark:scrollbar-track-black">
            {allActualDomenDataText.map(({ label, value }, index) => {
              return (
                <div className="mt-1.5 flex justify-between items-center">
                  <Title
                    title={`${index + 1}. ${label}`}
                    variant={TypeTittle.TINY}
                  />
                  <span className="mr-1 font-bold text-secondary-light dark:text-purple-light">
                    {value}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
