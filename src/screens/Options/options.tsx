import React from 'react'
import './options.css'
import { useOptions } from './useOptions'
import { FormControl, MenuItem, Select } from '@mui/material'
import { Language } from '../../types/enums'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { Clicker } from '../../features/Clicker'

const Options = () => {
  const { language, isDark, handleSelectLocale, switchTheme, interfaceLang } =
    useOptions()

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
          <div onClick={switchTheme} className="cursor-pointer">
            {isDark ? (
              <DarkModeIcon sx={{ fontSize: 28 }} color="secondary" />
            ) : (
              <LightModeIcon sx={{ fontSize: 28 }} color="warning" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between my-4">
          <p className="text-lg theme-text font-semibold">
            {interfaceLang.settings.language}
          </p>
          <FormControl>
            <Select
              value={language}
              autoWidth
              onChange={handleSelectLocale}
              className="bg-purple-light dark:bg-purple-dark light:text-white dark:text-white custom-select"
              IconComponent={null}
            >
              <MenuItem value={Language.EN}>EN</MenuItem>
              <MenuItem value={Language.UA}>UA</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Clicker locale={interfaceLang} />
      </div>
      <p className="theme-text text-right mt-6 opacity-60">
        {interfaceLang.settings.createdBy}
        <a className="font-bold text-purple-dark dark:text-purple-light opacity-100" target="_blank" href="https://github.com/Roman15122022">@Roman15122022</a>
      </p>
    </div>
  )
}

export default Options
