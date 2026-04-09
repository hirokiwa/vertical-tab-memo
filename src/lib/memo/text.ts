export const DEFAULT_MEMO_TEXT = '縦タブメモ'

export type MemoTextState = {
  memoText: string
}

export const normalizeMemoText = (value: string): string => {
  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : DEFAULT_MEMO_TEXT
}

export const createTitleFromMemoText = (memoText: string): string => `${normalizeMemoText(memoText)} | 縦タブメモ`
