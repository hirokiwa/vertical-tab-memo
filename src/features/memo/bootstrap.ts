import type { MemoState } from '../../lib/memo'
import { getPageElements } from './elements'
import { setupEditor } from './editor-controller'
import { setupIconPicker } from './icon-picker-controller'
import type { PageConfig } from './page-config'
import { setupShare } from './share-controller'
import { createStateService } from './state-service'

export const initializePage = (initialMemoState: MemoState, pageConfig: PageConfig): void => {
  const pageElements = getPageElements()
  const stateService = createStateService(pageElements, pageConfig)

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
}
