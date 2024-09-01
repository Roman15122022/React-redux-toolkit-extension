import useTheme from '../../hooks/useTheme'
import { useTranslate } from '../../hooks/useTranslate'

export const usePopup = () => {
  useTheme()
  const { interfaceLang } = useTranslate()

  return { locale: interfaceLang.popup.main }
}
