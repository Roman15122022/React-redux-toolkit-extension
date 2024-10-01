import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { getUniqNamesActivity } from '../../helpers'

export const useAchievements = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  const { interfaceLang } = useTranslate()

  return {
    locale: interfaceLang.popup.achievements,
    activities: getUniqNamesActivity(dates),
  }
}
