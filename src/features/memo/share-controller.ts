import { createShareText, createShareUrlFromMemoState, createWebShareDataFromMemoState } from '../../lib/memo'
import type { MemoState } from '../../lib/memo'
import type { PageElements } from './elements'
import type { PageConfig } from './page-config'
import type { StateService } from './state-service'

type SetupShareParameters = {
  pageConfig: PageConfig
  pageElements: PageElements
  stateService: StateService
}

const COPY_ICON_PATH =
  'M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z'
const CHECK_ICON_PATH = 'M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'
const SHARE_LINK_UPDATE_DELAY_MS = 500

export const createXShareHref = (
  memoState: MemoState,
  pageConfig: PageConfig,
  locationValue: Pick<Location, 'origin' | 'pathname'>,
): string => {
  const shareUrl = createShareUrlFromMemoState(memoState, locationValue)
  const shareText = createShareText('x', memoState, pageConfig.share, pageConfig.fallbackMemoText)
  return `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
}

export const createLineShareHref = (
  memoState: MemoState,
  pageConfig: PageConfig,
  locationValue: Pick<Location, 'origin' | 'pathname'>,
): string => {
  const shareUrl = createShareUrlFromMemoState(memoState, locationValue)
  const shareText = `${createShareText('line', memoState, pageConfig.share, pageConfig.fallbackMemoText)}\n${shareUrl}`
  return `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`
}

export const setupShare = ({ pageConfig, pageElements, stateService }: SetupShareParameters): void => {
  let shareLinkUpdateTimer = 0

  const updateShareLinks = (memoState: MemoState): void => {
    pageElements.memoShareXLink.href = createXShareHref(memoState, pageConfig, window.location)
    pageElements.memoShareLineLink.href = createLineShareHref(memoState, pageConfig, window.location)
  }

  const scheduleShareLinkUpdate = (memoState: MemoState): void => {
    window.clearTimeout(shareLinkUpdateTimer)
    shareLinkUpdateTimer = window.setTimeout(() => {
      updateShareLinks(memoState)
    }, SHARE_LINK_UPDATE_DELAY_MS)
  }

  const onCopyClick = (): void => {
    const shareUrl = createShareUrlFromMemoState(stateService.readCurrentMemoState(), window.location)
    if (shareUrl.length === 0) {
      return
    }

    void navigator.clipboard.writeText(shareUrl)
    pageElements.memoUrlCopyIconPath.setAttribute('d', CHECK_ICON_PATH)
    window.setTimeout(() => {
      pageElements.memoUrlCopyIconPath.setAttribute('d', COPY_ICON_PATH)
    }, 1200)
  }

  const onShareNativeClick = (): void => {
    if (typeof navigator.share !== 'function') {
      return
    }

    const memoState = stateService.readCurrentMemoState()
    const shareUrl = createShareUrlFromMemoState(memoState, window.location)
    const webShareData = createWebShareDataFromMemoState(memoState, pageConfig.share, pageConfig.fallbackMemoText)

    void navigator.share({
      title: webShareData.title,
      text: webShareData.text,
      url: shareUrl,
    })
  }

  pageElements.memoUrlCopyButton.addEventListener('click', onCopyClick)
  pageElements.memoShareNativeButton.addEventListener('click', onShareNativeClick)
  stateService.addStateChangeListener(scheduleShareLinkUpdate)
  updateShareLinks(stateService.readCurrentMemoState())
}
