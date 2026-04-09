import { FAVICON_OPTIONS } from '../../lib/memo'
import { getRequiredElementById } from '../../shared/dom'

const MEMO_FORM_ID = 'memo-form'
const MEMO_INPUT_ID = 'memo-input'
const MEMO_ICON_LIST_ID = 'memo-icon-list'
const MEMO_PREVIEW_ID = 'memo-preview'
const MEMO_URL_ID = 'memo-url'
const MEMO_URL_COPY_ID = 'memo-url-copy'
const MEMO_SHARE_X_ID = 'memo-share-x'
const MEMO_SHARE_LINE_ID = 'memo-share-line'
const MEMO_SHARE_NATIVE_ID = 'memo-share-native'
const MEMO_CUSTOM_ICON_TOGGLE_ID = 'memo-custom-icon-toggle'
const MEMO_CUSTOM_ICON_TOGGLE_ITEM_ID = 'memo-custom-icon-toggle-item'
const MEMO_CUSTOM_ICON_DIALOG_ID = 'memo-custom-icon-dialog'
const MEMO_CUSTOM_ICON_FORM_ID = 'memo-custom-icon-form'
const MEMO_CUSTOM_ICON_INPUT_ID = 'memo-custom-icon-input'
const MEMO_CUSTOM_ICON_ERROR_ID = 'memo-custom-icon-error'
const MEMO_CUSTOM_ICON_CLOSE_ID = 'memo-custom-icon-close'

export const elementIds = {
  appRoot: 'app',
  faviconLink: 'app-favicon',
  memoForm: MEMO_FORM_ID,
  memoInput: MEMO_INPUT_ID,
  memoIconList: MEMO_ICON_LIST_ID,
  memoPreview: MEMO_PREVIEW_ID,
  memoUrl: MEMO_URL_ID,
  memoUrlCopy: MEMO_URL_COPY_ID,
  memoShareX: MEMO_SHARE_X_ID,
  memoShareLine: MEMO_SHARE_LINE_ID,
  memoShareNative: MEMO_SHARE_NATIVE_ID,
  memoCustomIconToggle: MEMO_CUSTOM_ICON_TOGGLE_ID,
  memoCustomIconToggleItem: MEMO_CUSTOM_ICON_TOGGLE_ITEM_ID,
  memoCustomIconDialog: MEMO_CUSTOM_ICON_DIALOG_ID,
  memoCustomIconForm: MEMO_CUSTOM_ICON_FORM_ID,
  memoCustomIconInput: MEMO_CUSTOM_ICON_INPUT_ID,
  memoCustomIconError: MEMO_CUSTOM_ICON_ERROR_ID,
  memoCustomIconClose: MEMO_CUSTOM_ICON_CLOSE_ID,
} as const

export const createIconOptionElementId = (index: number): string => `memo-icon-option-${index}`

const createIconButtonMarkup = (icon: string, label: string, index: number): string => `
  <li class="memo-card__icon-item">
    <button
      id="${createIconOptionElementId(index)}"
      class="memo-card__icon-button"
      type="button"
      aria-pressed="false"
      aria-label="${label}アイコンを選択"
      tabindex="-1"
    >
      ${icon}
    </button>
  </li>
`

export const renderPresetIconButtons = (): void => {
  const iconListElement = getRequiredElementById<HTMLUListElement>(elementIds.memoIconList)
  const customToggleItemElement = getRequiredElementById<HTMLLIElement>(elementIds.memoCustomIconToggleItem)
  const iconMarkup = FAVICON_OPTIONS.map((faviconOption, index) =>
    createIconButtonMarkup(faviconOption.icon, faviconOption.label, index),
  ).join('')

  const presetIconTemplateElement = document.createElement('template')
  presetIconTemplateElement.innerHTML = iconMarkup
  iconListElement.insertBefore(presetIconTemplateElement.content, customToggleItemElement)
}
