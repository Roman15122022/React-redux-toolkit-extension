import { ThemeVariants } from '../../types'
import { useAppSelector } from '../../hooks/useAppSelector'

export const useInputNameActivity = () => {
  const { theme } = useAppSelector(state => state.SettingReducer)

  const isDark = theme === ThemeVariants.DARK

  return {
    defaultColor: isDark ? '#631870' : '#ff6347',
    activeColor: isDark ? '#ab2bc0' : '#ff6347',
    textColor: isDark ? 'white' : 'black',
  }
}
