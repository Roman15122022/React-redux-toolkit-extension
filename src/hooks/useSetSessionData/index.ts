import { useAppDispatch } from '../useAppDispatch'
import { sessionDataSlice } from '../../store/reducers/sessionDataReducer/sessionDataSlice'
import { SessionsDomainInfo } from '../../types'

export const useSetSessionData = () => {
  const dispatch = useAppDispatch()
  const { setSessionsData } = sessionDataSlice.actions

  async function getSessionData() {
    return new Promise(resolve => {
      chrome.storage.local.get('sessionData', result => {
        resolve(result.sessionData || [])
      })
    })
  }

  async function updateSessionData() {
    const sessionData = await getSessionData()

    dispatch(setSessionsData(sessionData as SessionsDomainInfo[]))
  }

  return {
    updateSessionData,
  }
}
