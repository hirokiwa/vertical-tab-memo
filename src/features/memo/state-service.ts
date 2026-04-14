import {
  clampMemoText,
  countMemoTextCharacters,
  createSearchFromMemoState,
  DEFAULT_FAVICON_ICON,
  MAX_MEMO_TEXT_LENGTH,
  normalizeFaviconIcon,
  normalizeMemoText,
  type MemoState,
} from '../../lib/memo'
import type { PageElements } from './elements'
import type { HomeScreenService } from './home-screen-service'
import type { PageConfig } from './page-config'

export type StateService = ReturnType<typeof createStateService>
const INPUT_SETTLE_DELAY_MS = 500

const createNormalizedMemoState = (memoState: MemoState): MemoState => ({
  memoText: clampMemoText(memoState.memoText),
  faviconIcon: normalizeFaviconIcon(memoState.faviconIcon),
})

const readMemoText = (pageElements: PageElements): string => pageElements.memoInput.value

export const createStateService = (
  pageElements: PageElements,
  pageConfig: PageConfig,
  homeScreenService: HomeScreenService,
) => {
  let updateSelectedIconButtons = (_selectedIcon: string): void => {}
  const stateChangeListeners = new Set<(memoState: MemoState) => void>()
  const settledStateChangeListeners = new Set<(memoState: MemoState) => void>()
  let settledStateChangeTimer = 0

  const readCurrentMemoState = (): MemoState => ({
    memoText: readMemoText(pageElements),
    faviconIcon: pageElements.appRoot.dataset.currentFaviconIcon ?? DEFAULT_FAVICON_ICON,
  })

  const storeCurrentFaviconIcon = (faviconIcon: string): void => {
    pageElements.appRoot.dataset.currentFaviconIcon = faviconIcon
  }

  const updateView = (memoState: MemoState): void => {
    const normalizedMemoState = createNormalizedMemoState(memoState)
    const currentMemoText = normalizedMemoState.memoText
    const normalizedMemoText = normalizeMemoText(currentMemoText, pageConfig.fallbackMemoText)
    const memoCharacterCount = countMemoTextCharacters(currentMemoText)

    document.title = normalizedMemoText
    pageElements.memoPreviewIcon.textContent = normalizeFaviconIcon(normalizedMemoState.faviconIcon)
    if (readMemoText(pageElements) !== currentMemoText) {
      pageElements.memoInput.value = currentMemoText
    }
    pageElements.memoCharacterCount.textContent = `${memoCharacterCount}/${MAX_MEMO_TEXT_LENGTH}`
    pageElements.memoCharacterCount.classList.toggle('memo-card__character-count--limit', memoCharacterCount >= MAX_MEMO_TEXT_LENGTH)
    pageElements.memoCustomIconInput.value = normalizedMemoState.faviconIcon
    homeScreenService.updateHomeScreenIcon(normalizedMemoState.faviconIcon)

    updateSelectedIconButtons(normalizedMemoState.faviconIcon)
    storeCurrentFaviconIcon(normalizedMemoState.faviconIcon)
  }

  const updateSearch = (memoState: MemoState): void => {
    const nextSearch = createSearchFromMemoState(createNormalizedMemoState(memoState))
    window.history.replaceState({}, '', `${window.location.pathname}${nextSearch}`)
  }

  const syncMemoState = (memoState: MemoState): void => {
    const normalizedMemoState = createNormalizedMemoState(memoState)
    updateView(normalizedMemoState)
    updateSearch(normalizedMemoState)
    stateChangeListeners.forEach((listener) => {
      listener(normalizedMemoState)
    })
    window.clearTimeout(settledStateChangeTimer)
    settledStateChangeTimer = window.setTimeout(() => {
      settledStateChangeListeners.forEach((listener) => {
        listener(normalizedMemoState)
      })
    }, INPUT_SETTLE_DELAY_MS)
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

  const addStateChangeListener = (listener: (memoState: MemoState) => void): (() => void) => {
    stateChangeListeners.add(listener)
    return () => {
      stateChangeListeners.delete(listener)
    }
  }

  const addSettledStateChangeListener = (listener: (memoState: MemoState) => void): (() => void) => {
    settledStateChangeListeners.add(listener)
    return () => {
      settledStateChangeListeners.delete(listener)
    }
  }

  return {
    addStateChangeListener,
    addSettledStateChangeListener,
    applyMemoState,
    clearCustomIconValidationMessage,
    readCurrentMemoState,
    setSelectedIconButtonUpdater,
    setCustomIconValidationMessage,
    syncMemoState,
  }
}
