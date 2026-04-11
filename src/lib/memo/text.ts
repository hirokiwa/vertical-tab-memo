export const EMPTY_MEMO_TEXT = ''
export const FALLBACK_MEMO_TEXT = '縦タブワロタ'

export type MemoTextState = {
  memoText: string
}

export const normalizeMemoText = (value: string): string => {
  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : FALLBACK_MEMO_TEXT
}
