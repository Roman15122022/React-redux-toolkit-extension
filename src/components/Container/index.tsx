import React from 'react'

import { cn } from '../../utils'

import { ContainerProps } from './types'

const Container = ({ classes, children }: ContainerProps): JSX.Element => {
  return <div className={cn('mx-4 mt-8', classes)}>{children}</div>
}

export default Container
