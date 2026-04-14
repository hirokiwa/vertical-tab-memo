import { getRequiredElementById } from '../../shared/dom'
import { elementIds } from './view'

export type PageElements = {
  appRoot: HTMLDivElement
  faviconLink: HTMLLinkElement
  faviconPngLink: HTMLLinkElement
  shortcutIconLink: HTMLLinkElement
  appleTouchIconLink: HTMLLinkElement
  appleMobileWebAppTitleMeta: HTMLMetaElement
  manifestLink: HTMLLinkElement
  memoEditor: HTMLDivElement
  memoCharacterCount: HTMLParagraphElement
  memoInput: HTMLInputElement
  memoIconList: HTMLUListElement
  memoPreviewIcon: HTMLSpanElement
  memoUrlCopyButton: HTMLButtonElement
  memoUrlCopyIconPath: SVGPathElement
  memoShareXLink: HTMLAnchorElement
  memoShareLineLink: HTMLAnchorElement
  memoShareNativeButton: HTMLButtonElement
  memoLanguageSwitchLink: HTMLAnchorElement
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
  faviconPngLink: getRequiredElementById<HTMLLinkElement>(elementIds.faviconPngLink),
  shortcutIconLink: getRequiredElementById<HTMLLinkElement>(elementIds.shortcutIconLink),
  appleTouchIconLink: getRequiredElementById<HTMLLinkElement>(elementIds.appleTouchIconLink),
  appleMobileWebAppTitleMeta: getRequiredElementById<HTMLMetaElement>(elementIds.appleMobileWebAppTitleMeta),
  manifestLink: getRequiredElementById<HTMLLinkElement>(elementIds.manifestLink),
  memoEditor: getRequiredElementById<HTMLDivElement>(elementIds.memoEditor),
  memoCharacterCount: getRequiredElementById<HTMLParagraphElement>(elementIds.memoCharacterCount),
  memoInput: getRequiredElementById<HTMLInputElement>(elementIds.memoInput),
  memoIconList: getRequiredElementById<HTMLUListElement>(elementIds.memoIconList),
  memoPreviewIcon: getRequiredElementById<HTMLSpanElement>(elementIds.memoPreviewIcon),
  memoUrlCopyButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoUrlCopy),
  memoUrlCopyIconPath: document.getElementById(elementIds.memoUrlCopyIcon)?.querySelector('path') as SVGPathElement,
  memoShareXLink: getRequiredElementById<HTMLAnchorElement>(elementIds.memoShareX),
  memoShareLineLink: getRequiredElementById<HTMLAnchorElement>(elementIds.memoShareLine),
  memoShareNativeButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoShareNative),
  memoLanguageSwitchLink: getRequiredElementById<HTMLAnchorElement>(elementIds.memoLanguageSwitch),
  memoCustomIconToggleButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoCustomIconToggle),
  memoCustomIconToggleItem: getRequiredElementById<HTMLLIElement>(elementIds.memoCustomIconToggleItem),
  memoCustomIconDialog: getRequiredElementById<HTMLDialogElement>(elementIds.memoCustomIconDialog),
  memoCustomIconForm: getRequiredElementById<HTMLFormElement>(elementIds.memoCustomIconForm),
  memoCustomIconInput: getRequiredElementById<HTMLInputElement>(elementIds.memoCustomIconInput),
  memoCustomIconError: getRequiredElementById<HTMLParagraphElement>(elementIds.memoCustomIconError),
  memoCustomIconCloseButton: getRequiredElementById<HTMLButtonElement>(elementIds.memoCustomIconClose),
})
