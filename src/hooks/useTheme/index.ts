import { useEffect } from 'react'
import { useAppSelector } from '../useAppSelector'
import { ThemeVariants } from '../../types'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { useAppDispatch } from '../useAppDispatch'

const useTheme = () => {
  const { theme } = useAppSelector(state => state.SettingReducer)
  const { toggleTheme } = settingSlice.actions
  const dispatch = useAppDispatch()

  function handleChangeTheme(theme: ThemeVariants) {
    dispatch(toggleTheme(theme))
  }

  useEffect(() => {
    if (theme === ThemeVariants.DARK) {
      document.documentElement.classList.add(ThemeVariants.DARK)
      document.documentElement.classList.remove(ThemeVariants.LIGHT)
    } else {
      document.documentElement.classList.add(ThemeVariants.LIGHT)
      document.documentElement.classList.remove(ThemeVariants.DARK)
    }
  }, [theme])

  return { theme, handleChangeTheme }
}

export default useTheme
