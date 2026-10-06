import { TimePeriod } from '../../types'

import { SessionConfiguration, SessionTemplate, TemplateError } from './types'

export function getTemplateError(
  candidate: unknown,
  templates: SessionTemplate[],
): TemplateError | null {
  if (typeof candidate !== 'object' || candidate === null) return 'invalid'

  const template = candidate as SessionTemplate

  if (
    typeof template.id !== 'string' ||
    !template.id.trim() ||
    typeof template.name !== 'string' ||
    !template.name.trim() ||
    template.name.length > 80 ||
    typeof template.activityName !== 'string' ||
    !template.activityName.trim() ||
    template.activityName.length > 200 ||
    !Number.isInteger(template.targetMinutes) ||
    template.targetMinutes < 1 ||
    template.targetMinutes > 1440 ||
    !['1', '2', '3', '4', '5'].includes(template.mood) ||
    typeof template.focusMode !== 'boolean' ||
    !Array.isArray(template.blockedDomains) ||
    !template.blockedDomains.every(
      domain => typeof domain === 'string' && !!domain.trim(),
    )
  ) {
    return 'invalid'
  }

  const normalizedName = template.name.trim().toLowerCase()

  return templates.some(
    existing =>
      existing.id !== template.id &&
      existing.name.trim().toLowerCase() === normalizedName,
  )
    ? 'duplicate'
    : null
}

export function normalizeSessionTemplates(value: unknown): SessionTemplate[] {
  if (!Array.isArray(value)) return []

  const templates: SessionTemplate[] = []
  value.forEach(candidate => {
    if (getTemplateError(candidate, templates)) return

    const template = candidate as SessionTemplate

    if (templates.some(existing => existing.id === template.id)) return

    templates.push({
      ...template,
      name: template.name.trim(),
      activityName: template.activityName.trim(),
      blockedDomains: [...new Set(template.blockedDomains)],
    })
  })

  return templates
}

export function getSessionConfiguration(
  template: SessionTemplate,
  availableDomains: string[],
): SessionConfiguration {
  return {
    targetMinutes: template.targetMinutes,
    focusMode: template.focusMode,
    blockedDomains: template.blockedDomains.filter(domain =>
      availableDomains.includes(domain),
    ),
  }
}

export function getSessionBlockedDomains(
  timerState: { blockedDomains?: unknown },
  globalDomains: string[],
): string[] {
  if (!Array.isArray(timerState.blockedDomains)) return globalDomains

  return globalDomains.filter(domain =>
    (timerState.blockedDomains as unknown[]).includes(domain),
  )
}

export function templateFromSession(
  session: TimePeriod,
  availableDomains: string[] = [],
): SessionTemplate {
  const durationMinutes = Math.ceil(session.totalTimeForSession / 60)
  const configuration = session.sessionConfiguration
  const candidate: SessionTemplate = {
    id: `recent-${session.startDate}`,
    name: session.activityName.slice(0, 80),
    activityName: session.activityName,
    mood: session.mood,
    targetMinutes: configuration?.targetMinutes ?? durationMinutes,
    focusMode: configuration?.focusMode ?? true,
    blockedDomains: configuration?.blockedDomains ?? availableDomains,
  }

  if (!Number.isInteger(candidate.targetMinutes)) candidate.targetMinutes = 25

  candidate.targetMinutes = Math.max(1, Math.min(1440, candidate.targetMinutes))

  if (!['1', '2', '3', '4', '5'].includes(candidate.mood)) candidate.mood = '3'

  return candidate
}

export function getRecentTemplates(
  sessions: TimePeriod[],
  availableDomains: string[] = [],
): SessionTemplate[] {
  const recentTemplates: SessionTemplate[] = []
  const seen = new Set<string>()
  const sortedSessions = [...sessions].sort(
    (first, second) => second.startDate - first.startDate,
  )
  sortedSessions.forEach(session => {
    const template = templateFromSession(session, availableDomains)

    if (getTemplateError(template, []) || recentTemplates.length >= 3) return

    const signature = JSON.stringify([
      template.activityName,
      template.targetMinutes,
      template.mood,
      template.focusMode,
      [...template.blockedDomains].sort(),
    ])

    if (seen.has(signature)) return

    seen.add(signature)
    recentTemplates.push(template)
  })

  return recentTemplates
}
