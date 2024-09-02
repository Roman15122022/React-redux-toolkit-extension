import React from 'react'

import Button from '../Button'
import { TypeButton } from '../../types/enums'

import { useTrackTime } from './useTrackTime'

const TrackTime = (): JSX.Element => {
  const { locale, time, stop, start, pause, isPaused, isActive } =
    useTrackTime()

  return (
    <div className="mt-6">
      <div>
        <p className="text-2xl theme-text text-center">{time}</p>
      </div>
      <div className="mt-8 flex justify-center items-center">
        <Button onClick={start}>{locale.start}</Button>
        <Button variant={TypeButton.ERROR} onClick={stop}>
          {locale.stop}
        </Button>
        <Button variant={TypeButton.SECONDARY} onClick={pause}>
          {locale.pause}
        </Button>
      </div>
    </div>
  )
}

export default TrackTime
