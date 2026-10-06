import React, { useState } from 'react'

import { MoodSelect } from '../MoodSelect'
import { Locale } from '../../types'

import { SessionTemplate, TemplateError } from './types'
import { getTemplateError } from './helpers'
import {
  templateButtonClasses,
  templateInputClasses,
  templatePrimaryClasses,
  templateSecondaryTextClasses,
} from './constants'

type TemplateEditorProps = {
  template: SessionTemplate
  templates: SessionTemplate[]
  availableDomains: string[]
  activityNames: string[]
  locale: Locale['sessionTemplates']
  onSave: (template: SessionTemplate) => Promise<boolean>
  onCancel: () => void
}

export function TemplateEditor({
  template,
  templates,
  availableDomains,
  activityNames,
  locale,
  onSave,
  onCancel,
}: TemplateEditorProps): JSX.Element {
  const [name, setName] = useState(template.name)
  const [activityName, setActivityName] = useState(template.activityName)
  const [duration, setDuration] = useState(String(template.targetMinutes))
  const [mood, setMood] = useState(template.mood)
  const [focusMode, setFocusMode] = useState(template.focusMode)
  const [blockedDomains, setBlockedDomains] = useState(template.blockedDomains)
  const [error, setError] = useState<TemplateError | 'saveError' | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const missingDomains = blockedDomains.some(
    domain => !availableDomains.includes(domain),
  )

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()

    if (isSaving) return

    const proposedTemplate: SessionTemplate = {
      id: template.id,
      name: name.trim(),
      activityName: activityName.trim(),
      targetMinutes: Number(duration),
      mood,
      focusMode,
      blockedDomains: blockedDomains.filter(domain =>
        availableDomains.includes(domain),
      ),
    }
    const validationError = getTemplateError(proposedTemplate, templates)
    setError(validationError)

    if (validationError) return

    setIsSaving(true)

    if (!(await onSave(proposedTemplate))) {
      setError('saveError')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} noValidate className="mt-3 space-y-3">
      <fieldset disabled={isSaving} className="min-w-0 space-y-3">
        <label className="block text-xs font-semibold" htmlFor="template-name">
          {locale.name}
          <input
            id="template-name"
            value={name}
            maxLength={80}
            autoFocus
            onChange={event => {
              setName(event.target.value)
              setError(null)
            }}
            className={`${templateInputClasses} mt-1`}
          />
        </label>
        <label
          className="block text-xs font-semibold"
          htmlFor="template-activity"
        >
          {locale.activity}
          <input
            id="template-activity"
            value={activityName}
            maxLength={200}
            list="template-activities"
            onChange={event => {
              setActivityName(event.target.value)
              setError(null)
            }}
            className={`${templateInputClasses} mt-1`}
          />
          <datalist id="template-activities">
            {activityNames.map(activity => (
              <option key={activity} value={activity} />
            ))}
          </datalist>
        </label>
        <label
          className="block text-xs font-semibold"
          htmlFor="template-duration"
        >
          {locale.duration}
          <input
            id="template-duration"
            type="number"
            min={1}
            max={1440}
            step={1}
            value={duration}
            onChange={event => {
              setDuration(event.target.value)
              setError(null)
            }}
            className={`${templateInputClasses} mt-1`}
          />
        </label>
        <MoodSelect value={mood} onChange={setMood} />
        <label className="flex items-start gap-2 text-xs font-semibold">
          <input
            type="checkbox"
            checked={focusMode}
            onChange={event => setFocusMode(event.target.checked)}
            className="mt-0.5 accent-goal-light dark:accent-goal-dark"
          />
          {locale.focusMode}
        </label>
        <fieldset
          disabled={!focusMode}
          className="space-y-2 disabled:opacity-60"
        >
          <legend className="mb-2 text-xs font-semibold">
            {locale.blockedSites}
          </legend>
          {availableDomains.length === 0 && (
            <p className={templateSecondaryTextClasses}>{locale.noSites}</p>
          )}
          {availableDomains.map(domain => (
            <label
              key={domain}
              className="flex items-center gap-2 break-all text-xs"
            >
              <input
                type="checkbox"
                checked={blockedDomains.includes(domain)}
                onChange={event =>
                  setBlockedDomains(current =>
                    event.target.checked
                      ? [...current, domain]
                      : current.filter(item => item !== domain),
                  )
                }
                className="accent-goal-light dark:accent-goal-dark"
              />
              {domain}
            </label>
          ))}
        </fieldset>
        {missingDomains && (
          <p role="status" className={templateSecondaryTextClasses}>
            {locale.removedSites}
          </p>
        )}
        <p className={templateSecondaryTextClasses}>{locale.targetHint}</p>
        {error && (
          <p
            role="alert"
            className="text-xs text-red-light dark:text-[#ffb4ab]"
          >
            {locale[error]}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={templatePrimaryClasses}>
            {locale.save}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={templateButtonClasses}
          >
            {locale.cancel}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
