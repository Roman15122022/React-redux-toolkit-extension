import { useState } from 'react'

import { useManageBlackListDomain } from '../../hooks/useManageBlackListDomain'
import { useAppSelector } from '../../hooks/useAppSelector'

export const useBlackList = () => {
  const { blackList } = useAppSelector(state => state.SessionDataSlice)
  const { handleAddItemToBlackList, handleRemoveItemFromBlackList } =
    useManageBlackListDomain()

  const [newSite, setNewSite] = useState('')

  const handleAddSite = () => {
    if (newSite.trim()) {
      handleAddItemToBlackList(newSite.trim())
      setNewSite('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSite()
    }
  }

  return {
    blackList,
    handleRemoveItemFromBlackList,
    handleAddSite,
    handleKeyPress,
    newSite,
    setNewSite,
  }
}
