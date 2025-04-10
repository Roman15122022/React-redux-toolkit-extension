import React from 'react'
import { X } from 'lucide-react'

import Title from '../../components/Title'
import Button from '../../components/Button'

import { useBlackList } from './useBlackList'

export const BlackList = (): JSX.Element => {
  const {
    blackList,
    handleKeyPress,
    handleRemoveItemFromBlackList,
    handleAddSite,
    newSite,
    setNewSite,
  } = useBlackList()

  return (
    <div className="w-full rounded-lg shadow-md p-6">
      <div className="flex gap-2.5">
        <div className="flex-grow">
          <input
            type="text"
            value={newSite}
            onChange={e => setNewSite(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new site (e.g., example.com)"
            className="w-full px-3 py-2 bg-white dark:bg-black border dark:border-purple-light border-secondary-light rounded-lg theme-text focus:outline-none focus:ring-2 focus:ring-secondary-dark dark:focus:ring-purple-dark"
          />
        </div>
        <Button onClick={handleAddSite}>Add</Button>
      </div>

      <div className="mt-4 space-y-2">
        {blackList.length === 0 && (
          <Title classes="text-center" title="List is Empty" />
        )}

        {blackList.map(site => (
          <div
            key={site}
            className="relative flex justify-between items-center p-2 cursor-pointer after:content-[''] after:h-[2px] after:absolute after:left-1/2 after:w-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 after:bg-secondary-light dark:after:bg-purple-light"
          >
            <span className="text-sm theme-text">{site}</span>
            <button
              onClick={() => handleRemoveItemFromBlackList(site)}
              className="text-gray-500 hover:text-purple-400 transition-colors duration-200"
            >
              <X
                className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
                size={16}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
