import React from 'react'

import { cn } from '../../utils'

import { ProgressBarProps } from './types'

const ProgressBar = ({ percents, classes }: ProgressBarProps): JSX.Element => {
  return (
    <div
      className={cn(
        classes,
        'h-2 w-full bg-[#D3D3D3] dark:bg-[#3A3A3A] rounded-sm',
      )}
    >
      <div
        className="h-full bg-secondary-light dark:bg-purple-light rounded-sm"
        style={{ width: `${percents}%` }}
      />
    </div>
  )
}

export default ProgressBar
