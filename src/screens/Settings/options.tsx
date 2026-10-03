import React from 'react'
import './options.css'
import WestIcon from '@mui/icons-material/West'

import { TypeTittle } from '../../types'
import ThemeSwitcher from '../../features/ThemeSwitcher'
import GoalSettings from '../../features/StudyGoals/GoalSettings'
import SaveStateToggler from '../../features/SaveStateToggler'
import ResetStatistics from '../../features/ResetStatistics'
import NotificationSetting from '../../features/NotificationSetting'
import LocaleSwitcher from '../../features/LocaleSwitcher'
import DataTransfer from '../../features/DataTransfer'
import { BlackListSwitcher } from '../../features/BlackListSwitcher'
import { BlackList } from '../../features/BlackList'
import Title from '../../components/Title'
import StyledLink from '../../components/StyledLink'

import { useOptions } from './useOptions'
import HistoryHeatmapOptions from './HistoryHeatmapOptions'

const Options = (): JSX.Element => {
  const {
    language,
    isDark,
    handleSelectLocale,
    switchTheme,
    interfaceLang,
    isBlackList,
    isHistory,
    toggleBlackList,
    toggleHistory,
    title,
  } = useOptions()

  return (
    <div
      className={`${
        isHistory ? 'w-[1220px]' : 'w-[760px]'
      } options-page mx-auto my-6 max-w-[calc(100vw-32px)] rounded-2xl border border-[#eadeda] bg-white p-5 sm:p-8 dark:border-[#3b2440] dark:bg-[#120d13]`}
    >
      {(isBlackList || isHistory) && (
        <button
          type="button"
          onClick={isHistory ? toggleHistory : toggleBlackList}
          aria-label={interfaceLang.settings.title}
          className="mb-3 rounded-lg p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-goal-light dark:focus-visible:outline-goal-dark"
        >
          <WestIcon
            className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
            sx={{ fontSize: 24 }}
          />
        </button>
      )}
      <Title title={title} variant={TypeTittle.LARGE} classes="options-title" />
      <div className="mt-6">
        {isBlackList ? (
          <BlackList />
        ) : isHistory ? (
          <HistoryHeatmapOptions />
        ) : (
          <>
            <div className="options-preferences">
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
            </div>
            <GoalSettings />
            <div className="options-data border-t border-[#eadeda] pt-3 dark:border-[#3b2440]">
              <BlackListSwitcher
                interfaceLang={interfaceLang}
                toggleBlackList={toggleBlackList}
              />
              <DataTransfer interfaceLang={interfaceLang} />
              <ResetStatistics interfaceLang={interfaceLang} />
            </div>

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
