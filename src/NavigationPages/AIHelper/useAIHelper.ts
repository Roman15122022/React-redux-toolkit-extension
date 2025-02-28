import { useAppSelector } from '../../hooks/useAppSelector'

export const useAIHelper = () => {
  const { dates } = useAppSelector(state => state.TimerLogsReducer)

  return {
    dates,
  }
}
