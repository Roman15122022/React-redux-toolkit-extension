import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'

export const usePopup = () => {
  useTheme()
  const { interfaceLang } = useTranslate()

  return { locale: interfaceLang.popup.main }
}
