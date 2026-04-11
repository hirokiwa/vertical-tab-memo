export const EMPTY_MEMO_TEXT = ''
export const MAX_MEMO_TEXT_LENGTH = 30

export type MemoTextState = {
  memoText: string
}

export const clampMemoText = (value: string): string => value.slice(0, MAX_MEMO_TEXT_LENGTH)

export const countMemoTextCharacters = (value: string): number => value.length

export const normalizeMemoText = (value: string, fallbackMemoText: string): string => {
  const trimmedValue = clampMemoText(value).trim()
  return trimmedValue.length > 0 ? trimmedValue : fallbackMemoText
}
