import { useEffect, useState } from 'react'

export function useCurrentDomain(): string {
  const [domain, setDomain] = useState('')

  useEffect(() => {
    function updateDomain(): void {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        const activeUrl = tabs[0]?.url

        if (!activeUrl) {
          setDomain('')

          return
        }

        try {
          const url = new URL(activeUrl)
          setDomain(
            url.protocol === 'http:' || url.protocol === 'https:'
              ? url.hostname.replace(/^www\./, '')
              : '',
          )
        } catch {
          setDomain('')
        }
      })
    }

    updateDomain()
    chrome.tabs.onActivated.addListener(updateDomain)
    chrome.tabs.onUpdated.addListener(updateDomain)

    return () => {
      chrome.tabs.onActivated.removeListener(updateDomain)
      chrome.tabs.onUpdated.removeListener(updateDomain)
    }
  }, [])

  return domain
}
