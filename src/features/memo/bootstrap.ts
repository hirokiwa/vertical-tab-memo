import type { MemoState } from '../../lib/memo'
import { getPageElements } from './elements'
import { setupForm } from './form-controller'
import { setupIconPicker } from './icon-picker-controller'
import { setupShare } from './share-controller'
import { createStateService } from './state-service'

export const initializePage = (initialMemoState: MemoState): void => {
  const pageElements = getPageElements()
  const stateService = createStateService(pageElements)

  setupForm({
    pageElements,
    stateService,
  })

  setupShare({
    pageElements,
    stateService,
  })

  setupIconPicker({
    initialFaviconIcon: initialMemoState.faviconIcon,
    pageElements,
    stateService,
  })

  stateService.applyMemoState(initialMemoState)
  pageElements.memoShareNativeButton.disabled = typeof navigator.share !== 'function'
}
