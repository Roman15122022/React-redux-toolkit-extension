import { ChangeEvent, useState } from 'react'

import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

export const useNotificationSetting = () => {
  const dispatch = useAppDispatch()
  const { notification } = useAppSelector(state => state.SettingReducer)

  const { setNotification } = settingSlice.actions

  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(
    notification?.isNotificationActive ?? true,
  )
  const [period, setPeriod] = useState<number>(
    notification?.periodInMinutes ?? 60,
  )

  const handleSetIsOnNotification = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const isNotification = event.target.checked

    setIsNotificationOn(isNotification)
    dispatch(
      setNotification({
        isNotificationActive: isNotification,
        periodInMinutes: period,
      }),
    )
  }

  const handleChangePeriod = (period: number): void => {
    if (typeof period !== 'number') return

    setPeriod(period)
  }

  return { isNotificationOn, handleSetIsOnNotification, handleChangePeriod }
}
