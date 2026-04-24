import React from 'react'

import { TypeTittle } from '../../types'
import { MoodDictionary } from '../../constants/specConstants'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useAIHelper } from './useAIHelper'

type MetricType = 'positive' | 'negative'

type MetricLevel = 'low' | 'medium' | 'high'

function getMetricLevel(value: number): MetricLevel {
  if (value < 34) return 'low'

  if (value < 67) return 'medium'

  return 'high'
}

function getMetricClasses(value: number, type: MetricType): string {
  const level = getMetricLevel(value)

  if (
    (type === 'negative' && level === 'high') ||
    (type === 'positive' && level === 'low')
  ) {
    return 'text-red-600'
  }

  if (
    (type === 'negative' && level === 'low') ||
    (type === 'positive' && level === 'high')
  ) {
    return 'text-secondary-light dark:text-purple-light'
  }

  return 'theme-text'
}

export const AIHelper = (): JSX.Element => {
  const { aiResult, dates, locale, studyTime } = useAIHelper()
  const { prediction } = aiResult
  const moodIcon =
    MoodDictionary[prediction.mood as keyof typeof MoodDictionary] ||
    MoodDictionary[3]
  const statusText = locale.statuses[aiResult.status]
  const lossText =
    typeof aiResult.loss === 'number' ? aiResult.loss.toFixed(4) : null
  const metricRows = [
    {
      title: locale.badMoodRisk,
      description: locale.metricDescriptions.badMoodRisk,
      value: prediction.badMoodRiskPercent,
      type: 'negative' as MetricType,
    },
    {
      title: locale.fatigueScore,
      description: locale.metricDescriptions.fatigueScore,
      value: prediction.fatigueScorePercent,
      type: 'negative' as MetricType,
    },
    {
      title: locale.consistencyScore,
      description: locale.metricDescriptions.consistencyScore,
      value: prediction.consistencyScorePercent,
      type: 'positive' as MetricType,
    },
  ]
  const riskLevel = getMetricLevel(prediction.badMoodRiskPercent)
  const fatigueLevel = getMetricLevel(prediction.fatigueScorePercent)
  const consistencyLevel = getMetricLevel(prediction.consistencyScorePercent)

  if (!dates.length) {
    return (
      <Container>
        <Title
          variant={TypeTittle.SMALL}
          classes="mt-5 text-center"
          title={locale.noDates}
        />
        <p className="theme-text text-center mt-3 text-[14px]">
          {locale.notEnoughData.replace(
            '{count}',
            `${aiResult.neededSessions}`,
          )}
        </p>
      </Container>
    )
  }

  return (
    <Container>
      <div className="font-semibold italic theme-text">
        {locale.description}
      </div>
      <div className="mt-4 flex items-center justify-between border-b-2 pb-3 dark:border-white">
        <Title
          classes="text-[16px]"
          variant={TypeTittle.SMALL}
          title={locale.status}
        />
        <span className="font-semibold text-secondary-light dark:text-purple-light">
          {statusText}
        </span>
      </div>

      {aiResult.neededSessions > 0 && (
        <p className="mt-3 text-[13px] font-semibold text-red-600">
          {locale.notEnoughData.replace(
            '{count}',
            `${aiResult.neededSessions}`,
          )}
        </p>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between mt-3">
          <Title
            classes="text-[16px]"
            variant={TypeTittle.SMALL}
            title={locale.predictedMood}
          />
          <div>{moodIcon}</div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <Title
            classes="text-[16px]"
            variant={TypeTittle.SMALL}
            title={locale.predictedStudyTime}
          />
          <span className="font-semibold text-secondary-light dark:text-purple-light">
            {studyTime}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <Title
            classes="text-[16px]"
            variant={TypeTittle.SMALL}
            title={locale.predictedSessionCount}
          />
          <span className="font-semibold text-secondary-light dark:text-purple-light">
            {prediction.sessionCount}
          </span>
        </div>
        {metricRows.map(({ title, description, value, type }) => {
          const level = getMetricLevel(value)

          return (
            <div key={title} className="mt-4">
              <div className="flex items-center justify-between">
                <Title
                  classes="text-[16px]"
                  variant={TypeTittle.SMALL}
                  title={title}
                />
                <span
                  className={`font-semibold ${getMetricClasses(value, type)}`}
                >
                  {locale.metricLevels[level]} · {value}%
                </span>
              </div>
              <p className="theme-text mt-1 text-[12px] opacity-70">
                {description}
              </p>
            </div>
          )
        })}
      </div>
      <div className="mt-6">
        <Title
          classes="text-[14px]"
          variant={TypeTittle.SMALL}
          title={`${locale.recommendation}: ${
            locale.recommendations[prediction.recommendation]
          }`}
        />
        <p className="theme-text mt-3 text-[13px] opacity-80">
          {locale.metricSummary
            .replace('{riskLevel}', locale.metricLevels[riskLevel])
            .replace('{fatigueLevel}', locale.metricLevels[fatigueLevel])
            .replace(
              '{consistencyLevel}',
              locale.metricLevels[consistencyLevel],
            )}
        </p>
      </div>
      {aiResult.trainedSessionCount && (
        <p className="theme-text mt-4 text-[12px] opacity-70">
          {locale.trainedOn}: {aiResult.trainedSessionCount} {locale.sessions}
          {lossText ? ` · ${locale.loss}: ${lossText}` : ''}
        </p>
      )}
      {aiResult.error && (
        <p className="mt-3 text-[12px] font-semibold text-red-600">
          {locale.error}: {aiResult.error}
        </p>
      )}
    </Container>
  )
}
