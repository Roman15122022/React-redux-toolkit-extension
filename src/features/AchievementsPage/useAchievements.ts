import { useTranslate } from '../../hooks/useTranslate'

export const useAchievements = () => {
  const { interfaceLang, language } = useTranslate()

  return { interfaceLang }
}
