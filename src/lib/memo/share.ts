import { normalizeFaviconIcon } from './icon'
import { normalizeMemoText } from './text'
import type { MemoState } from './state'

export type ShareMessages = {
  lineTemplate: string
  webShareText: string
  webShareTitle: string
  xTemplate: string
}

export type ShareTextPlatform = 'line' | 'x'

const createResolvedShareTemplate = (template: string, memoState: MemoState, fallbackMemoText: string): string =>
  template
    .replaceAll('{{ICON}}', normalizeFaviconIcon(memoState.faviconIcon))
    .replaceAll('{{MESSAGE}}', normalizeMemoText(memoState.memoText, fallbackMemoText))

export const createShareText = (
  platform: ShareTextPlatform,
  memoState: MemoState,
  shareMessages: ShareMessages,
  fallbackMemoText: string,
): string =>
  createResolvedShareTemplate(platform === 'x' ? shareMessages.xTemplate : shareMessages.lineTemplate, memoState, fallbackMemoText)

export const createWebShareDataFromMemoState = (
  memoState: MemoState,
  shareMessages: ShareMessages,
  fallbackMemoText: string,
): { title: string; text: string } => ({
  title: shareMessages.webShareTitle,
  text: createResolvedShareTemplate(shareMessages.webShareText, memoState, fallbackMemoText),
})
