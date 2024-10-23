import React from 'react'
import TextField from '@mui/material/TextField'
import { Switch, Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'

import { useNotificationSetting } from './useNotificationSetting'
import { NotificationSettingProps } from './types'
import { LABEL } from './constants'

const NotificationSetting = ({
  interfaceLang,
  isDark,
}: NotificationSettingProps): JSX.Element => {
  const { isNotificationOn, handleSetIsOnNotification } =
    useNotificationSetting()

  return (
    <div className="my-4">
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-5">
          <Title
            title={interfaceLang.settings.notification.turnOffOn}
            variant={TypeTittle.SMALL}
          />
          <Tooltip title={interfaceLang.settings.notification.notificationDesc}>
            <HelpOutlineIcon
              fontSize="medium"
              className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
            />
          </Tooltip>
        </div>
        <Switch
          {...LABEL}
          checked={isNotificationOn}
          onChange={handleSetIsOnNotification}
          defaultChecked
          color={isDark ? 'secondary' : 'warning'}
        />
      </div>
      {isNotificationOn && (
        <div className="flex items-center justify-between my-4">
          <Title
            title={interfaceLang.settings.notification.period}
            variant={TypeTittle.SMALL}
          />
          <div className="flex items-center gap-3">
            <TextField label="Number" type="number" />
            <Title
              title={interfaceLang.settings.notification.minutes}
              variant={TypeTittle.SMALL}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationSetting
