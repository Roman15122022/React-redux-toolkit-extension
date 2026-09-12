import { useAppDispatch } from '../useAppDispatch'
import { useAppSelector } from '../useAppSelector'
import { sessionDataSlice } from '../../store/reducers/sessionDataReducer/sessionDataSlice'

export const useManageDistractingDomains = () => {
  const dispatch = useAppDispatch()
  const distractingDomains = useAppSelector(
    state => state.SessionDataSlice.distractingDomains || [],
  )
  const { setDistractingDomains } = sessionDataSlice.actions

  function getActualDistractingDomains(): Promise<string[]> {
    return new Promise(resolve => {
      chrome.storage.local.get('distractingDomains', result => {
        resolve(result.distractingDomains || [])
      })
    })
  }

  function saveDistractingDomains(domains: string[]): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set({ distractingDomains: domains }, () => resolve())
    })
  }

  async function handleSetDistractingDomains(): Promise<void> {
    dispatch(setDistractingDomains(await getActualDistractingDomains()))
  }

  async function handleToggleDistractingDomain(domain: string): Promise<void> {
    const normalizedDomain = domain.replace(/^www\./, '').toLowerCase()
    const updatedDomains = distractingDomains.includes(normalizedDomain)
      ? distractingDomains.filter(item => item !== normalizedDomain)
      : [...distractingDomains, normalizedDomain]

    dispatch(setDistractingDomains(updatedDomains))
    await saveDistractingDomains(updatedDomains)
  }

  return {
    distractingDomains,
    handleSetDistractingDomains,
    handleToggleDistractingDomain,
  }
}
