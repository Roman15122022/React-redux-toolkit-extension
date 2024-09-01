import { clickerSlice } from '../../store/reducers/clickerReducer/ClickerSlice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

export const useClicker = () => {
  const { count } = useAppSelector(state => state.ClickerReducer)
  const { increment } = clickerSlice.actions
  const dispatch = useAppDispatch()

  function handleClick(): void {
    dispatch(increment())
  }

  return { handleClick, count }
}
