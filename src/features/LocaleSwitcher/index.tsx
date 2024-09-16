import React from 'react'
import { FormControl, MenuItem, Select } from '@mui/material'

import { Language, TypeTittle } from '../../types'
import Title from '../../components/Title'

import { LocaleSwitcherProps } from './types'

const LocaleSwitcher = ({
  handleSelectLocale,
  interfaceLang,
  language,
}: LocaleSwitcherProps): JSX.Element => {
  return (
    <div className="flex items-center justify-between my-4">
      <Title
        title={interfaceLang.settings.language}
        variant={TypeTittle.SMALL}
      />
      <FormControl>
        <Select
          value={language}
          autoWidth
          onChange={handleSelectLocale}
          className="bg-secondary-light dark:bg-purple-dark light:text-white dark:text-white custom-select"
          IconComponent={undefined}
        >
          <MenuItem value={Language.EN}>EN</MenuItem>
          <MenuItem value={Language.UA}>UA</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default LocaleSwitcher
