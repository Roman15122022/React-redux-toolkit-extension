import React from 'react'
import { Tooltip } from '@mui/material'

import { cn } from '../../utils'
import { TypeButton, TypeTittle } from '../../types'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { TextStatDomainProps } from './types'

export const TextStatDomain = ({
  allActualDomenDataText,
  isInBlackList,
  handleToggleBlackList,
  btnAddBl,
  removeFromBlack,
  btnRemove,
  addToBlack,
}: TextStatDomainProps): JSX.Element => {
  return (
    <div className="-mr-4 h-[250px] overflow-y-scroll scrollbar-thin scrollbar scrollbar-thumb-secondary-light dark:scrollbar-track-white dark:scrollbar-thumb-purple-dark dark:scrollbar-track-black">
      {allActualDomenDataText.map(({ label, value }, index) => {
        const isBlackListed = isInBlackList(label)

        return (
          <div
            className={cn(
              "group relative mt-1.5 flex justify-between items-center cursor-pointer after:content-[''] after:absolute after:left-1/2 after:w-0 after:bottom-[-4px] after:h-[2px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0",
              `${isBlackListed ? 'after:bg-red-500 dark:after:bg-red-500' : 'after:bg-secondary-light dark:after:bg-purple-light'}`,
            )}
          >
            <Title
              title={`${index + 1}. ${label}`}
              variant={TypeTittle.TINY}
              classes={`${isBlackListed ? 'text-red-600 dark:text-red-600' : ''}`}
            />
            <div className="flex items-center justify-between gap-2">
              <Tooltip title={isBlackListed ? removeFromBlack : addToBlack}>
                <span className="opacity-0 group-hover:opacity-100 transition duration-500">
                  <Button
                    variant={
                      isBlackListed ? TypeButton.ERROR_TWO : TypeButton.PRIMARY
                    }
                    onClick={() => handleToggleBlackList(label)}
                    classes="px-2 py-1 text-[8px]"
                  >
                    {isBlackListed ? btnRemove : btnAddBl}
                  </Button>
                </span>
              </Tooltip>
              <span
                className={cn(
                  'mr-1 font-bold text-secondary-light dark:text-purple-light',
                  `${isBlackListed ? 'text-red-600 dark:text-red-600' : ''}`,
                )}
              >
                {value}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
