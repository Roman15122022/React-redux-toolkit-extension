import React from 'react'
import { PieChart } from '@mui/x-charts'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'

import { TextStatDomain } from '../TextStatDomain'
import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useDomainSiteInfo } from './useDomainSiteInfo'
import { DomainSiteInfoProps } from './types'
import { OTHERS_COLORS } from './constants'

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
    handleToggleBlackList,
    isInBlackList,
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
            onItemClick={e => {
              const path = e.target as HTMLElement

              if (path) {
                const fill = path.getAttribute('fill')

                if (fill === OTHERS_COLORS) {
                  handleToggleGraphText()
                }
              }
            }}
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
          <TextStatDomain
            allActualDomenDataText={allActualDomenDataText}
            handleToggleBlackList={handleToggleBlackList}
            isInBlackList={isInBlackList}
            btnAddBl={locale.btnAddBl}
            btnRemove={locale.btnRemove}
            removeFromBlack={locale.removeFromBlack}
            addToBlack={locale.addToBlack}
          />
        )}
      </div>
    </div>
  )
}
