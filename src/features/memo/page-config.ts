import { getRequiredElementById } from '../../shared/dom'

type ShareMessages = {
  lineTemplate: string
  webShareText: string
  webShareTitle: string
  xTemplate: string
}

export type PageConfig = {
  customValidationEmpty: string
  customValidationMultiple: string
  fallbackMemoText: string
  share: ShareMessages
}

const PAGE_CONFIG_ID = 'memo-page-config'

const isPageConfig = (value: unknown): value is PageConfig => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  const share = candidate.share

  return (
    typeof candidate.fallbackMemoText === 'string' &&
    typeof candidate.customValidationEmpty === 'string' &&
    typeof candidate.customValidationMultiple === 'string' &&
    typeof share === 'object' &&
    share !== null &&
    typeof (share as Record<string, unknown>).xTemplate === 'string' &&
    typeof (share as Record<string, unknown>).lineTemplate === 'string' &&
    typeof (share as Record<string, unknown>).webShareTitle === 'string' &&
    typeof (share as Record<string, unknown>).webShareText === 'string'
  )
}

export const readPageConfig = (): PageConfig => {
  const pageConfigElement = getRequiredElementById<HTMLScriptElement>(PAGE_CONFIG_ID)
  const pageConfig = JSON.parse(pageConfigElement.textContent ?? '') as unknown

  if (!isPageConfig(pageConfig)) {
    throw new Error('Invalid memo page config')
  }

  return pageConfig
}
