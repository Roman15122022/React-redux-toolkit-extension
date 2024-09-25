import { useAppSelector } from '../../hooks/useAppSelector'

export const useInputNameActivity = () => {
  const { theme } = useAppSelector(state => state.SettingReducer)

  return { name: 1 }
}
