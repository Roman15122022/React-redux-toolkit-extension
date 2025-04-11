import React from 'react'
import './options.css'
import WestIcon from '@mui/icons-material/West'

import { TypeTittle } from '../../types'
import ThemeSwitcher from '../../features/ThemeSwitcher'
import SaveStateToggler from '../../features/SaveStateToggler'
import ResetStatistics from '../../features/ResetStatistics'
import NotificationSetting from '../../features/NotificationSetting'
import LocaleSwitcher from '../../features/LocaleSwitcher'
import { BlackListSwitcher } from '../../features/BlackListSwitcher'
import { BlackList } from '../../features/BlackList'
import Title from '../../components/Title'
import StyledLink from '../../components/StyledLink'

import { useOptions } from './useOptions'

const Options = (): JSX.Element => {
  const {
    language,
    isDark,
    handleSelectLocale,
    switchTheme,
    interfaceLang,
    isBlackList,
    toggleBlackList,
    title,
  } = useOptions()

  return (
    <div className="w-[500px] m-auto mt-4">
      {isBlackList && (
        <WestIcon
          onClick={toggleBlackList}
          className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
          sx={{ fontSize: 24 }}
        />
      )}
      <Title title={title} variant={TypeTittle.LARGE} classes="text-center" />
      <div className="mt-6">
        {isBlackList ? (
          <BlackList />
        ) : (
          <>
            <ThemeSwitcher
              switchTheme={switchTheme}
              isDark={isDark}
              interfaceLang={interfaceLang}
            />
            <LocaleSwitcher
              interfaceLang={interfaceLang}
              language={language}
              handleSelectLocale={handleSelectLocale}
            />
            <SaveStateToggler isDark={isDark} interfaceLang={interfaceLang} />
            <NotificationSetting
              isDark={isDark}
              interfaceLang={interfaceLang}
            />
            <div className="border-t-2 mt-4 dark:border-white" />
            <BlackListSwitcher
              interfaceLang={interfaceLang}
              toggleBlackList={toggleBlackList}
            />
            <ResetStatistics interfaceLang={interfaceLang} />

            <p className="theme-text text-center mt-8 opacity-60">
              {interfaceLang.settings.createdBy}
              <StyledLink href="https://github.com/Roman15122022">
                @Roman15122022
              </StyledLink>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Options
