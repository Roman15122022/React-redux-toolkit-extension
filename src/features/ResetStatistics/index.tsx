import React from 'react'
import DoneIcon from '@mui/icons-material/Done'

import { TypeButton, TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useResetStatistics } from './useResetStatistics'
import { ResetStatisticsProps } from './types'

const ResetStatistics = ({
  interfaceLang,
}: ResetStatisticsProps): JSX.Element => {
  const {
    locale,
    titleText,
    isBtnActive,
    isReset,
    isDisabled,
    handleToggleButtons,
    resetStatistics,
  } = useResetStatistics(interfaceLang)

  return (
    <div>
      <div className="flex items-center justify-between my-4">
        <Title title={titleText} variant={TypeTittle.SMALL} />
        {!isBtnActive ? (
          <Button
            onClick={handleToggleButtons}
            variant={TypeButton.ERROR}
            disabled={isDisabled}
            classes="w-24"
          >
            {!isReset ? locale.reset : <DoneIcon sx={{ fontSize: 16 }} />}
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button classes="w-16" onClick={handleToggleButtons}>
              {locale.no}
            </Button>
            <Button
              classes="w-16"
              onClick={resetStatistics}
              variant={TypeButton.ERROR}
            >
              {locale.yes}
            </Button>
          </div>
        )}
      </div>
      {isBtnActive && (
        <span className="text-red-600 font-bold">{locale.alert}</span>
      )}
    </div>
  )
}

export default ResetStatistics
