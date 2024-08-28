import { useAppSelector } from '../../hooks/useAppSelector'
import { clickerSlice } from '../../store/reducers/clickerReducer/ClickerSlice'
import { useAppDispatch } from '../../hooks/useAppDispatch'

export const useClicker = () => {
  const { increment } = clickerSlice.actions
  const dispatch = useAppDispatch()

  function handleClick(): void {
    dispatch(increment())
  }

  return { handleClick }
}
