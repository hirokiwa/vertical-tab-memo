import { FAVICON_QUERY_KEY, MEMO_QUERY_KEY } from './stateKeys'
import { normalizeFaviconIcon } from './icon'
import { DEFAULT_MEMO_TEXT, normalizeMemoText } from './text'

export type MemoState = {
  memoText: string
  faviconIcon: string
}

export type QueryValue = string | string[] | undefined
export type QueryRecord = Record<string, QueryValue>

const getFirstQueryValue = (queryValue: QueryValue): string | null => {
  if (typeof queryValue === 'string') {
    return queryValue
  }
  if (Array.isArray(queryValue)) {
    return queryValue[0] ?? null
  }
  return null
}

export const createMemoState = (memoText: string, faviconIcon: string | null): MemoState => ({
  memoText: normalizeMemoText(memoText),
  faviconIcon: normalizeFaviconIcon(faviconIcon),
})

export const readMemoStateFromSearch = (search: string): MemoState => {
  const searchParameters = new URLSearchParams(search)
  return createMemoState(
    searchParameters.get(MEMO_QUERY_KEY) ?? DEFAULT_MEMO_TEXT,
    searchParameters.get(FAVICON_QUERY_KEY),
  )
}

export const readMemoStateFromQueryRecord = (queryRecord: QueryRecord): MemoState => {
  const rawMemoText = getFirstQueryValue(queryRecord[MEMO_QUERY_KEY]) ?? DEFAULT_MEMO_TEXT
  const rawFaviconIcon = getFirstQueryValue(queryRecord[FAVICON_QUERY_KEY])
  return createMemoState(rawMemoText, rawFaviconIcon)
}

export const createSearchFromMemoState = (memoState: MemoState): string => {
  const searchParameters = new URLSearchParams()
  searchParameters.set(MEMO_QUERY_KEY, normalizeMemoText(memoState.memoText))
  searchParameters.set(FAVICON_QUERY_KEY, normalizeFaviconIcon(memoState.faviconIcon))
  return `?${searchParameters.toString()}`
}

export const createSearchFromQueryRecord = (queryRecord: QueryRecord): string => {
  const rawMemoText = getFirstQueryValue(queryRecord[MEMO_QUERY_KEY]) ?? DEFAULT_MEMO_TEXT
  const rawFaviconIcon = getFirstQueryValue(queryRecord[FAVICON_QUERY_KEY])
  return createSearchFromMemoState(createMemoState(rawMemoText, rawFaviconIcon))
}

export const createShareUrlFromMemoState = (
  memoState: MemoState,
  locationValue: Pick<Location, 'origin' | 'pathname'>,
): string => `${locationValue.origin}${locationValue.pathname}${createSearchFromMemoState(memoState)}`
