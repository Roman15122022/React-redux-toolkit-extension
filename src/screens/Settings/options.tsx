import React from 'react'
import './options.css'

import { TypeTittle } from '../../types'
import ThemeSwitcher from '../../features/ThemeSwitcher'
import ResetStatistics from '../../features/ResetStatistics'
import LocaleSwitcher from '../../features/LocaleSwitcher'
import { Clicker } from '../../features/Clicker'
import Title from '../../components/Title'

import { useOptions } from './useOptions'

const Options = (): JSX.Element => {
  const { language, isDark, handleSelectLocale, switchTheme, interfaceLang } =
    useOptions()

  return (
    <div>
      <Title
        title={`${interfaceLang.settings.title}👨‍🎓`}
        variant={TypeTittle.LARGE}
        classes="mt-4 ml-4"
      />
      <div className="ml-8 mt-6">
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
        <Clicker locale={interfaceLang} />
        <div className="border-t-2 mt-4 dark:border-white" />
        <ResetStatistics />
      </div>
      <p className="theme-text text-right mt-6 opacity-60">
        {interfaceLang.settings.createdBy}
        <a
          className="font-bold text-secondary-light dark:text-purple-light opacity-100 hover:text-purple-dark dark:hover:text-secondary-dark transition-colors duration-300"
          target="_blank"
          href="https://github.com/Roman15122022"
        >
          @Roman15122022
        </a>
      </p>
    </div>
  )
}

export default Options
