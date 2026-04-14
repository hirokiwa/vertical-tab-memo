import { createSearchFromMemoState, type MemoState } from '../../lib/memo'
import type { PageElements } from './elements'
import type { StateService } from './state-service'

type SetupLanguageSwitchParameters = {
  pageElements: PageElements
  stateService: StateService
}

export const setupLanguageSwitch = ({ pageElements, stateService }: SetupLanguageSwitchParameters): void => {
  const updateLanguageSwitchHref = (memoState: MemoState): void => {
    const switchUrl = new URL(pageElements.memoLanguageSwitchLink.href, window.location.origin)
    switchUrl.search = createSearchFromMemoState(memoState)
    pageElements.memoLanguageSwitchLink.href = switchUrl.toString()
  }

  stateService.addSettledStateChangeListener(updateLanguageSwitchHref)
  updateLanguageSwitchHref(stateService.readCurrentMemoState())
}
