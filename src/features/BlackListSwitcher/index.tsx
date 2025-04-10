import React from 'react'
import { Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import EastIcon from '@mui/icons-material/East'

import { TypeTittle } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import Title from '../../components/Title'

export const BlackListSwitcher = ({
  toggleBlackList,
}: {
  toggleBlackList: () => void
}): JSX.Element => {
  const { interfaceLang } = useTranslate()

  return (
    <div className="flex items-center justify-between my-4">
      <div className="flex items-center gap-5">
        <Title
          title={interfaceLang.settings.blackList.title}
          variant={TypeTittle.SMALL}
        />
        <Tooltip title={interfaceLang.settings.blackList.description}>
          <HelpOutlineIcon
            fontSize="medium"
            className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
          />
        </Tooltip>
      </div>

      <EastIcon
        onClick={toggleBlackList}
        className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
        sx={{ fontSize: 24 }}
      />
    </div>
  )
}
