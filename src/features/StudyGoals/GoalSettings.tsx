import React, { useEffect, useState } from 'react'

import { cn } from '../../utils'
import { Locale } from '../../types'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import { useStudyGoals } from './useStudyGoals'
import { StudyGoal, StudyGoalKind } from './types'
import { getGoalLabel } from './GoalProgress'
import {
  isStudyGoalValid,
  isValidMinutes,
  renameStudyGoal,
} from './configuration'

const inputClasses =
  'theme-text w-full min-w-0 rounded-lg border border-[#d8cdca] bg-white px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goal-light disabled:opacity-60 dark:border-[#58435b] dark:bg-[#211721] dark:focus-visible:outline-goal-dark'
const buttonClasses =
  'theme-text rounded-lg border border-[#d8cdca] px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#fff7f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goal-light dark:border-[#58435b] dark:hover:bg-[#2d202e] dark:focus-visible:outline-goal-dark'
const primaryButtonClasses =
  'rounded-lg bg-goal-light px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goal-light dark:bg-purple-dark dark:focus-visible:outline-goal-dark'

type GoalEditorProps = {
  goal?: StudyGoal
  goals: StudyGoal[]
  locale: Locale['studyGoals']
  activityOptions: string[]
  onSave: (goal: StudyGoal) => void
  onCancel: () => void
}

function GoalEditor({
  goal,
  goals,
  locale,
  activityOptions,
  onSave,
  onCancel,
}: GoalEditorProps): JSX.Element {
  const kinds: StudyGoalKind[] = [
    'daily-total',
    'weekly-total',
    'weekly-activity',
  ]
  const availableKinds = kinds.filter(
    kind =>
      kind === 'weekly-activity' ||
      !goals.some(
        existing => existing.kind === kind && existing.id !== goal?.id,
      ),
  )
  const [kind, setKind] = useState<StudyGoalKind>(
    goal?.kind ?? availableKinds[0],
  )
  const [targetMinutes, setTargetMinutes] = useState(
    String(goal?.targetMinutes ?? 60),
  )
  const [activityName, setActivityName] = useState(goal?.activityNames[0] ?? '')
  const [error, setError] = useState(false)
  const prefix = `goal-${goal?.id ?? 'new'}`
  const maximum = kind === 'daily-total' ? 1440 : 10080

  function handleSave(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const proposedGoal: StudyGoal = {
      id: goal?.id ?? crypto.randomUUID(),
      kind,
      targetMinutes: Number(targetMinutes),
      enabled: goal?.enabled ?? true,
      activityNames: kind === 'weekly-activity' ? [activityName.trim()] : [],
    }
    const updatedGoal =
      goal && kind === 'weekly-activity'
        ? {
            ...renameStudyGoal(goal, activityName),
            targetMinutes: proposedGoal.targetMinutes,
          }
        : proposedGoal

    if (!isStudyGoalValid(updatedGoal, goals)) {
      setError(true)

      return
    }

    onSave(updatedGoal)
  }

  const kindLabels: Record<StudyGoalKind, string> = {
    'daily-total': locale.dailyTotal,
    'weekly-total': locale.weeklyTotal,
    'weekly-activity': locale.weeklyActivity,
  }

  return (
    <form
      onSubmit={handleSave}
      noValidate
      className="mt-5 space-y-4 border-t border-[#eadeda] pt-5 dark:border-[#3b2440]"
    >
      <div>
        <label
          htmlFor={`${prefix}-kind`}
          className="mb-1 block text-xs font-semibold"
        >
          {locale.goalType}
        </label>
        <select
          id={`${prefix}-kind`}
          value={kind}
          disabled={!!goal}
          onChange={event => {
            setKind(event.target.value as StudyGoalKind)
            setError(false)
          }}
          className={inputClasses}
        >
          {availableKinds.map(availableKind => (
            <option key={availableKind} value={availableKind}>
              {kindLabels[availableKind]}
            </option>
          ))}
        </select>
      </div>
      {kind === 'weekly-activity' && (
        <div>
          <label
            htmlFor={`${prefix}-activity`}
            className="mb-1 block text-xs font-semibold"
          >
            {locale.activity}
          </label>
          <input
            id={`${prefix}-activity`}
            list={`${prefix}-activities`}
            value={activityName}
            maxLength={200}
            onChange={event => {
              setActivityName(event.target.value)
              setError(false)
            }}
            className={inputClasses}
            aria-invalid={error}
            aria-describedby={`${prefix}-help`}
          />
          <datalist id={`${prefix}-activities`}>
            {activityOptions.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <p
            id={`${prefix}-help`}
            className="mt-2 max-w-[65ch] text-sm leading-relaxed text-[#625a59] dark:text-[#d2c7d2]"
          >
            {locale.renameHelp}
          </p>
        </div>
      )}
      <div>
        <label
          htmlFor={`${prefix}-minutes`}
          className="mb-1 block text-xs font-semibold"
        >
          {locale.targetMinutes}
        </label>
        <input
          id={`${prefix}-minutes`}
          type="number"
          inputMode="numeric"
          min={1}
          max={maximum}
          step={1}
          value={targetMinutes}
          onChange={event => {
            setTargetMinutes(event.target.value)
            setError(false)
          }}
          className={inputClasses}
          aria-invalid={error}
          aria-describedby={error ? `${prefix}-error` : undefined}
        />
      </div>
      {error && (
        <p
          id={`${prefix}-error`}
          role="alert"
          className="text-xs text-[#a12b26] dark:text-[#f2aaa5]"
        >
          {locale.invalidGoal.replace('{maximum}', String(maximum))}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" className={primaryButtonClasses}>
          {locale.save}
        </button>
        <button type="button" onClick={onCancel} className={buttonClasses}>
          {locale.cancel}
        </button>
      </div>
    </form>
  )
}

export default function GoalSettings(): JSX.Element {
  const { interfaceLang } = useTranslate()
  const locale = interfaceLang.studyGoals
  const { configuration } = useStudyGoals()
  const sessions = useAppSelector(state => state.TimerLogsReducer.dates)
  const dispatch = useAppDispatch()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [maximumMinutes, setMaximumMinutes] = useState(
    String(configuration.maxDailyMinutes),
  )
  const [limitError, setLimitError] = useState(false)
  const [status, setStatus] = useState<'saved' | 'limitsSaved' | null>(null)
  const editingGoal = configuration.goals.find(goal => goal.id === editingId)
  const activityOptions = [
    ...new Set(sessions.map(session => session.activityName)),
  ].sort()

  useEffect(() => {
    setMaximumMinutes(String(configuration.maxDailyMinutes))
  }, [configuration.maxDailyMinutes])

  function saveGoal(goal: StudyGoal): void {
    dispatch(settingSlice.actions.saveStudyGoal(goal))
    setEditingId(null)
    setStatus('saved')
  }

  function saveLimits(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const maxDailyMinutes = Number(maximumMinutes)

    if (!isValidMinutes(maxDailyMinutes, 1440)) {
      setLimitError(true)

      return
    }

    dispatch(
      settingSlice.actions.setStudyPlanningLimits({
        studyWeekdays: configuration.studyWeekdays,
        maxDailyMinutes,
      }),
    )
    setLimitError(false)
    setStatus('limitsSaved')
  }

  return (
    <section
      id="study-goals"
      className="theme-text my-8 scroll-mt-6 border-t border-[#eadeda] pt-7 dark:border-[#3b2440]"
    >
      <h2 className="text-xl font-bold tracking-tight">{locale.title}</h2>
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-[#625a59] dark:text-[#d2c7d2]">
        {locale.completedOnly}. {locale.noHistory}
      </p>
      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_0.9fr]">
        <div>
          <ul className="divide-y divide-gray-200 dark:divide-[#3b2440]">
            {configuration.goals.map(goal => (
              <li key={goal.id} className="pb-5 pt-4 first:pt-0">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 break-words font-semibold">
                    {getGoalLabel(goal, locale)}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-goal-light dark:text-goal-dark">
                    {goal.targetMinutes} {locale.minutes}
                  </span>
                </div>
                {goal.kind === 'weekly-activity' && (
                  <p className="mt-1 text-xs">{locale.weeklyActivity}</p>
                )}
                {!goal.enabled && (
                  <p className="mt-1 text-xs">{locale.disabled}</p>
                )}
                {goal.activityNames.length > 1 && (
                  <p className="mt-1 break-words text-xs">
                    {locale.aliases.replace(
                      '{names}',
                      goal.activityNames.slice(1).join(', '),
                    )}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(goal.id)
                      setStatus(null)
                    }}
                    className={buttonClasses}
                    aria-label={`${locale.edit}: ${getGoalLabel(goal, locale)}`}
                  >
                    {locale.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        settingSlice.actions.setStudyGoalEnabled({
                          goalId: goal.id,
                          enabled: !goal.enabled,
                        }),
                      )
                    }
                    className={buttonClasses}
                    aria-label={`${goal.enabled ? locale.disable : locale.enable}: ${getGoalLabel(goal, locale)}`}
                  >
                    {goal.enabled ? locale.disable : locale.enable}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(settingSlice.actions.deleteStudyGoal(goal.id))
                      setEditingId(null)
                    }}
                    className={cn(
                      buttonClasses,
                      'text-[#a12b26] dark:text-[#f2aaa5]',
                    )}
                    aria-label={`${locale.delete}: ${getGoalLabel(goal, locale)}`}
                  >
                    {locale.delete}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {!configuration.goals.length && (
            <p className="my-3 text-xs">{locale.restoreGoal}</p>
          )}
          {editingId === null ? (
            <button
              type="button"
              onClick={() => {
                setEditingId('new')
                setStatus(null)
              }}
              className={primaryButtonClasses}
            >
              {locale.addGoal}
            </button>
          ) : (
            <GoalEditor
              key={editingId}
              goal={editingGoal}
              goals={configuration.goals}
              locale={locale}
              activityOptions={activityOptions}
              onSave={saveGoal}
              onCancel={() => setEditingId(null)}
            />
          )}
        </div>
        <form
          onSubmit={saveLimits}
          noValidate
          className="border-t border-[#eadeda] pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0 dark:border-[#3b2440]"
        >
          <h3 className="text-base font-bold">{locale.planningLimits}</h3>
          <fieldset className="mt-5">
            <legend className="text-xs font-semibold">
              {locale.studyDays}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 0].map(day => (
                <label key={day} className="cursor-pointer">
                  <span className="sr-only">{locale.weekdays[day]}</span>
                  <input
                    type="checkbox"
                    checked={configuration.studyWeekdays.includes(day)}
                    onChange={event =>
                      dispatch(
                        settingSlice.actions.setStudyPlanningLimits({
                          maxDailyMinutes: configuration.maxDailyMinutes,
                          studyWeekdays: event.target.checked
                            ? [...configuration.studyWeekdays, day]
                            : configuration.studyWeekdays.filter(
                                existing => existing !== day,
                              ),
                        }),
                      )
                    }
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="flex h-10 min-w-[40px] items-center justify-center rounded-lg border border-[#d8cdca] px-2 text-xs font-semibold transition-colors peer-checked:border-goal-light peer-checked:bg-goal-light peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-goal-light dark:border-[#58435b] dark:peer-checked:border-purple-dark dark:peer-checked:bg-purple-dark dark:peer-focus-visible:outline-goal-dark"
                  >
                    {locale.weekdays[day]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label
            htmlFor="study-goal-daily-limit"
            className="mb-2 mt-6 block text-xs font-semibold"
          >
            {locale.maxDailyMinutes}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="study-goal-daily-limit"
              type="number"
              inputMode="numeric"
              min={1}
              max={1440}
              step={1}
              value={maximumMinutes}
              onChange={event => {
                setMaximumMinutes(event.target.value)
                setLimitError(false)
              }}
              aria-invalid={limitError}
              aria-describedby={
                limitError ? 'study-goal-limit-error' : undefined
              }
              className={cn(inputClasses, 'max-w-[160px]')}
            />
            <button type="submit" className={primaryButtonClasses}>
              {locale.save}
            </button>
          </div>
          {limitError && (
            <p
              id="study-goal-limit-error"
              role="alert"
              className="mt-1 text-xs text-[#a12b26] dark:text-[#f2aaa5]"
            >
              {locale.invalidLimit}
            </p>
          )}
        </form>
      </div>
      <p
        role="status"
        className="mt-4 text-sm font-medium text-goal-light dark:text-goal-dark"
      >
        {status ? locale[status] : ''}
      </p>
    </section>
  )
}
