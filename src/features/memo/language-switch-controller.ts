import { createSearchFromMemoState, type MemoState } from '../../lib/memo'
import type { PageElements } from './elements'
import type { StateService } from './state-service'

type SetupLanguageSwitchParameters = {
  pageElements: PageElements
  stateService: StateService
}

const LANGUAGE_SWITCH_UPDATE_DELAY_MS = 500

export const setupLanguageSwitch = ({ pageElements, stateService }: SetupLanguageSwitchParameters): void => {
  let languageSwitchUpdateTimer = 0

  const updateLanguageSwitchHref = (memoState: MemoState): void => {
    const switchUrl = new URL(pageElements.memoLanguageSwitchLink.href, window.location.origin)
    switchUrl.search = createSearchFromMemoState(memoState)
    pageElements.memoLanguageSwitchLink.href = switchUrl.toString()
  }

  const scheduleLanguageSwitchUpdate = (memoState: MemoState): void => {
    window.clearTimeout(languageSwitchUpdateTimer)
    languageSwitchUpdateTimer = window.setTimeout(() => {
      updateLanguageSwitchHref(memoState)
    }, LANGUAGE_SWITCH_UPDATE_DELAY_MS)
  }

  stateService.addStateChangeListener(scheduleLanguageSwitchUpdate)
  updateLanguageSwitchHref(stateService.readCurrentMemoState())
}
