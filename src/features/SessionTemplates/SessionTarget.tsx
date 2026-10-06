import React from 'react'

import { useTranslate } from '../../hooks/useTranslate'

import { SessionConfiguration } from './types'
import { templateSecondaryTextClasses } from './constants'

type SessionTargetProps = {
  configuration?: SessionConfiguration | null
  seconds: number
}

export function SessionTarget({
  configuration,
  seconds,
}: SessionTargetProps): JSX.Element | null {
  const { interfaceLang } = useTranslate()

  if (!configuration) return null

  const locale = interfaceLang.sessionTemplates
  const isTargetReached = seconds >= configuration.targetMinutes * 60

  return (
    <div className={`${templateSecondaryTextClasses} mt-3 text-center`}>
      <p>
        {locale.target}: {configuration.targetMinutes} {locale.minutes} ·{' '}
        {configuration.focusMode ? locale.focusOn : locale.focusOff}
      </p>
      {isTargetReached && (
        <p role="status" className="mt-1">
          {locale.reached}
        </p>
      )}
    </div>
  )
}
