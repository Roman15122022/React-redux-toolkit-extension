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
      <button
        type="button"
        onClick={switchTheme}
        aria-label={interfaceLang.settings.darkTheme}
        className="rounded-lg p-2 hover:bg-secondary-light/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-goal-light dark:hover:bg-purple-light/10 dark:focus-visible:outline-goal-dark"
      >
        {isDark ? (
          <DarkModeIcon sx={{ fontSize: 28 }} color="secondary" />
        ) : (
          <LightModeIcon sx={{ fontSize: 28 }} color="warning" />
        )}
      </button>
    </div>
  )
}

export default ThemeSwitcher
