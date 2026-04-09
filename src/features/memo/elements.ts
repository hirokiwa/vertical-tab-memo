import { getRequiredElementById } from '../../shared/dom'
import { elementIds } from './view'

export type PageElements = {
  appRoot: HTMLDivElement
  faviconLink: HTMLLinkElement
  memoForm: HTMLFormElement
  memoInput: HTMLInputElement
  memoIconList: HTMLUListElement
  memoPreview: HTMLParagraphElement
  memoUrl: HTMLParagraphElement
  memoUrlCopyButton: HTMLButtonElement
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
  memoForm: getRequiredElementById<HTMLFormElement>(elementIds.memoForm),
  memoInput: getRequiredElementById<HTMLInputElement>(elementIds.memoInput),
  memoIconList: getRequiredElementById<HTMLUListElement>(elementIds.memoIconList),
  memoPreview: getRequiredElementById<HTMLParagraphElement>(elementIds.memoPreview),
  memoUrl: getRequiredElementById<HTMLParagraphElement>(elementIds.memoUrl),
  memoUrlCopyButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoUrlCopy),
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
