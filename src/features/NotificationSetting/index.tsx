import React from 'react'
import TextField from '@mui/material/TextField'
import { Switch, Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import DoneIcon from '@mui/icons-material/Done'
import ClearIcon from '@mui/icons-material/Clear'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { useNotificationSetting } from './useNotificationSetting'
import { NotificationSettingProps } from './types'
import { LABEL } from './constants'

const NotificationSetting = ({
  interfaceLang,
  isDark,
}: NotificationSettingProps): JSX.Element => {
  const {
    isNotificationOn,
    handleSetIsOnNotification,
    handleChangePeriod,
    handleOnChangingMode,
    handleCancelChangingMode,
    handleSubmitNewPeriod,
    newPeriod,
    styles,
    isError,
    isChangingMode,
    startPeriod,
    errorText,
  } = useNotificationSetting(isDark, interfaceLang)

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
          {isChangingMode ? (
            <div className="flex items-center gap-3 py-4 relative">
              <div className="flex flex-col">
                <TextField
                  autoFocus={isChangingMode}
                  label={interfaceLang.settings.notification.labelInput}
                  error={isError}
                  sx={styles}
                  onChange={handleChangePeriod}
                  value={newPeriod}
                />
                {isError && errorText && (
                  <span className="font-extrabold text-[8px] text-red-600 absolute -bottom-1.5">
                    {errorText}
                  </span>
                )}
              </div>

              <Button
                classes="mt-[10px] py-1"
                onClick={handleCancelChangingMode}
              >
                <ClearIcon sx={{ fontSize: 13 }} />
              </Button>
              <Button
                disabled={isError}
                classes="mt-[10px] py-1"
                onClick={handleSubmitNewPeriod}
              >
                <DoneIcon sx={{ fontSize: 13 }} />
              </Button>
            </div>
          ) : (
            <Button onClick={handleOnChangingMode}>
              {startPeriod} {interfaceLang.settings.notification.minutes}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationSetting
