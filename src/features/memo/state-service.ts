import {
  createFaviconDataUrl,
  createSearchFromMemoState,
  DEFAULT_FAVICON_ICON,
  normalizeFaviconIcon,
  normalizeMemoText,
  type MemoState,
} from '../../lib/memo'
import type { PageElements } from './elements'

export type StateService = ReturnType<typeof createStateService>

const createNormalizedMemoState = (memoState: MemoState): MemoState => ({
  memoText: memoState.memoText,
  faviconIcon: normalizeFaviconIcon(memoState.faviconIcon),
})

const readMemoText = (pageElements: PageElements): string => pageElements.memoInput.value

export const createStateService = (pageElements: PageElements) => {
  let updateSelectedIconButtons = (_selectedIcon: string): void => {}

  const readCurrentMemoState = (): MemoState => ({
    memoText: readMemoText(pageElements),
    faviconIcon: pageElements.appRoot.dataset.currentFaviconIcon ?? DEFAULT_FAVICON_ICON,
  })

  const storeCurrentFaviconIcon = (faviconIcon: string): void => {
    pageElements.appRoot.dataset.currentFaviconIcon = faviconIcon
  }

  const updateView = (memoState: MemoState): void => {
    const normalizedMemoState = createNormalizedMemoState(memoState)
    const currentMemoText = memoState.memoText
    const normalizedMemoText = normalizeMemoText(currentMemoText)

    document.title = normalizedMemoText
    pageElements.memoPreviewIcon.textContent = normalizeFaviconIcon(normalizedMemoState.faviconIcon)
    if (readMemoText(pageElements) !== currentMemoText) {
      pageElements.memoInput.value = currentMemoText
    }
    pageElements.memoCustomIconInput.value = normalizedMemoState.faviconIcon
    pageElements.faviconLink.href = createFaviconDataUrl(normalizedMemoState.faviconIcon)

    updateSelectedIconButtons(normalizedMemoState.faviconIcon)
    storeCurrentFaviconIcon(normalizedMemoState.faviconIcon)
  }

  const updateSearch = (memoState: MemoState): void => {
    const nextSearch = createSearchFromMemoState(createNormalizedMemoState(memoState))
    window.history.replaceState({}, '', `${window.location.pathname}${nextSearch}`)
  }

  const syncMemoState = (memoState: MemoState): void => {
    updateView(memoState)
    updateSearch(memoState)
  }

  const applyMemoState = (memoState: MemoState): void => {
    syncMemoState(memoState)
  }

  const clearCustomIconValidationMessage = (): void => {
    pageElements.memoCustomIconInput.setCustomValidity('')
    pageElements.memoCustomIconError.textContent = ''
  }

  const setCustomIconValidationMessage = (message: string): void => {
    pageElements.memoCustomIconInput.setCustomValidity(message)
    pageElements.memoCustomIconError.textContent = message
  }

  const setSelectedIconButtonUpdater = (nextUpdater: (selectedIcon: string) => void): void => {
    updateSelectedIconButtons = nextUpdater
  }

  return {
    applyMemoState,
    clearCustomIconValidationMessage,
    readCurrentMemoState,
    setSelectedIconButtonUpdater,
    setCustomIconValidationMessage,
    syncMemoState,
  }
}
