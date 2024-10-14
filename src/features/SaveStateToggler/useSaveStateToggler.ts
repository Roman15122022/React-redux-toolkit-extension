import { ChangeEvent, useState } from 'react'

import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

export const useSaveStateToggler = (isDark: boolean) => {
  const { saveStateAfterClose } = useAppSelector(state => state.SettingReducer)
  const { toggleSaveState } = settingSlice.actions
  const dispatch = useAppDispatch()

  const [isChecked, setIsChecked] = useState(saveStateAfterClose ?? true)

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setIsChecked(event.target.checked)
    dispatch(toggleSaveState(event.target.checked))
  }

  return {
    colorCheckbox: isDark ? '#ab2bc0' : '#ff6347',
    isChecked,
    handleChange,
  }
}
