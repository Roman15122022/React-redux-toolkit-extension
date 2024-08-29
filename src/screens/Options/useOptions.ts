import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { SelectChangeEvent } from '@mui/material'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'

export const useOptions = () => {
  const { count } = useAppSelector(state => state.ClickerReducer)
  const { language, isDark } = useAppSelector(state => state.SettingReducer)

  const { setLocale, toggleTheme } = settingSlice.actions
  const dispatch = useAppDispatch()

  function handleSelectLocale(event: SelectChangeEvent): void {
    dispatch(setLocale(event.target.value))
  }

  function switchTheme(): void {
    dispatch(toggleTheme())
  }

  return { count, handleSelectLocale, language, isDark, switchTheme }
}
