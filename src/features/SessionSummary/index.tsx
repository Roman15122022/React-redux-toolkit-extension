import React from 'react'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'

import { TypeButton, TimePeriod } from '../../types'
import { fullFormatTime } from '../../NavigationPages/TrackTimePage/helpers'
import { useTranslate } from '../../hooks/useTranslate'
import Container from '../../components/Container'
import Button from '../../components/Button'

import { useSessionSummary } from './useSessionSummary'

type SessionSummaryProps = {
  session: TimePeriod
  onClose: () => void
}

const SessionSummary = ({
  session,
  onClose,
}: SessionSummaryProps): JSX.Element => {
  const { interfaceLang } = useTranslate()
  const {
    blackList,
    distractingDomains,
    handleBlockDomain,
    handleSaveAndClose,
    handleToggleDomain,
    locale,
    moodLabel,
    note,
    setNote,
    summary,
  } = useSessionSummary(session, onClose)

  const formatSeconds = (seconds: number): string =>
    fullFormatTime(seconds, interfaceLang, false) || `0${locale.seconds}`

  const getComparisonValue = (value: number | null): string => {
    if (value === null) return locale.unavailable

    if (value === 0) return locale.sameResult

    return `${value > 0 ? '+' : ''}${value}`
  }

  const recommendation = locale.recommendations[summary.recommendation.type]
    .replace('{minutes}', String(summary.recommendation.minutes))
    .replace('{domain}', summary.recommendation.domain || '')

  return (
    <Container classes="mx-0 mt-0 pb-3">
      <div className="max-h-[520px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-secondary-light dark:scrollbar-thumb-purple-dark">
        <div className="flex items-start gap-3">
          <CheckCircleRoundedIcon
            className="text-secondary-light dark:text-purple-light"
            sx={{ fontSize: 34 }}
          />
          <div className="min-w-0">
            <h1 className="theme-text text-xl font-extrabold leading-tight">
              {locale.title}
            </h1>
            <p className="mt-1 truncate text-xs text-[#665c57] dark:text-[#d2c7d2]">
              {session.activityName}
            </p>
          </div>
        </div>

        <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-[#211721]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#665c57] dark:text-[#d2c7d2]">
                {locale.focusScore}
              </p>
              <p className="mt-1 text-4xl font-black tabular-nums text-secondary-light dark:text-purple-light">
                {summary.focusScore}
                <span className="ml-1 text-base text-[#716762] dark:text-[#b9adb9]">
                  /100
                </span>
              </p>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-extrabold text-secondary-light dark:bg-[#35143d] dark:text-purple-light">
              {locale.focusLevels[summary.focusLevel]}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#665c57] dark:text-[#d2c7d2]">
            {locale.explanation}
          </p>
          {!!summary.factors.length && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {summary.factors.map(factor => (
                <span
                  key={`${factor.key}-${factor.type}`}
                  className={
                    factor.type === 'positive'
                      ? 'rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                  }
                >
                  {factor.type === 'positive' ? '+' : '−'}{' '}
                  {locale.factors[factor.key]}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="mt-3 grid grid-cols-2 gap-2">
          {[
            [locale.duration, formatSeconds(session.totalTimeForSession)],
            [
              locale.productiveTime,
              formatSeconds(summary.productiveTimeSeconds),
            ],
            [
              locale.distractingTime,
              summary.domainTimeAvailable
                ? formatSeconds(summary.distractingTimeSeconds)
                : locale.unavailable,
            ],
            [locale.pauses, String(session.pauseCount || 0)],
            [locale.mood, moodLabel],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-[#eadeda] bg-white px-3 py-2 dark:border-[#3b2a3d] dark:bg-[#211721]"
            >
              <p className="text-[10px] font-semibold text-[#716762] dark:text-[#b9adb9]">
                {label}
              </p>
              <p className="theme-text mt-1 text-sm font-extrabold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-3 rounded-xl border border-[#eadeda] bg-white p-3 dark:border-[#3b2a3d] dark:bg-[#211721]">
          <h2 className="theme-text text-xs font-extrabold">
            {locale.comparison}
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-[#716762] dark:text-[#b9adb9]">
                {locale.recentAverage}
              </p>
              <p className="theme-text mt-1 font-extrabold tabular-nums">
                {getComparisonValue(summary.comparison.recentAverageDelta)}
              </p>
            </div>
            <div>
              <p className="text-[#716762] dark:text-[#b9adb9]">
                {locale.previousSession}
              </p>
              <p className="theme-text mt-1 font-extrabold tabular-nums">
                {getComparisonValue(summary.comparison.previousSessionDelta)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-xl border border-[#eadeda] bg-white p-3 dark:border-[#3b2a3d] dark:bg-[#211721]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="theme-text text-xs font-extrabold">
              {locale.visitedDomains}
            </h2>
            <span className="text-[10px] text-[#716762] dark:text-[#b9adb9]">
              {summary.domains.length}
            </span>
          </div>

          {!summary.domainTimeAvailable && (
            <p className="mt-2 text-xs text-[#716762] dark:text-[#b9adb9]">
              {locale.noDomainData}
            </p>
          )}

          {summary.domains.map(domain => {
            const isDistracting = distractingDomains.includes(domain.domain)
            const isBlocked = blackList.includes(domain.domain)

            return (
              <div
                key={domain.domain}
                className="mt-2 border-t border-[#f0e6e2] pt-2 first:border-0 dark:border-[#3b2a3d]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="theme-text truncate text-xs font-bold">
                      {domain.domain}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#716762] dark:text-[#b9adb9]">
                      {formatSeconds(domain.durationSeconds)} ·{' '}
                      {isDistracting ? locale.distracting : locale.neutral}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleDomain(domain.domain)}
                    className="flex items-center gap-1 rounded-lg border border-secondary-light px-2 py-1 text-[10px] font-bold text-secondary-light outline-none transition-colors hover:bg-orange-50 focus-visible:ring-2 focus-visible:ring-secondary-light dark:border-purple-light dark:text-purple-light dark:hover:bg-purple-dark/20 dark:focus-visible:ring-purple-light"
                  >
                    <FlagRoundedIcon sx={{ fontSize: 13 }} />
                    {isDistracting
                      ? locale.removeDistracting
                      : locale.markDistracting}
                  </button>
                  <button
                    type="button"
                    disabled={isBlocked}
                    onClick={() => handleBlockDomain(domain.domain)}
                    className="flex items-center gap-1 rounded-lg border border-red-light px-2 py-1 text-[10px] font-bold text-red-light outline-none transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-red-light dark:border-red-dark dark:text-red-dark dark:hover:bg-red-900/30"
                  >
                    <BlockRoundedIcon sx={{ fontSize: 13 }} />
                    {isBlocked ? locale.blocked : locale.addToBlacklist}
                  </button>
                </div>
              </div>
            )
          })}
        </section>

        <section className="mt-3 rounded-xl bg-orange-50 p-3 dark:bg-purple-dark/20">
          <div className="flex items-center gap-2">
            <AutoAwesomeRoundedIcon
              className="text-secondary-light dark:text-purple-light"
              sx={{ fontSize: 18 }}
            />
            <h2 className="theme-text text-xs font-extrabold">
              {locale.nextStep}
            </h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#514945] dark:text-[#e3dae3]">
            {recommendation}
          </p>
        </section>

        <section className="mt-3">
          <label
            htmlFor={`session-note-${session.startDate}`}
            className="theme-text text-xs font-extrabold"
          >
            {locale.note}
            <span className="ml-1 font-normal text-[#716762] dark:text-[#b9adb9]">
              {locale.optional}
            </span>
          </label>
          <p className="mt-1 text-[10px] text-[#716762] dark:text-[#b9adb9]">
            {locale.notePrompt}
          </p>
          <textarea
            id={`session-note-${session.startDate}`}
            value={note}
            maxLength={500}
            onChange={event => setNote(event.target.value)}
            placeholder={locale.notePlaceholder}
            className="theme-text mt-2 min-h-[72px] w-full resize-none rounded-xl border border-[#d8c9c3] bg-white p-3 text-xs outline-none focus:border-secondary-light focus:ring-2 focus:ring-secondary-light/20 dark:border-[#513452] dark:bg-[#211721] dark:focus:border-purple-light dark:focus:ring-purple-light/20"
          />
        </section>

        <Button
          variant={TypeButton.PRIMARY}
          onClick={handleSaveAndClose}
          classes="mt-3 w-full rounded-xl"
        >
          {locale.saveAndClose}
        </Button>
      </div>
    </Container>
  )
}

export default SessionSummary
