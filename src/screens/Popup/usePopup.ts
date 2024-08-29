import useTheme from '../../hooks/useTheme'

export const usePopup = () => {
  useTheme()

  const mock = 5

  return { mock }
}
