import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'

export const useStatisticsPage = () => {
  const { interfaceLang, language } = useTranslate()

  return { interfaceLang }
}
