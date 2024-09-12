import React from 'react'
import { FormControl, MenuItem, Select } from '@mui/material'

import { Language } from '../../types'

import { LocaleSwitcherProps } from './types'

const LocaleSwitcher = ({
  handleSelectLocale,
  interfaceLang,
  language,
}: LocaleSwitcherProps): JSX.Element => {
  return (
    <div className="flex items-center justify-between my-4">
      <p className="text-lg theme-text font-semibold">
        {interfaceLang.settings.language}
      </p>
      <FormControl>
        <Select
          value={language}
          autoWidth
          onChange={handleSelectLocale}
          className="bg-secondary-light dark:bg-purple-dark light:text-white dark:text-white custom-select"
          IconComponent={null}
        >
          <MenuItem value={Language.EN}>EN</MenuItem>
          <MenuItem value={Language.UA}>UA</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default LocaleSwitcher
