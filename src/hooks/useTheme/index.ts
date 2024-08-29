import { useAppSelector } from '../useAppSelector'
import { useEffect } from 'react'
import { ThemeVariants } from '../../types/enums'

const useTheme = () => {
  const { theme } = useAppSelector(state => state.SettingReducer)

  useEffect(() => {
    if (theme === ThemeVariants.DARK) {
      document.documentElement.classList.add(ThemeVariants.DARK)
      document.documentElement.classList.remove(ThemeVariants.LIGHT)
    } else {
      document.documentElement.classList.add(ThemeVariants.LIGHT)
      document.documentElement.classList.remove(ThemeVariants.DARK)
    }
  }, [theme])
}

export default useTheme
