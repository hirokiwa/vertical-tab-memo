const MEMO_EDITOR_ID = 'memo-editor'
const MEMO_CHARACTER_COUNT_ID = 'memo-character-count'
const MEMO_INPUT_ID = 'memo-input'
const MEMO_ICON_LIST_ID = 'memo-icon-list'
const MEMO_PREVIEW_ICON_ID = 'memo-preview-icon'
const MEMO_URL_COPY_ID = 'memo-url-copy'
const MEMO_URL_COPY_ICON_ID = 'memo-url-copy-icon'
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
  faviconPngLink: 'app-favicon-png',
  shortcutIconLink: 'app-shortcut-icon',
  appleTouchIconLink: 'app-apple-touch-icon',
  appleMobileWebAppTitleMeta: 'app-apple-mobile-web-app-title',
  manifestLink: 'app-manifest',
  memoEditor: MEMO_EDITOR_ID,
  memoCharacterCount: MEMO_CHARACTER_COUNT_ID,
  memoInput: MEMO_INPUT_ID,
  memoIconList: MEMO_ICON_LIST_ID,
  memoPreviewIcon: MEMO_PREVIEW_ICON_ID,
  memoUrlCopy: MEMO_URL_COPY_ID,
  memoUrlCopyIcon: MEMO_URL_COPY_ICON_ID,
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
