import { createCustomIconValidationMessage, FAVICON_OPTIONS, isPresetFaviconIcon, normalizeFaviconIcon } from '../../lib/memo'
import type { PageElements } from './elements'
import type { PageConfig } from './page-config'
import type { StateService } from './state-service'
import { createIconOptionElementId } from './view'

type SetupIconPickerParameters = {
  initialFaviconIcon: string
  pageConfig: PageConfig
  pageElements: PageElements
  stateService: StateService
}

const ICON_ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const
const CUSTOM_ICON_BUTTON_ID_PREFIX = 'memo-custom-icon-option-'
const CUSTOM_ICON_BUTTON_DATASET_KEY = 'customIconValue'
const CUSTOM_ICON_BUTTON_IDS_DATASET_KEY = 'customIconButtonIds'

const createCustomIconButtonId = (customIconValue: string): string =>
  `${CUSTOM_ICON_BUTTON_ID_PREFIX}${encodeURIComponent(customIconValue)}`

const readCustomIconButtonIds = (pageElements: PageElements): string[] => {
  const serializedIds = pageElements.appRoot.dataset[CUSTOM_ICON_BUTTON_IDS_DATASET_KEY]
  return serializedIds === undefined || serializedIds.length === 0 ? [] : serializedIds.split(',')
}

const writeCustomIconButtonIds = (pageElements: PageElements, iconButtonIds: string[]): void => {
  pageElements.appRoot.dataset[CUSTOM_ICON_BUTTON_IDS_DATASET_KEY] = iconButtonIds.join(',')
}

const getPresetIconButtonElements = (): HTMLButtonElement[] =>
  FAVICON_OPTIONS.map((_, index) => document.getElementById(createIconOptionElementId(index)) as HTMLButtonElement)

const getCustomIconButtonElements = (pageElements: PageElements): HTMLButtonElement[] =>
  readCustomIconButtonIds(pageElements)
    .map((buttonId) => document.getElementById(buttonId))
    .filter((buttonElement): buttonElement is HTMLButtonElement => buttonElement instanceof HTMLButtonElement)

const getIconNavigationButtonElements = (pageElements: PageElements): HTMLButtonElement[] => [
  ...getPresetIconButtonElements(),
  ...getCustomIconButtonElements(pageElements),
  pageElements.memoCustomIconToggleButton,
]

const getIconColumnCount = (pageElements: PageElements): number => {
  const iconItemElements = Array.from(pageElements.memoIconList.children).filter((iconItemElement): iconItemElement is HTMLElement =>
    iconItemElement instanceof HTMLElement,
  )
  const firstItemTop = iconItemElements[0]?.offsetTop
  if (firstItemTop === undefined) {
    return 1
  }

  const firstRowItemCount = iconItemElements.findIndex((iconItemElement) => iconItemElement.offsetTop !== firstItemTop)
  return firstRowItemCount > 0 ? firstRowItemCount : iconItemElements.length
}

const findNextIconButtonIndex = (
  pageElements: PageElements,
  currentIndex: number,
  key: (typeof ICON_ARROW_KEYS)[number],
): number => {
  const columnCount = getIconColumnCount(pageElements)
  const lastIndex = getIconNavigationButtonElements(pageElements).length - 1

  if (key === 'ArrowRight') {
    return currentIndex < lastIndex ? currentIndex + 1 : currentIndex
  }

  if (key === 'ArrowLeft') {
    return currentIndex > 0 ? currentIndex - 1 : currentIndex
  }

  if (key === 'ArrowDown') {
    return Math.min(currentIndex + columnCount, lastIndex)
  }

  if (key === 'ArrowUp') {
    return Math.max(currentIndex - columnCount, 0)
  }

  return currentIndex
}

const createUpdateSelectedIconButtons = (pageElements: PageElements) => (selectedIcon: string): void => {
  FAVICON_OPTIONS.forEach((faviconOption, index) => {
    const iconButtonElement = document.getElementById(createIconOptionElementId(index))
    if (iconButtonElement instanceof HTMLButtonElement) {
      iconButtonElement.setAttribute('aria-pressed', `${faviconOption.icon === selectedIcon}`)
    }
  })

  getCustomIconButtonElements(pageElements).forEach((iconButtonElement) => {
    const customIconValue = iconButtonElement.dataset[CUSTOM_ICON_BUTTON_DATASET_KEY] ?? ''
    iconButtonElement.setAttribute('aria-pressed', `${customIconValue === selectedIcon}`)
  })

  const hasCustomOptionButton = getCustomIconButtonElements(pageElements).some(
    (iconButtonElement) => iconButtonElement.dataset[CUSTOM_ICON_BUTTON_DATASET_KEY] === selectedIcon,
  )
  const isCustomIcon = !isPresetFaviconIcon(selectedIcon)
  pageElements.memoCustomIconToggleButton.setAttribute('aria-pressed', `${hasCustomOptionButton ? false : isCustomIcon}`)

  const presetIndex = FAVICON_OPTIONS.findIndex((faviconOption) => faviconOption.icon === selectedIcon)
  const customIconIndex = getCustomIconButtonElements(pageElements).findIndex(
    (iconButtonElement) => iconButtonElement.dataset[CUSTOM_ICON_BUTTON_DATASET_KEY] === selectedIcon,
  )
  const activeIndex =
    presetIndex >= 0
      ? presetIndex
      : customIconIndex >= 0
        ? FAVICON_OPTIONS.length + customIconIndex
        : getIconNavigationButtonElements(pageElements).length - 1

  getIconNavigationButtonElements(pageElements).forEach((iconButtonElement, index) => {
    iconButtonElement.tabIndex = index === activeIndex ? 0 : -1
  })
}

const createCustomIconMessage = (iconValue: string, pageConfig: PageConfig): string =>
  createCustomIconValidationMessage(iconValue, {
    empty: pageConfig.customValidationEmpty,
    multiple: pageConfig.customValidationMultiple,
  })

export const setupIconPicker = ({ initialFaviconIcon, pageConfig, pageElements, stateService }: SetupIconPickerParameters): void => {
  writeCustomIconButtonIds(pageElements, [])

  const onCustomOptionClick = (event: Event): void => {
    const customIconButtonElement = event.currentTarget instanceof HTMLButtonElement ? event.currentTarget : null
    const customIconValue = customIconButtonElement?.dataset[CUSTOM_ICON_BUTTON_DATASET_KEY]
    if (customIconValue === undefined) {
      return
    }

    stateService.clearCustomIconValidationMessage()
    stateService.syncMemoState({
      memoText: pageElements.memoInput.value,
      faviconIcon: customIconValue,
    })
  }

  const onCustomOptionKeyDown = (event: KeyboardEvent): void => {
    if (!ICON_ARROW_KEYS.includes(event.key as (typeof ICON_ARROW_KEYS)[number])) {
      return
    }

    event.preventDefault()

    const currentCustomIconIndex = getCustomIconButtonElements(pageElements).findIndex(
      (iconButtonElement) => iconButtonElement === event.currentTarget,
    )
    const customOptionIndex = FAVICON_OPTIONS.length + currentCustomIconIndex
    const nextIndex = findNextIconButtonIndex(pageElements, customOptionIndex, event.key as (typeof ICON_ARROW_KEYS)[number])
    getIconNavigationButtonElements(pageElements)[nextIndex]?.focus()
  }

  const attachCustomIconButtonHandlers = (iconButtonElement: HTMLButtonElement): void => {
    iconButtonElement.addEventListener('click', onCustomOptionClick)
    iconButtonElement.addEventListener('keydown', onCustomOptionKeyDown)
  }

  const ensureCustomIconButton = (customIconValue: string): HTMLButtonElement => {
    const normalizedCustomIconValue = normalizeFaviconIcon(customIconValue)
    const existingIconButtonElement = getCustomIconButtonElements(pageElements).find(
      (iconButtonElement) => iconButtonElement.dataset[CUSTOM_ICON_BUTTON_DATASET_KEY] === normalizedCustomIconValue,
    )
    if (existingIconButtonElement !== undefined) {
      return existingIconButtonElement
    }

    const customIconButtonId = createCustomIconButtonId(normalizedCustomIconValue)
    const customIconItemElement = document.createElement('li')
    customIconItemElement.className = 'memo-card__icon-item'

    const customIconButtonElement = document.createElement('button')
    customIconButtonElement.id = customIconButtonId
    customIconButtonElement.className = 'memo-card__icon-button'
    customIconButtonElement.type = 'button'
    customIconButtonElement.textContent = normalizedCustomIconValue
    customIconButtonElement.dataset[CUSTOM_ICON_BUTTON_DATASET_KEY] = normalizedCustomIconValue
    customIconButtonElement.setAttribute('aria-label', `${normalizedCustomIconValue} の任意アイコンを選択`)
    customIconButtonElement.setAttribute('aria-pressed', 'false')
    customIconButtonElement.tabIndex = -1

    customIconItemElement.append(customIconButtonElement)
    pageElements.memoIconList.insertBefore(customIconItemElement, pageElements.memoCustomIconToggleItem)
    writeCustomIconButtonIds(pageElements, [...readCustomIconButtonIds(pageElements), customIconButtonId])
    attachCustomIconButtonHandlers(customIconButtonElement)
    return customIconButtonElement
  }

  if (!isPresetFaviconIcon(initialFaviconIcon)) {
    ensureCustomIconButton(initialFaviconIcon)
  }

  const updateSelectedIconButtons = createUpdateSelectedIconButtons(pageElements)
  stateService.setSelectedIconButtonUpdater(updateSelectedIconButtons)

  const onCustomToggleClick = (): void => {
    stateService.clearCustomIconValidationMessage()
    pageElements.memoCustomIconInput.value = stateService.readCurrentMemoState().faviconIcon
    pageElements.memoCustomIconDialog.showModal()
    pageElements.memoCustomIconInput.focus()
  }

  const onCustomCloseClick = (): void => {
    pageElements.memoCustomIconDialog.close()
  }

  const onCustomInput = (): void => {
    const validationMessage = createCustomIconMessage(pageElements.memoCustomIconInput.value, pageConfig)
    if (validationMessage.length === 0) {
      stateService.clearCustomIconValidationMessage()
      return
    }

    stateService.setCustomIconValidationMessage(validationMessage)
  }

  const onCustomSubmit = (event: Event): void => {
    event.preventDefault()
    const validationMessage = createCustomIconMessage(pageElements.memoCustomIconInput.value, pageConfig)
    if (validationMessage.length > 0) {
      stateService.setCustomIconValidationMessage(validationMessage)
      return
    }

    stateService.clearCustomIconValidationMessage()

    if (!isPresetFaviconIcon(pageElements.memoCustomIconInput.value)) {
      ensureCustomIconButton(pageElements.memoCustomIconInput.value)
    }

    stateService.syncMemoState({
      memoText: pageElements.memoInput.value,
      faviconIcon: pageElements.memoCustomIconInput.value,
    })
    pageElements.memoCustomIconDialog.close()
  }

  FAVICON_OPTIONS.forEach((faviconOption, index) => {
    const iconButtonElement = document.getElementById(createIconOptionElementId(index))
    if (!(iconButtonElement instanceof HTMLButtonElement)) {
      return
    }

    const onPresetClick = (): void => {
      stateService.clearCustomIconValidationMessage()
      stateService.syncMemoState({
        memoText: pageElements.memoInput.value,
        faviconIcon: faviconOption.icon,
      })
    }

    const onPresetKeyDown = (event: KeyboardEvent): void => {
      if (!ICON_ARROW_KEYS.includes(event.key as (typeof ICON_ARROW_KEYS)[number])) {
        return
      }

      event.preventDefault()
      stateService.clearCustomIconValidationMessage()

      const nextIndex = findNextIconButtonIndex(pageElements, index, event.key as (typeof ICON_ARROW_KEYS)[number])
      const nextPresetIcon = FAVICON_OPTIONS[nextIndex]

      if (nextPresetIcon === undefined) {
        getIconNavigationButtonElements(pageElements)[nextIndex]?.focus()
        return
      }

      stateService.syncMemoState({
        memoText: pageElements.memoInput.value,
        faviconIcon: nextPresetIcon.icon,
      })
      getIconNavigationButtonElements(pageElements)[nextIndex]?.focus()
    }

    iconButtonElement.addEventListener('click', onPresetClick)
    iconButtonElement.addEventListener('keydown', onPresetKeyDown)
  })

  const onCustomToggleKeyDown = (event: KeyboardEvent): void => {
    if (!ICON_ARROW_KEYS.includes(event.key as (typeof ICON_ARROW_KEYS)[number])) {
      return
    }

    event.preventDefault()
    const nextIndex = findNextIconButtonIndex(pageElements, FAVICON_OPTIONS.length, event.key as (typeof ICON_ARROW_KEYS)[number])
    getIconNavigationButtonElements(pageElements)[nextIndex]?.focus()
  }

  pageElements.memoCustomIconToggleButton.addEventListener('click', onCustomToggleClick)
  pageElements.memoCustomIconToggleButton.addEventListener('keydown', onCustomToggleKeyDown)
  pageElements.memoCustomIconCloseButton.addEventListener('click', onCustomCloseClick)
  pageElements.memoCustomIconInput.addEventListener('input', onCustomInput)
  pageElements.memoCustomIconForm.addEventListener('submit', onCustomSubmit)
}
