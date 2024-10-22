import { useTranslate } from '../../hooks/useTranslate'

export const useNotificationSetting = () => {
  const { interfaceLang } = useTranslate()

  return { interfaceLang }
}
