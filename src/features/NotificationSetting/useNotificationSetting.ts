import { ChangeEvent, useState } from 'react'

import { Locale } from '../../types'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { TIME_IN_SECONDS } from '../../constants'

export const useNotificationSetting = (
  isDark: boolean,
  interfaceLang: Locale,
) => {
  const dispatch = useAppDispatch()
  const { notification } = useAppSelector(state => state.SettingReducer)

  const { setNotification } = settingSlice.actions

  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(
    notification?.isNotificationActive ?? true,
  )
  const [startPeriod, setStartPeriod] = useState<number>(
    notification?.periodInMinutes ?? 60,
  )
  const [newPeriod, setNewPeriod] = useState<number>(startPeriod)
  const [isError, setIsError] = useState<boolean>(false)
  const [isChangingMode, setIsChangingMode] = useState<boolean>(false)
  const [errorText, setErrorText] = useState<string>('')

  const handleSetIsOnNotification = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const isNotification = event.target.checked

    setIsNotificationOn(isNotification)
    dispatch(
      setNotification({
        isNotificationActive: isNotification,
        periodInMinutes: newPeriod,
      }),
    )
  }

  const handleChangePeriod = (event: ChangeEvent<HTMLInputElement>): void => {
    const periodNumber = Number(event.target.value)

    if (Number.isNaN(periodNumber) || periodNumber > TIME_IN_SECONDS.DAY) {
      setIsError(true)
      setErrorText(interfaceLang.settings.notification.errorFirst)

      return
    }

    if (periodNumber === 0) {
      setNewPeriod(periodNumber)
      setIsError(true)
      setErrorText(interfaceLang.settings.notification.errorSecond)

      return
    }

    setNewPeriod(periodNumber)
    setIsError(false)
  }

  const handleCancelChangingMode = (): void => {
    setIsChangingMode(false)

    setNewPeriod(startPeriod)
    setIsError(false)
  }

  const handleOnChangingMode = (): void => {
    setIsChangingMode(true)
  }

  const handleSubmitNewPeriod = (): void => {
    if (isError) return

    setStartPeriod(newPeriod)

    dispatch(
      setNotification({
        isNotificationActive: isNotificationOn,
        periodInMinutes: newPeriod,
      }),
    )

    setIsChangingMode(false)
  }

  const defaultColor = isDark ? '#631870' : '#ff6347'
  const activeColor = isDark ? '#ab2bc0' : '#ff6347'
  const textColor = isDark ? 'white' : 'black'

  const styles = {
    width: 100,
    height: 39,
    padding: 0,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${isError ? 'red' : defaultColor} !important`, // Color outline
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: `${isError ? 'red' : activeColor} !important`, // On hover outline color
      color: 'red',
    },
    '& .MuiInputLabel-root': {
      color: `${isError ? 'red' : defaultColor}`,
      marginLeft: '3px',
      fontSize: '13px',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: `${isError ? 'red' : activeColor}`, //  Color label focus
      marginLeft: '3px',
    },
    '& .MuiInputBase-input': {
      color: textColor, // Color Text
      padding: '4.5px 4px 3.5px 5px !important',
      marginBottom: '3px',
    },
    '& .MuiOutlinedInput-root': {
      padding: '7px !important',
      borderRadius: '10px',
    },
    '& .MuiSvgIcon-root': {
      fill: activeColor,
    },
  }

  return {
    isNotificationOn,
    styles,
    handleSetIsOnNotification,
    handleChangePeriod,
    newPeriod,
    isError,
    isChangingMode,
    startPeriod,
    handleOnChangingMode,
    handleCancelChangingMode,
    handleSubmitNewPeriod,
    errorText,
  }
}
