import { normalizeFaviconIcon } from './icon'
import { normalizeMemoText } from './text'
import type { MemoState } from './state'

const BASE_SHARE_TEXT = 'ブラウザの縦タブで表示する 1 行メモ'

export const SHARE_TEXT = {
  x: `『{{ICON}} {{MESSAGE}}』\n\n${BASE_SHARE_TEXT}\n\n#縦タブメモ\n`,
  line: `🎉 縦タブメモ\n\n『{{ICON}} {{MESSAGE}}』\n\n${BASE_SHARE_TEXT}`,
  webShareApi: {
    title: '縦タブメモ',
    text: `🎉 縦タブメモ\n\n『{{ICON}} {{MESSAGE}}』\n\n${BASE_SHARE_TEXT}`,
  },
} as const

export type ShareTextPlatform = keyof typeof SHARE_TEXT

const createResolvedShareTemplate = (template: string, memoState: MemoState): string =>
  template
    .replaceAll('{{ICON}}', normalizeFaviconIcon(memoState.faviconIcon))
    .replaceAll('{{MESSAGE}}', normalizeMemoText(memoState.memoText))

export const createShareText = (platform: Exclude<ShareTextPlatform, 'webShareApi'>, memoState: MemoState): string =>
  createResolvedShareTemplate(SHARE_TEXT[platform], memoState)

export const createWebShareDataFromMemoState = (memoState: MemoState): { title: string; text: string } => ({
  title: SHARE_TEXT.webShareApi.title,
  text: createResolvedShareTemplate(SHARE_TEXT.webShareApi.text, memoState),
})
