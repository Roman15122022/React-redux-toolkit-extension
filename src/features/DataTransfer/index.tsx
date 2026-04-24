import React from 'react'
import { Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { cn } from '../../utils'
import { TypeButton, TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useDataTransfer } from './useDataTransfer'
import { DataTransferProps } from './types'

const DataTransfer = ({ interfaceLang }: DataTransferProps): JSX.Element => {
  const { dataTransfer } = interfaceLang.settings
  const {
    handleExportData,
    handleImportClick,
    handleImportData,
    inputRef,
    statusMessage,
  } = useDataTransfer()

  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Title title={dataTransfer.title} variant={TypeTittle.SMALL} />
          <Tooltip title={dataTransfer.description}>
            <HelpOutlineIcon
              fontSize="medium"
              className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
            />
          </Tooltip>
        </div>

        <div className="flex gap-3">
          <Button
            classes="w-24"
            onClick={() => handleExportData(dataTransfer.exportSuccess)}
          >
            {dataTransfer.export}
          </Button>
          <Button
            classes="w-24"
            variant={TypeButton.SECONDARY}
            onClick={handleImportClick}
          >
            {dataTransfer.import}
          </Button>
        </div>
      </div>

      {statusMessage && (
        <span
          className={cn(
            'mt-2 block text-[13px] font-semibold',
            statusMessage.type === 'success'
              ? 'text-secondary-light dark:text-purple-light'
              : 'text-red-600',
          )}
        >
          {statusMessage.text}
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={event =>
          handleImportData(
            event,
            dataTransfer.importSuccess,
            dataTransfer.importError,
          )
        }
      />
    </div>
  )
}

export default DataTransfer
