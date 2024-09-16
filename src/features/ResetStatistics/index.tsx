import React from 'react'
import DoneIcon from '@mui/icons-material/Done'

import { TypeButton, TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useResetStatistics } from './useResetStatistics'
import { ResetStatisticsProps } from './types'

const ResetStatistics = ({
  interfaceLang: { settings },
}: ResetStatisticsProps): JSX.Element => {
  const {
    isBtnActive,
    isReset,
    isDisabled,
    handleToggleButtons,
    resetStatistics,
  } = useResetStatistics()

  return (
    <div>
      <div className="flex items-center justify-between my-4">
        <Title
          title={
            isBtnActive
              ? settings.resetStatistics.askTitle
              : settings.resetStatistics.title
          }
          variant={TypeTittle.SMALL}
        />
        {!isBtnActive ? (
          <Button
            onClick={handleToggleButtons}
            variant={TypeButton.ERROR}
            disabled={isDisabled}
            classes="w-24"
          >
            {!isReset ? (
              settings.resetStatistics.reset
            ) : (
              <DoneIcon sx={{ fontSize: 16 }} />
            )}
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button classes="w-16" onClick={handleToggleButtons}>
              {settings.resetStatistics.no}
            </Button>
            <Button
              classes="w-16"
              onClick={resetStatistics}
              variant={TypeButton.ERROR}
            >
              {settings.resetStatistics.yes}
            </Button>
          </div>
        )}
      </div>
      {isBtnActive && (
        <span className="text-red-600 font-bold">
          {settings.resetStatistics.alert}
        </span>
      )}
    </div>
  )
}

export default ResetStatistics
