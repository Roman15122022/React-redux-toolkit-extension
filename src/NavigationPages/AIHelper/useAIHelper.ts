import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

export const useAIHelper = () => {
  const { interfaceLang } = useTranslate()

  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  return {
    dates,
    locale: interfaceLang.popup.aiHelper,
  }
}
