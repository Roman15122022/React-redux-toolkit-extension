import React from 'react'
import { Checkbox, Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'

import { useSaveStateToggler } from './useSaveStateToggler'
import { SaveStateTogglerProps } from './types'
import { LABEL } from './constants'

const SaveStateToggler = ({
  interfaceLang,
  isDark,
}: SaveStateTogglerProps): JSX.Element => {
  const { colorCheckbox, handleChange, isChecked } = useSaveStateToggler(isDark)

  return (
    <div className="flex items-center justify-between my-4">
      <div className="flex items-center gap-5">
        <Title
          title={interfaceLang.settings.saveState.title}
          variant={TypeTittle.SMALL}
        />
        <Tooltip title={interfaceLang.settings.saveState.description}>
          <HelpOutlineIcon
            fontSize="medium"
            className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
          />
        </Tooltip>
      </div>

      <Checkbox
        {...LABEL}
        checked={isChecked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
        sx={{
          color: colorCheckbox,
          '&.Mui-checked': {
            color: colorCheckbox,
          },
        }}
      />
    </div>
  )
}

export default SaveStateToggler
