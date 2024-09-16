import React from 'react'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'

import { ThemeSwitcherProps } from './types'

const ThemeSwitcher = ({
  isDark,
  switchTheme,
  interfaceLang,
}: ThemeSwitcherProps): JSX.Element => {
  return (
    <div className="flex items-center justify-between my-4">
      <Title
        title={interfaceLang.settings.darkTheme}
        variant={TypeTittle.SMALL}
      />
      <div onClick={switchTheme} className="cursor-pointer">
        {isDark ? (
          <DarkModeIcon sx={{ fontSize: 28 }} color="secondary" />
        ) : (
          <LightModeIcon sx={{ fontSize: 28 }} color="warning" />
        )}
      </div>
    </div>
  )
}

export default ThemeSwitcher
