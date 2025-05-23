import { ThemeVariants } from '../../types'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

export const useSelectStatPeriod = () => {
  const { interfaceLang } = useTranslate()

  const { theme } = useAppSelector(state => state.SettingReducer)
  const isDark = theme === ThemeVariants.DARK

  const defaultColor = isDark ? '#631870' : '#ff6347'
  const activeColor = isDark ? '#ab2bc0' : '#ff6347'
  const textColor = isDark ? 'white' : 'black'

  const styles = {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${defaultColor} !important`,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: `${activeColor} !important`,
    },
    '& .MuiInputLabel-root': {
      color: `${defaultColor}`,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: `${activeColor}`,
    },
    '& .MuiInputBase-input': {
      color: textColor,
    },
    '& .MuiSvgIcon-root': {
      fill: activeColor,
    },
  }

  return { styles, locale: interfaceLang.popup.statistics.choosePeriod }
}
