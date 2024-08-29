import React from 'react'
import { useOptions } from './useOptions'
import { FormControl, MenuItem, Select, Switch } from '@mui/material'
import { Language } from '../../types/enums'
import { LABEL } from './constants'

const Options = () => {
  const { count, language, isDark, handleSelectLocale, switchTheme } =
    useOptions()

  return (
    <div>
      <h1 className="font-bold text-2xl mt-4 ml-4">Settings👨‍🎓</h1>
      <div className="ml-8 mt-4">
        <div className="flex items-center justify-between my-4">
          <p className="text-lg font-semibold">Dark theme</p>
          <Switch
            {...LABEL}
            checked={isDark}
            onChange={switchTheme}
            size="small"
            color="secondary"
          />
        </div>
        <div className="flex items-center justify-between my-4">
          <p className="text-lg font-semibold">Language</p>
          <FormControl xs={{ m: 1, minWidth: 80 }}>
            <Select
              value={language}
              label="Locale"
              autoWidth
              onChange={handleSelectLocale}
            >
              <MenuItem value={Language.EN}>EN</MenuItem>
              <MenuItem value={Language.UA}>UA</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <p className="ml-4 mt-8">You clicked {count} time(s)</p>
    </div>
  )
}

export default Options
