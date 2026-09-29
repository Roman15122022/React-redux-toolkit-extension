type SidePanelApi = {
  open: (options: { windowId: number }) => Promise<void>
  close?: (options: { windowId: number }) => Promise<void>
}

export function getSidePanelApi(): SidePanelApi | undefined {
  const browserChrome = chrome as unknown as { sidePanel?: SidePanelApi }

  return browserChrome.sidePanel?.open ? browserChrome.sidePanel : undefined
}

export function openSidePanel(windowId: number): Promise<void> {
  const sidePanel = getSidePanelApi()

  if (!sidePanel) return Promise.reject(new Error('Side Panel unavailable'))

  return sidePanel.open({ windowId })
}

export function closeSidePanel(windowId: number): Promise<void> {
  const sidePanel = getSidePanelApi()

  if (!sidePanel?.close) {
    return Promise.reject(new Error('Side Panel closing unavailable'))
  }

  return sidePanel.close({ windowId })
}

export async function isSidePanelOpen(windowId: number): Promise<boolean> {
  const panelUrl = chrome.runtime.getURL('sidePanel.html')

  return chrome.extension
    .getViews({ windowId })
    .some(extensionWindow => extensionWindow.location.href === panelUrl)
}
