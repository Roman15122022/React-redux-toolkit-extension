import React, { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Play, Plus, Trash2 } from 'lucide-react'

import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { persistor, store } from '../../store'
import { useTranslate } from '../../hooks/useTranslate'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import { SessionTemplate } from './types'
import { TemplateEditor } from './TemplateEditor'
import {
  getRecentTemplates,
  getTemplateError,
  normalizeSessionTemplates,
} from './helpers'
import {
  templateButtonClasses,
  templatePrimaryClasses,
  templateSecondaryTextClasses,
} from './constants'

type SessionTemplatesProps = {
  onStart: (template: SessionTemplate) => Promise<boolean>
  isStarting: boolean
  startError: 'invalid' | 'startError' | null
}

export default function SessionTemplates({
  onStart,
  isStarting,
  startError,
}: SessionTemplatesProps): JSX.Element {
  const { interfaceLang } = useTranslate()
  const locale = interfaceLang.sessionTemplates
  const savedTemplates = useAppSelector(
    state => state.SettingReducer.sessionTemplates,
  )
  const sessions = useAppSelector(state => state.TimerLogsReducer.dates)
  const lastMood = useAppSelector(state => state.TimerLogsReducer.lastMood)
  const templates = normalizeSessionTemplates(savedTemplates)
  const dispatch = useAppDispatch()
  const [availableDomains, setAvailableDomains] = useState<string[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [isManaging, setIsManaging] = useState(false)
  const [editingTemplate, setEditingTemplate] =
    useState<SessionTemplate | null>(null)
  const [saveError, setSaveError] = useState(false)
  const recentTemplates = getRecentTemplates(sessions, availableDomains)
  const activityNames = [
    ...new Set(sessions.map(session => session.activityName).filter(Boolean)),
  ]

  useEffect(() => {
    let isMounted = true
    setLoadState('loading')
    chrome.storage.local
      .get('blackList')
      .then(storageData => {
        if (!isMounted) return

        setAvailableDomains(
          Array.isArray(storageData.blackList)
            ? storageData.blackList.filter(
                (domain: unknown): domain is string =>
                  typeof domain === 'string',
              )
            : [],
        )
        setLoadState('ready')
      })
      .catch(() => {
        if (isMounted) setLoadState('error')
      })
    function handleStorageChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ): void {
      if (area !== 'local' || !changes.blackList) return

      const domains = changes.blackList.newValue
      setAvailableDomains(
        Array.isArray(domains)
          ? domains.filter(
              (domain: unknown): domain is string => typeof domain === 'string',
            )
          : [],
      )
    }
    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      isMounted = false
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [loadAttempt])

  function handleCreate(source?: SessionTemplate): void {
    setEditingTemplate({
      id: crypto.randomUUID(),
      name: source?.name ?? '',
      activityName: source?.activityName ?? '',
      targetMinutes: source?.targetMinutes ?? 25,
      mood: source?.mood ?? lastMood ?? '3',
      focusMode: source?.focusMode ?? true,
      blockedDomains: source?.blockedDomains ?? availableDomains,
    })
  }

  async function flushTemplates(): Promise<boolean> {
    try {
      await persistor.flush()
      setSaveError(false)

      return true
    } catch {
      setSaveError(true)

      return false
    }
  }

  async function handleSave(template: SessionTemplate): Promise<boolean> {
    const currentTemplates = normalizeSessionTemplates(
      store.getState().SettingReducer.sessionTemplates,
    )

    if (getTemplateError(template, currentTemplates)) return false

    dispatch(settingSlice.actions.saveSessionTemplate(template))

    if (!(await flushTemplates())) return false

    setEditingTemplate(null)

    return true
  }

  const actionsDisabled = loadState !== 'ready' || isStarting

  return (
    <section
      aria-label={locale.title}
      className="mt-5 border-t border-[#eadeda] pt-4 dark:border-[#3b2440]"
    >
      <div className="flex flex-wrap items-center justify-between gap-1">
        <h2 className="text-sm font-bold">{locale.title}</h2>
        {!editingTemplate && (
          <div className="flex items-center gap-1">
            {templates.length > 0 && (
              <button
                type="button"
                onClick={() => setIsManaging(!isManaging)}
                className={templateButtonClasses}
                aria-expanded={isManaging}
                disabled={actionsDisabled}
              >
                {isManaging ? locale.done : locale.manage}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCreate(recentTemplates[0])}
              className={templateButtonClasses}
              disabled={actionsDisabled}
            >
              <Plus size={14} className="mr-1 inline" aria-hidden="true" />
              {locale.add}
            </button>
          </div>
        )}
      </div>
      {loadState === 'loading' && (
        <p role="status" className={`${templateSecondaryTextClasses} mt-2`}>
          {locale.loading}
        </p>
      )}
      {loadState === 'error' && (
        <div className="mt-2">
          <p
            role="alert"
            className="text-xs text-red-light dark:text-[#ffb4ab]"
          >
            {locale.loadError}
          </p>
          <button
            type="button"
            onClick={() => setLoadAttempt(loadAttempt + 1)}
            className={templateButtonClasses}
          >
            {locale.retry}
          </button>
        </div>
      )}
      {(startError || saveError) && (
        <p
          role="alert"
          className="mt-2 text-xs text-red-light dark:text-[#ffb4ab]"
        >
          {startError ? locale[startError] : locale.saveError}
        </p>
      )}
      {editingTemplate ? (
        <TemplateEditor
          key={editingTemplate.id}
          template={editingTemplate}
          templates={templates}
          availableDomains={availableDomains}
          activityNames={activityNames}
          locale={locale}
          onSave={handleSave}
          onCancel={() => setEditingTemplate(null)}
        />
      ) : (
        <>
          {templates.length === 0 && (
            <p className={`${templateSecondaryTextClasses} mt-2`}>
              {locale.empty}
            </p>
          )}
          <ul className="mt-2 divide-y divide-[#eadeda] dark:divide-[#3b2440]">
            {templates.map((template, templateIndex) => {
              const hasMissingDomains = template.blockedDomains.some(
                domain => !availableDomains.includes(domain),
              )

              return (
                <li key={template.id} className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold">
                        {template.name}
                      </p>
                      <p
                        className={`${templateSecondaryTextClasses} break-words`}
                      >
                        {template.activityName} · {template.targetMinutes}{' '}
                        {locale.minutes} ·{' '}
                        {template.focusMode ? locale.focusOn : locale.focusOff}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void onStart(template)}
                      disabled={actionsDisabled}
                      aria-label={`${locale.start}: ${template.name}`}
                      className={`${templatePrimaryClasses} shrink-0`}
                    >
                      <Play
                        size={12}
                        className="mr-1 inline"
                        aria-hidden="true"
                      />
                      {locale.start}
                    </button>
                  </div>
                  {hasMissingDomains && loadState === 'ready' && (
                    <p className={`${templateSecondaryTextClasses} mt-1`}>
                      {locale.removedSites}
                    </p>
                  )}
                  {isManaging && (
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingTemplate(template)}
                        aria-label={`${locale.edit}: ${template.name}`}
                        title={locale.edit}
                        className={templateButtonClasses}
                        disabled={actionsDisabled}
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(
                            settingSlice.actions.moveSessionTemplate({
                              id: template.id,
                              direction: -1,
                            }),
                          )
                          void flushTemplates()
                        }}
                        aria-label={`${locale.moveUp}: ${template.name}`}
                        title={locale.moveUp}
                        className={templateButtonClasses}
                        disabled={actionsDisabled || templateIndex === 0}
                      >
                        <ArrowUp size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(
                            settingSlice.actions.moveSessionTemplate({
                              id: template.id,
                              direction: 1,
                            }),
                          )
                          void flushTemplates()
                        }}
                        aria-label={`${locale.moveDown}: ${template.name}`}
                        title={locale.moveDown}
                        className={templateButtonClasses}
                        disabled={
                          actionsDisabled ||
                          templateIndex === templates.length - 1
                        }
                      >
                        <ArrowDown size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(
                            settingSlice.actions.deleteSessionTemplate(
                              template.id,
                            ),
                          )
                          void flushTemplates()
                        }}
                        aria-label={`${locale.delete}: ${template.name}`}
                        title={locale.delete}
                        className={templateButtonClasses}
                        disabled={actionsDisabled}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          {recentTemplates.length > 0 && (
            <details className="mt-3">
              <summary className={`${templateButtonClasses} cursor-pointer`}>
                {locale.recent}
              </summary>
              <ul className="mt-1 space-y-2">
                {recentTemplates.map(template => (
                  <li key={template.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="min-w-0 break-words text-xs">
                        {template.activityName} · {template.targetMinutes}{' '}
                        {locale.minutes}
                      </span>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => void onStart(template)}
                          disabled={actionsDisabled}
                          aria-label={`${locale.start}: ${template.activityName}`}
                          className={templatePrimaryClasses}
                        >
                          {locale.start}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCreate(template)}
                          disabled={actionsDisabled}
                          aria-label={`${locale.saveRecent}: ${template.activityName}`}
                          title={locale.saveRecent}
                          className={templateButtonClasses}
                        >
                          <Plus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </section>
  )
}
