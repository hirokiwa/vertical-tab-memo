import { getRequiredElementById } from '../../shared/dom'
import { elementIds } from './view'

export type PageElements = {
  appRoot: HTMLDivElement
  faviconLink: HTMLLinkElement
  memoEditor: HTMLDivElement
  memoCharacterCount: HTMLParagraphElement
  memoInput: HTMLInputElement
  memoIconList: HTMLUListElement
  memoPreviewIcon: HTMLSpanElement
  memoUrlCopyButton: HTMLButtonElement
  memoUrlCopyIconPath: SVGPathElement
  memoShareXButton: HTMLButtonElement
  memoShareLineButton: HTMLButtonElement
  memoShareNativeButton: HTMLButtonElement
  memoCustomIconToggleButton: HTMLButtonElement
  memoCustomIconToggleItem: HTMLLIElement
  memoCustomIconDialog: HTMLDialogElement
  memoCustomIconForm: HTMLFormElement
  memoCustomIconInput: HTMLInputElement
  memoCustomIconError: HTMLParagraphElement
  memoCustomIconCloseButton: HTMLButtonElement
}

export const getPageElements = (): PageElements => ({
  appRoot: getRequiredElementById<HTMLDivElement>(elementIds.appRoot),
  faviconLink: getRequiredElementById<HTMLLinkElement>(elementIds.faviconLink),
  memoEditor: getRequiredElementById<HTMLDivElement>(elementIds.memoEditor),
  memoCharacterCount: getRequiredElementById<HTMLParagraphElement>(elementIds.memoCharacterCount),
  memoInput: getRequiredElementById<HTMLInputElement>(elementIds.memoInput),
  memoIconList: getRequiredElementById<HTMLUListElement>(elementIds.memoIconList),
  memoPreviewIcon: getRequiredElementById<HTMLSpanElement>(elementIds.memoPreviewIcon),
  memoUrlCopyButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoUrlCopy),
  memoUrlCopyIconPath: document.getElementById(elementIds.memoUrlCopyIcon)?.querySelector('path') as SVGPathElement,
  memoShareXButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoShareX),
  memoShareLineButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoShareLine),
  memoShareNativeButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoShareNative),
  memoCustomIconToggleButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoCustomIconToggle),
  memoCustomIconToggleItem: getRequiredElementById<HTMLLIElement>(elementIds.memoCustomIconToggleItem),
  memoCustomIconDialog: getRequiredElementById<HTMLDialogElement>(elementIds.memoCustomIconDialog),
  memoCustomIconForm: getRequiredElementById<HTMLFormElement>(elementIds.memoCustomIconForm),
  memoCustomIconInput: getRequiredElementById<HTMLInputElement>(elementIds.memoCustomIconInput),
  memoCustomIconError: getRequiredElementById<HTMLParagraphElement>(elementIds.memoCustomIconError),
  memoCustomIconCloseButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoCustomIconClose),
})
