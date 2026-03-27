import './style.css'
import {
  createFaviconDataUrl,
  createPreviewFromMemoState,
  createSearchFromMemoState,
  createShareUrlFromMemoState,
  createTitleFromMemoState,
  DEFAULT_FAVICON_ICON,
  FAVICON_OPTIONS,
  isSingleEmoji,
  type MemoState,
  normalizeFaviconIcon,
  readMemoStateFromSearch,
} from './memo'

const APP_ROOT_ID = 'app'
const FAVICON_LINK_ID = 'app-favicon'
const MEMO_INPUT_ID = 'memo-input'
const MEMO_PREVIEW_ID = 'memo-preview'
const MEMO_URL_ID = 'memo-url'
const MEMO_URL_COPY_BUTTON_ID = 'memo-url-copy'
const MEMO_ICON_LIST_ID = 'memo-icon-list'
const MEMO_CUSTOM_ICON_TOGGLE_ID = 'memo-custom-icon-toggle'
const MEMO_CUSTOM_ICON_DIALOG_ID = 'memo-custom-icon-dialog'
const MEMO_CUSTOM_ICON_FORM_ID = 'memo-custom-icon-form'
const MEMO_CUSTOM_ICON_INPUT_ID = 'memo-custom-icon-input'
const MEMO_CUSTOM_ICON_ERROR_ID = 'memo-custom-icon-error'
const MEMO_CUSTOM_ICON_CLOSE_ID = 'memo-custom-icon-close'

const createIconOptionElementId = (index: number): string => `memo-icon-option-${index}`

const getRequiredElementById = <T extends HTMLElement>(elementId: string): T => {
  const element = document.getElementById(elementId)
  if (element === null) {
    throw new Error(`Required element is missing: ${elementId}`)
  }
  return element as T
}

const createIconOptionButton = (index: number, icon: string, label: string): HTMLButtonElement => {
  const iconButtonElement = document.createElement('button')
  iconButtonElement.id = createIconOptionElementId(index)
  iconButtonElement.className = 'memo-card__icon-button'
  iconButtonElement.type = 'button'
  iconButtonElement.setAttribute('aria-pressed', 'false')
  iconButtonElement.setAttribute('aria-label', `${label}アイコンを選択`)
  iconButtonElement.textContent = icon
  return iconButtonElement
}

const createIconOptionListItem = (buttonElement: HTMLButtonElement): HTMLLIElement => {
  const iconItemElement = document.createElement('li')
  iconItemElement.className = 'memo-card__icon-item'
  iconItemElement.append(buttonElement)
  return iconItemElement
}

const renderIconButtons = (): void => {
  const iconListElement = getRequiredElementById<HTMLUListElement>(MEMO_ICON_LIST_ID)
  iconListElement.replaceChildren()

  FAVICON_OPTIONS.forEach((faviconOption, index) => {
    const iconButtonElement = createIconOptionButton(index, faviconOption.icon, faviconOption.label)
    iconListElement.append(createIconOptionListItem(iconButtonElement))
  })

  const customIconButtonElement = document.createElement('button')
  customIconButtonElement.id = MEMO_CUSTOM_ICON_TOGGLE_ID
  customIconButtonElement.className = 'memo-card__icon-button memo-card__icon-button--custom'
  customIconButtonElement.type = 'button'
  customIconButtonElement.setAttribute('aria-pressed', 'false')
  customIconButtonElement.setAttribute('aria-haspopup', 'dialog')
  customIconButtonElement.setAttribute('aria-controls', MEMO_CUSTOM_ICON_DIALOG_ID)
  customIconButtonElement.setAttribute('aria-label', '任意アイコン入力を開く')
  customIconButtonElement.textContent = '➕'
  iconListElement.append(createIconOptionListItem(customIconButtonElement))
}

const isPresetFaviconIcon = (faviconIcon: string): boolean =>
  FAVICON_OPTIONS.some((faviconOption) => faviconOption.icon === faviconIcon)

const clearCustomIconValidationMessage = (): void => {
  const customIconInputElement = getRequiredElementById<HTMLInputElement>(MEMO_CUSTOM_ICON_INPUT_ID)
  const customIconErrorElement = getRequiredElementById<HTMLParagraphElement>(MEMO_CUSTOM_ICON_ERROR_ID)
  customIconInputElement.setCustomValidity('')
  customIconErrorElement.textContent = ''
}

const setCustomIconValidationMessage = (message: string): void => {
  const customIconInputElement = getRequiredElementById<HTMLInputElement>(MEMO_CUSTOM_ICON_INPUT_ID)
  const customIconErrorElement = getRequiredElementById<HTMLParagraphElement>(MEMO_CUSTOM_ICON_ERROR_ID)
  customIconInputElement.setCustomValidity(message)
  customIconErrorElement.textContent = message
}

const validateCustomIcon = (rawIconValue: string): boolean => {
  const trimmedIconValue = rawIconValue.trim()
  if (!isSingleEmoji(trimmedIconValue)) {
    const validationMessage =
      trimmedIconValue.length === 0
        ? '絵文字1文字を入力してください。'
        : '絵文字は1文字だけ入力してください。'
    setCustomIconValidationMessage(validationMessage)
    return false
  }
  clearCustomIconValidationMessage()
  return true
}

const updateSelectedIconButtons = (selectedIcon: string): void => {
  FAVICON_OPTIONS.forEach((faviconOption, index) => {
    const iconButtonElement = getRequiredElementById<HTMLButtonElement>(createIconOptionElementId(index))
    iconButtonElement.setAttribute('aria-pressed', `${faviconOption.icon === selectedIcon}`)
  })

  const customIconToggleElement = getRequiredElementById<HTMLButtonElement>(MEMO_CUSTOM_ICON_TOGGLE_ID)
  customIconToggleElement.setAttribute('aria-pressed', `${!isPresetFaviconIcon(selectedIcon)}`)
}

const updateFavicon = (faviconIcon: string): void => {
  const faviconLinkElement = getRequiredElementById<HTMLLinkElement>(FAVICON_LINK_ID)
  faviconLinkElement.href = createFaviconDataUrl(faviconIcon)
}

const readCurrentFaviconIcon = (): string => {
  const appElement = getRequiredElementById<HTMLDivElement>(APP_ROOT_ID)
  return appElement.dataset.currentFaviconIcon ?? DEFAULT_FAVICON_ICON
}

const storeCurrentFaviconIcon = (faviconIcon: string): void => {
  const appElement = getRequiredElementById<HTMLDivElement>(APP_ROOT_ID)
  appElement.dataset.currentFaviconIcon = faviconIcon
}

const updateView = (memoState: MemoState): void => {
  const normalizedFaviconIcon = normalizeFaviconIcon(memoState.faviconIcon)
  document.title = createTitleFromMemoState(memoState)

  const memoPreviewElement = getRequiredElementById<HTMLParagraphElement>(MEMO_PREVIEW_ID)
  memoPreviewElement.textContent = createPreviewFromMemoState(memoState)

  const memoUrlElement = getRequiredElementById<HTMLParagraphElement>(MEMO_URL_ID)
  memoUrlElement.textContent = createShareUrlFromMemoState(memoState, window.location)

  updateSelectedIconButtons(normalizedFaviconIcon)
  updateFavicon(normalizedFaviconIcon)
  storeCurrentFaviconIcon(normalizedFaviconIcon)
}

const updateUrlSearch = (memoState: MemoState): void => {
  const nextSearch = createSearchFromMemoState(memoState)
  const nextUrl = `${window.location.pathname}${nextSearch}`
  window.history.replaceState({}, '', nextUrl)
}

const copyUrlToClipboard = async (): Promise<void> => {
  const memoUrlElement = getRequiredElementById<HTMLParagraphElement>(MEMO_URL_ID)
  const memoUrlCopyButtonElement = getRequiredElementById<HTMLButtonElement>(MEMO_URL_COPY_BUTTON_ID)
  const shareUrl = memoUrlElement.textContent ?? ''
  if (shareUrl.length === 0) {
    return
  }
  await navigator.clipboard.writeText(shareUrl)
  memoUrlCopyButtonElement.textContent = '✅ コピー済み'
  window.setTimeout(() => {
    memoUrlCopyButtonElement.textContent = '📋 コピー'
  }, 1200)
}

const setupMemoEditor = (): void => {
  renderIconButtons()

  const initialMemoState = readMemoStateFromSearch(window.location.search)
  const memoInputElement = getRequiredElementById<HTMLInputElement>(MEMO_INPUT_ID)
  const memoUrlCopyButtonElement = getRequiredElementById<HTMLButtonElement>(MEMO_URL_COPY_BUTTON_ID)
  const customIconToggleElement = getRequiredElementById<HTMLButtonElement>(MEMO_CUSTOM_ICON_TOGGLE_ID)
  const customIconDialogElement = getRequiredElementById<HTMLDialogElement>(MEMO_CUSTOM_ICON_DIALOG_ID)
  const customIconFormElement = getRequiredElementById<HTMLFormElement>(MEMO_CUSTOM_ICON_FORM_ID)
  const customIconInputElement = getRequiredElementById<HTMLInputElement>(MEMO_CUSTOM_ICON_INPUT_ID)
  const customIconCloseElement = getRequiredElementById<HTMLButtonElement>(MEMO_CUSTOM_ICON_CLOSE_ID)

  memoInputElement.value = initialMemoState.memoText

  const syncMemoState = (memoState: MemoState): void => {
    updateView(memoState)
    updateUrlSearch(memoState)
  }

  memoInputElement.addEventListener('input', (event) => {
    const target = event.currentTarget as HTMLInputElement
    syncMemoState({
      memoText: target.value,
      faviconIcon: readCurrentFaviconIcon(),
    })
  })

  memoUrlCopyButtonElement.addEventListener('click', () => {
    void copyUrlToClipboard()
  })

  customIconToggleElement.addEventListener('click', () => {
    clearCustomIconValidationMessage()
    customIconInputElement.value = readCurrentFaviconIcon()
    customIconDialogElement.showModal()
    customIconInputElement.focus()
  })

  customIconInputElement.addEventListener('input', (event) => {
    const target = event.currentTarget as HTMLInputElement
    validateCustomIcon(target.value)
  })

  customIconFormElement.addEventListener('submit', (event) => {
    event.preventDefault()
    const rawCustomIconValue = customIconInputElement.value.trim()
    if (!validateCustomIcon(rawCustomIconValue)) {
      return
    }
    syncMemoState({
      memoText: memoInputElement.value,
      faviconIcon: rawCustomIconValue,
    })
    customIconDialogElement.close()
  })

  customIconCloseElement.addEventListener('click', () => {
    customIconDialogElement.close()
  })

  FAVICON_OPTIONS.forEach((faviconOption, index) => {
    const iconButtonElement = getRequiredElementById<HTMLButtonElement>(createIconOptionElementId(index))
    iconButtonElement.addEventListener('click', () => {
      clearCustomIconValidationMessage()
      syncMemoState({
        memoText: memoInputElement.value,
        faviconIcon: faviconOption.icon,
      })
    })
  })

  syncMemoState(initialMemoState)
}

setupMemoEditor()
