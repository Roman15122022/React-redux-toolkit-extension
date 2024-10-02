import React from 'react'

import { cn } from '../../utils'

import { ProgressBarProps } from './types'

const ProgressBar = ({ percents, classes }: ProgressBarProps): JSX.Element => {
  return (
    <div className={cn(classes, 'h-2 w-full bg-[#a2a2a2] rounded-md')}>
      <div
        className="h-full bg-secondary-light dark:bg-purple-light rounded-md"
        style={{ width: `${percents}%` }}
      />
    </div>
  )
}

export default ProgressBar
