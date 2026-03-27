export const DEFAULT_MEMO_TEXT = '縦タブメモ'
export const DEFAULT_FAVICON_ICON = '📝'

const MEMO_QUERY_KEY = 'text'
const FAVICON_QUERY_KEY = 'icon'

export const FAVICON_OPTIONS = [
  { icon: '📝', label: 'メモ' },
  { icon: '💡', label: 'ひらめき' },
  { icon: '🔥', label: '熱量' },
  { icon: '✅', label: '完了' },
  { icon: '🚀', label: '集中' },
  { icon: '😴', label: '休憩' },
  { icon: '📌', label: '固定' },
  { icon: '📣', label: '通知' },
  { icon: '⚠️', label: '注意' },
  { icon: '🎯', label: '目標' },
  { icon: '👆', label: '重要' },
  { icon: '👇', label: '下へ' },
  { icon: '❤️', label: '好き' },
  { icon: '⭐', label: '優先' },
  { icon: '📅', label: '予定' },
  { icon: '🧠', label: '思考' },
  { icon: '📚', label: '学習' },
  { icon: '💼', label: '仕事' },
  { icon: '🏠', label: '生活' },
  { icon: '💬', label: '会話' },
  { icon: '🎵', label: '音楽' },
  { icon: '📷', label: '撮影' },
  { icon: '🛠️', label: '作業' },
  { icon: '😀', label: '笑顔' },
  { icon: '😂', label: '爆笑' },
  { icon: '🥺', label: 'うるうる' },
  { icon: '😎', label: 'クール' },
  { icon: '🤔', label: '考え中' },
  { icon: '😭', label: '涙' },
] as const

export type MemoState = {
  memoText: string
  faviconIcon: string
}

const SINGLE_EMOJI_PATTERN =
  /^(?:\p{Regional_Indicator}{2}|\p{Emoji}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?(?:\u200D\p{Emoji}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?)*)$/u

const normalizeMemoText = (value: string): string => {
  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : DEFAULT_MEMO_TEXT
}

export const normalizeFaviconIcon = (iconValue: string | null): string => {
  if (iconValue === null) {
    return DEFAULT_FAVICON_ICON
  }
  const trimmedIconValue = iconValue.trim()
  return isSingleEmoji(trimmedIconValue) ? trimmedIconValue : DEFAULT_FAVICON_ICON
}

export const isSingleEmoji = (iconValue: string): boolean =>
  SINGLE_EMOJI_PATTERN.test(iconValue.trim())

export const readMemoStateFromSearch = (search: string): MemoState => {
  const searchParameters = new URLSearchParams(search)
  const rawMemoText = searchParameters.get(MEMO_QUERY_KEY)
  const rawFaviconIcon = searchParameters.get(FAVICON_QUERY_KEY)
  return {
    memoText: normalizeMemoText(rawMemoText ?? DEFAULT_MEMO_TEXT),
    faviconIcon: normalizeFaviconIcon(rawFaviconIcon),
  }
}

export const createTitleFromMemoState = (memoState: MemoState): string =>
  `${normalizeMemoText(memoState.memoText)} | TabMemo`

export const createPreviewFromMemoState = (memoState: MemoState): string =>
  `${normalizeFaviconIcon(memoState.faviconIcon)} ${normalizeMemoText(memoState.memoText)}`

export const createSearchFromMemoState = (memoState: MemoState): string => {
  const searchParameters = new URLSearchParams()
  searchParameters.set(MEMO_QUERY_KEY, normalizeMemoText(memoState.memoText))
  searchParameters.set(FAVICON_QUERY_KEY, normalizeFaviconIcon(memoState.faviconIcon))
  return `?${searchParameters.toString()}`
}

export const createShareUrlFromMemoState = (
  memoState: MemoState,
  locationValue: Pick<Location, 'origin' | 'pathname'>,
): string => `${locationValue.origin}${locationValue.pathname}${createSearchFromMemoState(memoState)}`

export const createFaviconDataUrl = (faviconIcon: string): string => {
  const iconValue = normalizeFaviconIcon(faviconIcon)
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="52">${iconValue}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`
}
