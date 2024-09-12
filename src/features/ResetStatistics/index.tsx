import React from 'react'
import DoneIcon from '@mui/icons-material/Done'

import { TypeButton, TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useResetStatistics } from './useResetStatistics'

const ResetStatistics = (): JSX.Element => {
  const {
    locale,
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
          title={isBtnActive ? locale.askTitle : locale.title}
          variant={TypeTittle.SMALL}
        />
        {!isBtnActive ? (
          <Button
            onClick={handleToggleButtons}
            variant={TypeButton.ERROR}
            disabled={isDisabled}
            classes="w-24"
          >
            {!isReset ? locale.reset : <DoneIcon fontSize="small" />}
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
