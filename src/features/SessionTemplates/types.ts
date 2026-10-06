export type SessionConfiguration = {
  targetMinutes: number
  focusMode: boolean
  blockedDomains: string[]
}

export type SessionTemplate = SessionConfiguration & {
  id: string
  name: string
  activityName: string
  mood: string
}

export type TemplateError = 'invalid' | 'duplicate'
