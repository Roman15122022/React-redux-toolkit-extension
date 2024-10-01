import { ThemeVariants } from '../../types'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getUniqNamesActivity } from '../../helpers'

export const useInputNameActivity = (isError: boolean) => {
  const { theme } = useAppSelector(state => state.SettingReducer)
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const isDark = theme === ThemeVariants.DARK

  const defaultColor = isDark ? '#631870' : '#ff6347'
  const activeColor = isDark ? '#ab2bc0' : '#ff6347'
  const textColor = isDark ? 'white' : 'black'

  const styles = {
    width: 160,
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
    styles,
    options: getUniqNamesActivity(dates),
  }
}
