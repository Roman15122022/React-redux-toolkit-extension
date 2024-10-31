import React from 'react'

import { cn } from '../../utils'
import { TypeTittle } from '../../types'

import { TitleProps } from './types'
import { variantTitle } from './constants'

const Title = function ({ title, variant, classes }: TitleProps): JSX.Element {
  return (
    <h1 className={cn(variantTitle[variant || TypeTittle.DEFAULT], classes)}>
      {title}
    </h1>
  )
}

export default Title
