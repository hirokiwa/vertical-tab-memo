import { createShareText, createShareUrlFromMemoState, createWebShareDataFromMemoState } from '../../lib/memo'
import type { PageElements } from './elements'
import type { StateService } from './state-service'

type SetupShareParameters = {
  pageElements: PageElements
  stateService: StateService
}

const openShareWindow = (shareUrl: string): void => {
  window.open(shareUrl, '_blank', 'noopener,noreferrer')
}

export const setupShare = ({ pageElements, stateService }: SetupShareParameters): void => {
  const onCopyClick = (): void => {
    const shareUrl = createShareUrlFromMemoState(stateService.readCurrentMemoState(), window.location)
    if (shareUrl.length === 0) {
      return
    }

    void navigator.clipboard.writeText(shareUrl)
    pageElements.memoUrlCopyButton.textContent = '✅ コピー済み'
    window.setTimeout(() => {
      pageElements.memoUrlCopyButton.textContent = '📋 コピー'
    }, 1200)
  }

  const onShareXClick = (): void => {
    const memoState = stateService.readCurrentMemoState()
    const shareUrl = createShareUrlFromMemoState(memoState, window.location)
    const shareText = createShareText('x', memoState)
    openShareWindow(`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)
  }

  const onShareLineClick = (): void => {
    const memoState = stateService.readCurrentMemoState()
    const shareUrl = createShareUrlFromMemoState(memoState, window.location)
    const shareText = `${createShareText('line', memoState)}\n${shareUrl}`
    openShareWindow(`https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`)
  }

  const onShareNativeClick = (): void => {
    if (typeof navigator.share !== 'function') {
      return
    }

    const memoState = stateService.readCurrentMemoState()
    const shareUrl = createShareUrlFromMemoState(memoState, window.location)
    const webShareData = createWebShareDataFromMemoState(memoState)

    void navigator.share({
      title: webShareData.title,
      text: webShareData.text,
      url: shareUrl,
    })
  }

  pageElements.memoUrlCopyButton.addEventListener('click', onCopyClick)
  pageElements.memoShareXButton.addEventListener('click', onShareXClick)
  pageElements.memoShareLineButton.addEventListener('click', onShareLineClick)
  pageElements.memoShareNativeButton.addEventListener('click', onShareNativeClick)
}
