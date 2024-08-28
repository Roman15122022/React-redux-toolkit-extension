import { useAppSelector } from '../../hooks/useAppSelector'

export const useOptions = () => {
  const { count } = useAppSelector(state => state.ClickerReducer)

  return { count }
}
