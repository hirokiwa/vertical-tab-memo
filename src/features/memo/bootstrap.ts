import type { MemoState } from '../../lib/memo'
import { getPageElements } from './elements'
import { setupEditor } from './editor-controller'
import { createHomeScreenService } from './home-screen-service'
import { setupIconPicker } from './icon-picker-controller'
import type { PageConfig } from './page-config'
import { setupShare } from './share-controller'
import { createStateService } from './state-service'

const focusMemoInput = (pageElements: ReturnType<typeof getPageElements>): void => {
  pageElements.memoInput.focus()
}

export const initializePage = (initialMemoState: MemoState, pageConfig: PageConfig, shouldFocusMemoInput: boolean): void => {
  const pageElements = getPageElements()
  const homeScreenService = createHomeScreenService(pageElements)
  const stateService = createStateService(pageElements, pageConfig, homeScreenService)

  setupEditor({
    pageElements,
    stateService,
  })

  setupShare({
    pageConfig,
    pageElements,
    stateService,
  })

  setupIconPicker({
    initialFaviconIcon: initialMemoState.faviconIcon,
    pageConfig,
    pageElements,
    stateService,
  })

  stateService.applyMemoState(initialMemoState)
  pageElements.memoShareNativeButton.disabled = typeof navigator.share !== 'function'

  if (shouldFocusMemoInput) {
    focusMemoInput(pageElements)
  }
}
