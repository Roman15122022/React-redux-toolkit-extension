import React from 'react'

import { TypeButton } from '../../types'
import { useTrackTime } from '../../NavigationPages/TrackTimePage/useTrackTime'
import { getDailyGoalProgress } from '../../NavigationPages/TrackTimePage/timerState'
import { useTranslate } from '../../hooks/useTranslate'
import useTheme from '../../hooks/useTheme'
import { useAppSelector } from '../../hooks/useAppSelector'
import SessionSummary from '../../features/SessionSummary'
import { MoodLabelKeys } from '../../features/MoodSelect/constants'
import { MoodSelect } from '../../features/MoodSelect'
import InputNameActivity from '../../features/InputNameActivity'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'

import { useCurrentDomain } from './useCurrentDomain'

const SidePanel = (): JSX.Element => {
  useTheme()
  const { interfaceLang } = useTranslate()
  const panel = interfaceLang.sidePanel
  const {
    time,
    seconds,
    isActive,
    isPaused,
    isFinishing,
    lastNameActivity,
    lastMood,
    mood,
    handleChangeMood,
    handleOnChanges,
    currentLength,
    isError,
    note,
    handleChangeNote,
    handleStartSession,
    handleStartFromButton,
    handlePauseTimer,
    handleStopTimer,
    handleCancelTimer,
    completedSession,
    handleCloseSessionSummary,
  } = useTrackTime()
  const sessions = useAppSelector(state => state.TimerLogsReducer.dates)
  const goalMinutes = useAppSelector(
    state => state.SettingReducer.dailyGoalMinutes ?? 60,
  )
  const domain = useCurrentDomain()
  const progress = getDailyGoalProgress(
    sessions,
    isActive ? seconds : 0,
    goalMinutes,
    Date.now(),
  )

  if (completedSession) {
    return (
      <div className="min-h-screen bg-white p-2 dark:bg-black">
        <SessionSummary
          layout="page"
          session={completedSession}
          onClose={handleCloseSessionSummary}
        />
      </div>
    )
  }

  return (
    <main className="theme-text min-h-screen bg-white p-3 dark:bg-black">
      <section className="rounded-2xl border border-[#eadeda] bg-[#fffaf8] p-4 dark:border-[#3b2440] dark:bg-[#120d13]">
        <h1 className="text-lg font-extrabold">{panel.title}</h1>
        <p className="mt-1 text-xs text-[#665c57] dark:text-[#d2c7d2]">
          {isActive ? (isPaused ? panel.paused : panel.active) : panel.idle}
        </p>

        <p className="mt-5 text-center text-4xl font-bold tabular-nums sm:text-5xl">
          {time.formattedHours}:{time.formattedMinutes}:{time.formattedSeconds}
        </p>

        {isActive ? (
          <>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-[#665c57] dark:text-[#d2c7d2]">
                  {panel.activity}
                </dt>
                <dd className="break-words font-semibold">
                  {lastNameActivity}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#665c57] dark:text-[#d2c7d2]">
                  {panel.mood}
                </dt>
                <dd className="font-semibold">
                  {
                    interfaceLang.popup.statistics.moods[
                      MoodLabelKeys[
                        Number(lastMood) as keyof typeof MoodLabelKeys
                      ]
                    ]
                  }
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#665c57] dark:text-[#d2c7d2]">
                  {panel.domain}
                </dt>
                <dd className="break-all font-semibold">
                  {domain || panel.noDomain}
                </dd>
              </div>
            </dl>

            <label
              htmlFor="focus-session-note"
              className="mt-5 block text-xs font-semibold"
            >
              {panel.note}
            </label>
            <textarea
              id="focus-session-note"
              value={note}
              maxLength={500}
              onChange={event => handleChangeNote(event.target.value)}
              placeholder={panel.notePlaceholder}
              className="theme-text mt-2 min-h-[72px] w-full resize-y rounded-xl border border-[#d8c9c3] bg-white p-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary-light dark:border-[#513452] dark:bg-[#211721] dark:focus-visible:outline-purple-light"
            />

            <div className="side-panel-controls mt-4 grid gap-2">
              <Button
                onClick={isPaused ? handleStartFromButton : handlePauseTimer}
                disabled={isFinishing}
                classes="px-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-light dark:focus-visible:outline-purple-light"
              >
                {isPaused ? panel.resume : panel.pause}
              </Button>
              <Button
                onClick={handleStopTimer}
                disabled={isFinishing}
                variant={TypeButton.SECONDARY}
                classes="px-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-light dark:focus-visible:outline-purple-light"
              >
                {panel.finish}
              </Button>
              <Button
                onClick={handleCancelTimer}
                disabled={isFinishing}
                variant={TypeButton.ERROR_TWO}
                classes="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-light dark:focus-visible:outline-purple-light"
              >
                {panel.cancel}
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-5 space-y-4">
            <InputNameActivity
              nameLabel={interfaceLang.popup.track.label}
              currentLength={currentLength}
              onChanges={handleOnChanges}
              isError={isError}
            />
            <MoodSelect value={mood} onChange={handleChangeMood} />
            <Button
              onClick={handleStartSession}
              classes="w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-light dark:focus-visible:outline-purple-light"
            >
              {interfaceLang.popup.track.start}
            </Button>
          </div>
        )}

        <div className="mt-6 border-t border-[#eadeda] pt-4 dark:border-[#3b2440]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
            <span className="font-semibold">{panel.dailyGoal}</span>
            <span className="tabular-nums">
              {Math.floor(progress.seconds / 60)} / {goalMinutes}{' '}
              {panel.minutes}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={panel.dailyGoal}
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2"
          >
            <ProgressBar percents={progress.percent} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default SidePanel
