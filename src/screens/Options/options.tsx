import React from 'react'
import { useOptions } from './useOptions'
import { FormControl, MenuItem, Select, Switch } from '@mui/material'
import { Language } from '../../types/enums'
import { LABEL } from './constants'
import { Clicker } from '../../features/Clicker'

const Options = () => {
  const {
    language,
    isDark,
    handleSelectLocale,
    switchTheme,
    interfaceLang,
  } = useOptions()

  return (
    <div>
      <h1 className="font-bold theme-text text-2xl mt-4 ml-4">
        {interfaceLang.settings.title}👨‍🎓
      </h1>
      <div className="ml-8 mt-6">
        <div className="flex items-center justify-between my-4">
          <p className="text-lg theme-text font-semibold">
            {interfaceLang.settings.darkTheme}
          </p>
          <Switch
            {...LABEL}
            checked={isDark}
            onChange={switchTheme}
            size="small"
            color="secondary"
          />
        </div>
        <div className="flex items-center justify-between my-4">
          <p className="text-lg theme-text font-semibold">
            {interfaceLang.settings.language}
          </p>
          <FormControl>
            <Select
              value={language}
              label="Locale"
              autoWidth
              onChange={handleSelectLocale}
              className="theme-text theme-bg"
            >
              <MenuItem value={Language.EN}>EN</MenuItem>
              <MenuItem value={Language.UA}>UA</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <Clicker styles="ml-4" locale={interfaceLang} />
    </div>
  )
}

export default Options
