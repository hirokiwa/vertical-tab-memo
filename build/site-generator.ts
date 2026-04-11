import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

type Locale = 'ja' | 'en'
type SiteMessages = {
  site: {
    siteName: string
    siteUrl: string
    homePath: string
    contactPath: string
    privacyPath: string
    twitterSite: string
    xIconUrl: string
    lineIconUrl: string
    contactFormUrl: string
    contactEmail: string
    operatorName: string
  }
  iconOptions: Array<{
    icon: string
    ja: string
    en: string
  }>
  locales: Record<Locale, unknown>
}

type CommonMessagesFile = {
  site: SiteMessages['site']
  iconOptions: SiteMessages['iconOptions']
  locales: Record<
    Locale,
    Pick<
      LocaleMessages,
      | 'htmlLang'
      | 'ogLocale'
      | 'ogImageUrl'
      | 'ogSiteName'
      | 'switchLabel'
      | 'switchLocale'
      | 'switchAriaLabel'
      | 'languageNavLabel'
      | 'iconSectionAriaLabel'
      | 'shareGroupAriaLabel'
      | 'customDialogFormAriaLabel'
      | 'adSectionAriaLabel'
      | 'homeFooterAriaLabel'
      | 'homeFooterNavAriaLabel'
      | 'contactFooterNavAriaLabel'
      | 'privacyFooterNavAriaLabel'
    >
  >
}

type HomeMessagesFile = {
  locales: Record<Locale, { memo: Omit<LocaleMessages['memo'], 'share'>; home: LocaleMessages['home'] }>
}

type ContactMessagesFile = {
  locales: Record<Locale, { contact: LocaleMessages['contact'] }>
}

type PrivacyMessagesFile = {
  locales: Record<Locale, { privacy: LocaleMessages['privacy'] }>
}

type ShareMessagesFile = {
  locales: Record<Locale, { share: LocaleMessages['memo']['share'] }>
}

type RichTextPart = {
  type: 'text' | 'link'
  value?: string
  href?: string
  label?: string
}

type PrivacyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'unorderedList'; items: string[] }
  | { type: 'orderedList'; items: string[] }
  | { type: 'subheading'; text: string }
  | { type: 'richParagraph'; parts: RichTextPart[] }
  | {
      type: 'contactList'
      rows: Array<{
        term: string
        description?: string
        descriptionLink?: { href: string; label: string }
      }>
    }

type PrivacySection = {
  id: string
  title: string
  blocks: PrivacyBlock[]
}

type LocaleMessages = {
  htmlLang: string
  ogLocale: string
  ogImageUrl: string
  ogSiteName: string
  switchLabel: string
  switchLocale: Locale
  switchAriaLabel: string
  languageNavLabel: string
  iconSectionAriaLabel: string
  shareGroupAriaLabel: string
  customDialogFormAriaLabel: string
  adSectionAriaLabel: string
  homeFooterAriaLabel: string
  homeFooterNavAriaLabel: string
  contactFooterNavAriaLabel: string
  privacyFooterNavAriaLabel: string
  memo: {
    fallbackText: string
    editorTitle: string
    placeholder: string
    iconTitle: string
    shareTitle: string
    shareNote: string
    copyLabel: string
    copyAriaLabel: string
    nativeLabel: string
    nativeAriaLabel: string
    xLabel: string
    xAriaLabel: string
    lineLabel: string
    lineAriaLabel: string
    customDialogTitle: string
    customInputLabel: string
    customToggleAriaLabel: string
    customCloseLabel: string
    customSaveLabel: string
    customValidationEmpty: string
    customValidationMultiple: string
    share: {
      xTemplate: string
      lineTemplate: string
      webShareTitle: string
      webShareText: string
    }
  }
  home: {
    metaTitle: string
    metaDescription: string
    pageTitle: string
    pageDescription: string
    footerHome: string
    footerContact: string
    footerPrivacy: string
  }
  contact: {
    metaTitle: string
    metaDescription: string
    title: string
    lead: string
    mailTitle: string
    formTitle: string
    formFrameTitle: string
    formFallback: string
    footerHome: string
    footerPrivacy: string
  }
  privacy: {
    metaTitle: string
    metaDescription: string
    title: string
    lead: string
    sections: PrivacySection[]
    footerHome: string
    footerContact: string
  }
}

type GeneratedPagePaths = {
  generatedRoot: string
  inputs: Record<string, string>
  routes: Record<string, string>
}

const ensureDirectory = (directoryPath: string): void => {
  mkdirSync(directoryPath, { recursive: true })
}

const readTextFile = (filePath: string): string => readFileSync(filePath, 'utf-8')

const writeGeneratedFile = (filePath: string, contents: string): void => {
  ensureDirectory(dirname(filePath))
  writeFileSync(filePath, contents)
}

const readJsonFile = <Value>(filePath: string): Value => JSON.parse(readTextFile(filePath)) as Value

const readMessages = (projectRoot: string): SiteMessages => {
  const commonMessages = readJsonFile<CommonMessagesFile>(resolve(projectRoot, 'src/i18n/common.json'))
  const homeMessages = readJsonFile<HomeMessagesFile>(resolve(projectRoot, 'src/i18n/home.json'))
  const contactMessages = readJsonFile<ContactMessagesFile>(resolve(projectRoot, 'src/i18n/contact.json'))
  const privacyMessages = readJsonFile<PrivacyMessagesFile>(resolve(projectRoot, 'src/i18n/privacy.json'))
  const shareMessages = readJsonFile<ShareMessagesFile>(resolve(projectRoot, 'src/i18n/share.json'))

  return {
    site: commonMessages.site,
    iconOptions: commonMessages.iconOptions,
    locales: {
      ja: {
        ...commonMessages.locales.ja,
        ...homeMessages.locales.ja,
        ...contactMessages.locales.ja,
        ...privacyMessages.locales.ja,
        memo: {
          ...homeMessages.locales.ja.memo,
          share: shareMessages.locales.ja.share,
        },
      },
      en: {
        ...commonMessages.locales.en,
        ...homeMessages.locales.en,
        ...contactMessages.locales.en,
        ...privacyMessages.locales.en,
        memo: {
          ...homeMessages.locales.en.memo,
          share: shareMessages.locales.en.share,
        },
      },
    },
  }
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const replaceTemplateTokens = (template: string, replacements: Record<string, string>): string =>
  Object.entries(replacements).reduce(
    (currentTemplate, [token, value]) => currentTemplate.replaceAll(`{{${token}}}`, value),
    template,
  )

const normalizePath = (pathValue: string): string => (pathValue.endsWith('/') ? pathValue : `${pathValue}/`)

const createLocalizedPath = (locale: Locale, pathValue: string): string => {
  const normalizedPath = normalizePath(pathValue)
  return locale === 'ja' || locale === 'en'
    ? `/${locale}${normalizedPath === '/' ? '/' : normalizedPath}`
    : normalizedPath
}

const createAbsoluteUrl = (siteUrl: string, pathValue: string): string => {
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
  return `${normalizedSiteUrl}${pathValue}`
}

const createSocialMetaReplacements = (
  messages: SiteMessages,
  localeMessages: LocaleMessages,
  pageTitle: string,
  pageDescription: string,
  pagePath: string,
): Record<string, string> => ({
  OG_TITLE: escapeHtml(pageTitle),
  OG_URL: escapeHtml(createAbsoluteUrl(messages.site.siteUrl, pagePath)),
  OG_IMAGE_URL: escapeHtml(localeMessages.ogImageUrl),
  OG_DESCRIPTION: escapeHtml(pageDescription),
  OG_SITE_NAME: escapeHtml(localeMessages.ogSiteName),
  OG_LOCALE: escapeHtml(localeMessages.ogLocale),
  TWITTER_SITE: escapeHtml(messages.site.twitterSite),
  TWITTER_TITLE: escapeHtml(pageTitle),
  TWITTER_DESCRIPTION: escapeHtml(pageDescription),
  TWITTER_IMAGE_URL: escapeHtml(localeMessages.ogImageUrl),
})

const createHomeConfigJson = (localeMessages: LocaleMessages): string =>
  JSON.stringify({
    fallbackMemoText: localeMessages.memo.fallbackText,
    customValidationEmpty: localeMessages.memo.customValidationEmpty,
    customValidationMultiple: localeMessages.memo.customValidationMultiple,
    share: localeMessages.memo.share,
  }).replaceAll('</script', '<\\/script')

const resolveInternalHref = (locale: Locale, href: string): string => {
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
    return href
  }

  return createLocalizedPath(locale, href)
}

const createLocalizedPage = (
  template: string,
  replacements: Record<string, string>,
): string => replaceTemplateTokens(template, replacements)

const createIconOptionReplacements = (messages: SiteMessages, locale: Locale): Record<string, string> =>
  Object.fromEntries(
    messages.iconOptions.map((iconOption, index) => [
      `ICON_OPTION_${index}_ARIA_LABEL`,
      escapeHtml(`${iconOption[locale]} ${locale === 'ja' ? 'アイコンを選択' : 'icon'}`),
    ]),
  )

const readParagraphText = (block: PrivacyBlock): string => (block.type === 'paragraph' ? block.text : '')

const readSubheadingText = (block: PrivacyBlock): string => (block.type === 'subheading' ? block.text : '')

const readListItemText = (block: PrivacyBlock, index: number): string =>
  block.type === 'unorderedList' || block.type === 'orderedList' ? (block.items[index] ?? '') : ''

const readRichTextValue = (block: PrivacyBlock, index: number): RichTextPart =>
  block.type === 'richParagraph' ? (block.parts[index] ?? { type: 'text', value: '' }) : { type: 'text', value: '' }

const readContactRow = (
  block: PrivacyBlock,
  index: number,
): { term: string; description?: string; descriptionLink?: { href: string; label: string } } =>
  block.type === 'contactList' ? (block.rows[index] ?? { term: '' }) : { term: '' }

const createPrivacyReplacements = (localeMessages: LocaleMessages, locale: Locale): Record<string, string> => {
  const section1 = localeMessages.privacy.sections[0]
  const section2 = localeMessages.privacy.sections[1]
  const section3 = localeMessages.privacy.sections[2]
  const section4 = localeMessages.privacy.sections[3]
  const section5 = localeMessages.privacy.sections[4]
  const section6 = localeMessages.privacy.sections[5]
  const section7 = localeMessages.privacy.sections[6]
  const section8 = localeMessages.privacy.sections[7]
  const section9 = localeMessages.privacy.sections[8]
  const section10 = localeMessages.privacy.sections[9]
  const section3RichParagraph1Part1 = readRichTextValue(section3.blocks[2], 1)
  const section3RichParagraph1Part3 = readRichTextValue(section3.blocks[2], 3)
  const section3RichParagraph1Part5 = readRichTextValue(section3.blocks[2], 5)
  const section3RichParagraph2Part1 = readRichTextValue(section3.blocks[4], 1)
  const section10ContactRow3 = readContactRow(section10.blocks[1], 2)
  const section10RichParagraphLink = readRichTextValue(section10.blocks[2], 1)

  return {
    PRIVACY_SECTION_1_TITLE: escapeHtml(section1.title),
    PRIVACY_SECTION_1_PARAGRAPH_1: escapeHtml(readParagraphText(section1.blocks[0])),
    PRIVACY_SECTION_2_TITLE: escapeHtml(section2.title),
    PRIVACY_SECTION_2_LIST_ITEM_1: escapeHtml(readListItemText(section2.blocks[0], 0)),
    PRIVACY_SECTION_2_LIST_ITEM_2: escapeHtml(readListItemText(section2.blocks[0], 1)),
    PRIVACY_SECTION_2_PARAGRAPH_1: escapeHtml(readParagraphText(section2.blocks[1])),
    PRIVACY_SECTION_3_TITLE: escapeHtml(section3.title),
    PRIVACY_SECTION_3_SUBHEADING_1: escapeHtml(readSubheadingText(section3.blocks[0])),
    PRIVACY_SECTION_3_PARAGRAPH_1: escapeHtml(readParagraphText(section3.blocks[1])),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_PREFIX: escapeHtml(readRichTextValue(section3.blocks[2], 0).value ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_LINK_1_HREF: resolveInternalHref(locale, section3RichParagraph1Part1.href ?? '#'),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_LINK_1_LABEL: escapeHtml(section3RichParagraph1Part1.label ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_MIDDLE_1: escapeHtml(readRichTextValue(section3.blocks[2], 2).value ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_LINK_2_HREF: resolveInternalHref(locale, section3RichParagraph1Part3.href ?? '#'),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_LINK_2_LABEL: escapeHtml(section3RichParagraph1Part3.label ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_MIDDLE_2: escapeHtml(readRichTextValue(section3.blocks[2], 4).value ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_LINK_3_HREF: resolveInternalHref(locale, section3RichParagraph1Part5.href ?? '#'),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_LINK_3_LABEL: escapeHtml(section3RichParagraph1Part5.label ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_1_SUFFIX: escapeHtml(readRichTextValue(section3.blocks[2], 6).value ?? ''),
    PRIVACY_SECTION_3_SUBHEADING_2: escapeHtml(readSubheadingText(section3.blocks[3])),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_2_PREFIX: escapeHtml(readRichTextValue(section3.blocks[4], 0).value ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_2_LINK_1_HREF: resolveInternalHref(locale, section3RichParagraph2Part1.href ?? '#'),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_2_LINK_1_LABEL: escapeHtml(section3RichParagraph2Part1.label ?? ''),
    PRIVACY_SECTION_3_RICH_PARAGRAPH_2_SUFFIX: escapeHtml(readRichTextValue(section3.blocks[4], 2).value ?? ''),
    PRIVACY_SECTION_4_TITLE: escapeHtml(section4.title),
    PRIVACY_SECTION_4_PARAGRAPH_1: escapeHtml(readParagraphText(section4.blocks[0])),
    PRIVACY_SECTION_4_PARAGRAPH_2: escapeHtml(readParagraphText(section4.blocks[1])),
    PRIVACY_SECTION_5_TITLE: escapeHtml(section5.title),
    PRIVACY_SECTION_5_LIST_ITEM_1: escapeHtml(readListItemText(section5.blocks[0], 0)),
    PRIVACY_SECTION_5_LIST_ITEM_2: escapeHtml(readListItemText(section5.blocks[0], 1)),
    PRIVACY_SECTION_5_LIST_ITEM_3: escapeHtml(readListItemText(section5.blocks[0], 2)),
    PRIVACY_SECTION_5_LIST_ITEM_4: escapeHtml(readListItemText(section5.blocks[0], 3)),
    PRIVACY_SECTION_5_LIST_ITEM_5: escapeHtml(readListItemText(section5.blocks[0], 4)),
    PRIVACY_SECTION_6_TITLE: escapeHtml(section6.title),
    PRIVACY_SECTION_6_PARAGRAPH_1: escapeHtml(readParagraphText(section6.blocks[0])),
    PRIVACY_SECTION_6_LIST_ITEM_1: escapeHtml(readListItemText(section6.blocks[1], 0)),
    PRIVACY_SECTION_6_LIST_ITEM_2: escapeHtml(readListItemText(section6.blocks[1], 1)),
    PRIVACY_SECTION_6_LIST_ITEM_3: escapeHtml(readListItemText(section6.blocks[1], 2)),
    PRIVACY_SECTION_6_PARAGRAPH_2: escapeHtml(readParagraphText(section6.blocks[2])),
    PRIVACY_SECTION_7_TITLE: escapeHtml(section7.title),
    PRIVACY_SECTION_7_PARAGRAPH_1: escapeHtml(readParagraphText(section7.blocks[0])),
    PRIVACY_SECTION_7_PARAGRAPH_2: escapeHtml(readParagraphText(section7.blocks[1])),
    PRIVACY_SECTION_8_TITLE: escapeHtml(section8.title),
    PRIVACY_SECTION_8_PARAGRAPH_1: escapeHtml(readParagraphText(section8.blocks[0])),
    PRIVACY_SECTION_8_PARAGRAPH_2: escapeHtml(readParagraphText(section8.blocks[1])),
    PRIVACY_SECTION_9_TITLE: escapeHtml(section9.title),
    PRIVACY_SECTION_9_PARAGRAPH_1: escapeHtml(readParagraphText(section9.blocks[0])),
    PRIVACY_SECTION_9_PARAGRAPH_2: escapeHtml(readParagraphText(section9.blocks[1])),
    PRIVACY_SECTION_10_TITLE: escapeHtml(section10.title),
    PRIVACY_SECTION_10_PARAGRAPH_1: escapeHtml(readParagraphText(section10.blocks[0])),
    PRIVACY_SECTION_10_CONTACT_TERM_1: escapeHtml(readContactRow(section10.blocks[1], 0).term),
    PRIVACY_SECTION_10_CONTACT_DESCRIPTION_1: escapeHtml(readContactRow(section10.blocks[1], 0).description ?? ''),
    PRIVACY_SECTION_10_CONTACT_TERM_2: escapeHtml(readContactRow(section10.blocks[1], 1).term),
    PRIVACY_SECTION_10_CONTACT_DESCRIPTION_2: escapeHtml(readContactRow(section10.blocks[1], 1).description ?? ''),
    PRIVACY_SECTION_10_CONTACT_TERM_3: escapeHtml(section10ContactRow3.term),
    PRIVACY_SECTION_10_CONTACT_LINK_HREF: section10ContactRow3.descriptionLink?.href ?? '#',
    PRIVACY_SECTION_10_CONTACT_LINK_LABEL: escapeHtml(section10ContactRow3.descriptionLink?.label ?? ''),
    PRIVACY_SECTION_10_RICH_PARAGRAPH_PREFIX: escapeHtml(readRichTextValue(section10.blocks[2], 0).value ?? ''),
    PRIVACY_SECTION_10_RICH_PARAGRAPH_LINK_HREF: resolveInternalHref(locale, section10RichParagraphLink.href ?? '#'),
    PRIVACY_SECTION_10_RICH_PARAGRAPH_LINK_LABEL: escapeHtml(section10RichParagraphLink.label ?? ''),
    PRIVACY_SECTION_10_RICH_PARAGRAPH_SUFFIX: escapeHtml(readRichTextValue(section10.blocks[2], 2).value ?? ''),
  }
}

const createHomePage = (
  template: string,
  messages: SiteMessages,
  locale: Locale,
  localeMessages: LocaleMessages,
): string => {
  const switchPath = createLocalizedPath(localeMessages.switchLocale, messages.site.homePath)
  const pagePath = createLocalizedPath(locale, messages.site.homePath)
  const iconOptionReplacements = createIconOptionReplacements(messages, locale)
  const socialMetaReplacements = createSocialMetaReplacements(
    messages,
    localeMessages,
    localeMessages.home.metaTitle,
    localeMessages.home.metaDescription,
    pagePath,
  )

  return createLocalizedPage(template, {
    HTML_LANG: localeMessages.htmlLang,
    META_DESCRIPTION: escapeHtml(localeMessages.home.metaDescription),
    META_TITLE: escapeHtml(localeMessages.home.metaTitle),
    SEO_LINKS: '',
    LANGUAGE_NAV_LABEL: escapeHtml(localeMessages.languageNavLabel),
    LANGUAGE_SWITCH_HREF: switchPath,
    LANGUAGE_SWITCH_LOCALE: localeMessages.switchLocale,
    LANGUAGE_SWITCH_ARIA_LABEL: escapeHtml(localeMessages.switchAriaLabel),
    LANGUAGE_SWITCH_LABEL: escapeHtml(localeMessages.switchLabel),
    PAGE_TITLE: escapeHtml(localeMessages.home.pageTitle),
    PAGE_DESCRIPTION: escapeHtml(localeMessages.home.pageDescription),
    EDITOR_TITLE: escapeHtml(localeMessages.memo.editorTitle),
    MEMO_PLACEHOLDER: escapeHtml(localeMessages.memo.placeholder),
    ICON_SECTION_ARIA_LABEL: escapeHtml(localeMessages.iconSectionAriaLabel),
    ICON_TITLE: escapeHtml(localeMessages.memo.iconTitle),
    CUSTOM_TOGGLE_ARIA_LABEL: escapeHtml(localeMessages.memo.customToggleAriaLabel),
    SHARE_TITLE: escapeHtml(localeMessages.memo.shareTitle),
    SHARE_GROUP_ARIA_LABEL: escapeHtml(localeMessages.shareGroupAriaLabel),
    SHARE_X_ARIA_LABEL: escapeHtml(localeMessages.memo.xAriaLabel),
    SHARE_X_LABEL: escapeHtml(localeMessages.memo.xLabel),
    SHARE_LINE_ARIA_LABEL: escapeHtml(localeMessages.memo.lineAriaLabel),
    SHARE_LINE_LABEL: escapeHtml(localeMessages.memo.lineLabel),
    COPY_ARIA_LABEL: escapeHtml(localeMessages.memo.copyAriaLabel),
    COPY_LABEL: escapeHtml(localeMessages.memo.copyLabel),
    SHARE_NATIVE_ARIA_LABEL: escapeHtml(localeMessages.memo.nativeAriaLabel),
    SHARE_NATIVE_LABEL: escapeHtml(localeMessages.memo.nativeLabel),
    SHARE_NOTE: escapeHtml(localeMessages.memo.shareNote),
    CUSTOM_DIALOG_ARIA_LABEL: escapeHtml(localeMessages.memo.customDialogTitle),
    CUSTOM_DIALOG_FORM_ARIA_LABEL: escapeHtml(localeMessages.customDialogFormAriaLabel),
    CUSTOM_DIALOG_TITLE: escapeHtml(localeMessages.memo.customDialogTitle),
    CUSTOM_INPUT_LABEL: escapeHtml(localeMessages.memo.customInputLabel),
    CUSTOM_CLOSE_ARIA_LABEL: escapeHtml(localeMessages.memo.customCloseLabel),
    CUSTOM_CLOSE_LABEL: escapeHtml(localeMessages.memo.customCloseLabel),
    CUSTOM_SAVE_ARIA_LABEL: escapeHtml(localeMessages.memo.customSaveLabel),
    CUSTOM_SAVE_LABEL: escapeHtml(localeMessages.memo.customSaveLabel),
    PAGE_CONFIG_JSON: createHomeConfigJson(localeMessages),
    AD_SECTION_ARIA_LABEL: escapeHtml(localeMessages.adSectionAriaLabel),
    FOOTER_ARIA_LABEL: escapeHtml(localeMessages.homeFooterAriaLabel),
    FOOTER_NAV_ARIA_LABEL: escapeHtml(localeMessages.homeFooterNavAriaLabel),
    HOME_LINK_HREF: createLocalizedPath(locale, messages.site.homePath),
    HOME_LINK_TEXT: escapeHtml(localeMessages.home.footerHome),
    CONTACT_LINK_HREF: createLocalizedPath(locale, messages.site.contactPath),
    CONTACT_LINK_TEXT: escapeHtml(localeMessages.home.footerContact),
    PRIVACY_LINK_HREF: createLocalizedPath(locale, messages.site.privacyPath),
    PRIVACY_LINK_TEXT: escapeHtml(localeMessages.home.footerPrivacy),
    X_ICON_URL: messages.site.xIconUrl,
    LINE_ICON_URL: messages.site.lineIconUrl,
    ...socialMetaReplacements,
    ...iconOptionReplacements,
  })
}

const createContactPage = (
  template: string,
  messages: SiteMessages,
  locale: Locale,
  localeMessages: LocaleMessages,
): string => {
  const switchPath = createLocalizedPath(localeMessages.switchLocale, messages.site.contactPath)
  const pagePath = createLocalizedPath(locale, messages.site.contactPath)
  const socialMetaReplacements = createSocialMetaReplacements(
    messages,
    localeMessages,
    localeMessages.contact.metaTitle,
    localeMessages.contact.metaDescription,
    pagePath,
  )

  return createLocalizedPage(template, {
    HTML_LANG: localeMessages.htmlLang,
    META_DESCRIPTION: escapeHtml(localeMessages.contact.metaDescription),
    META_TITLE: escapeHtml(localeMessages.contact.metaTitle),
    SEO_LINKS: '',
    LANGUAGE_NAV_LABEL: escapeHtml(localeMessages.languageNavLabel),
    LANGUAGE_SWITCH_HREF: switchPath,
    LANGUAGE_SWITCH_LOCALE: localeMessages.switchLocale,
    LANGUAGE_SWITCH_ARIA_LABEL: escapeHtml(localeMessages.switchAriaLabel),
    LANGUAGE_SWITCH_LABEL: escapeHtml(localeMessages.switchLabel),
    TITLE: escapeHtml(localeMessages.contact.title),
    LEAD: escapeHtml(localeMessages.contact.lead),
    MAIL_TITLE: escapeHtml(localeMessages.contact.mailTitle),
    FORM_TITLE: escapeHtml(localeMessages.contact.formTitle),
    FORM_FRAME_TITLE: escapeHtml(localeMessages.contact.formFrameTitle),
    FORM_FALLBACK: escapeHtml(localeMessages.contact.formFallback),
    CONTACT_EMAIL: messages.site.contactEmail,
    CONTACT_FORM_URL: messages.site.contactFormUrl,
    FOOTER_NAV_ARIA_LABEL: escapeHtml(localeMessages.contactFooterNavAriaLabel),
    HOME_LINK_HREF: createLocalizedPath(locale, messages.site.homePath),
    HOME_LINK_TEXT: escapeHtml(localeMessages.contact.footerHome),
    CONTACT_LINK_HREF: createLocalizedPath(locale, messages.site.contactPath),
    CONTACT_LINK_TEXT: escapeHtml(localeMessages.contact.title),
    PRIVACY_LINK_HREF: createLocalizedPath(locale, messages.site.privacyPath),
    PRIVACY_LINK_TEXT: escapeHtml(localeMessages.contact.footerPrivacy),
    ...socialMetaReplacements,
  })
}

const createPrivacyPage = (
  template: string,
  messages: SiteMessages,
  locale: Locale,
  localeMessages: LocaleMessages,
): string => {
  const switchPath = createLocalizedPath(localeMessages.switchLocale, messages.site.privacyPath)
  const pagePath = createLocalizedPath(locale, messages.site.privacyPath)
  const privacyReplacements = createPrivacyReplacements(localeMessages, locale)
  const socialMetaReplacements = createSocialMetaReplacements(
    messages,
    localeMessages,
    localeMessages.privacy.metaTitle,
    localeMessages.privacy.metaDescription,
    pagePath,
  )

  return createLocalizedPage(template, {
    HTML_LANG: localeMessages.htmlLang,
    META_DESCRIPTION: escapeHtml(localeMessages.privacy.metaDescription),
    META_TITLE: escapeHtml(localeMessages.privacy.metaTitle),
    SEO_LINKS: '',
    LANGUAGE_NAV_LABEL: escapeHtml(localeMessages.languageNavLabel),
    LANGUAGE_SWITCH_HREF: switchPath,
    LANGUAGE_SWITCH_LOCALE: localeMessages.switchLocale,
    LANGUAGE_SWITCH_ARIA_LABEL: escapeHtml(localeMessages.switchAriaLabel),
    LANGUAGE_SWITCH_LABEL: escapeHtml(localeMessages.switchLabel),
    TITLE: escapeHtml(localeMessages.privacy.title),
    LEAD: escapeHtml(localeMessages.privacy.lead),
    FOOTER_NAV_ARIA_LABEL: escapeHtml(localeMessages.privacyFooterNavAriaLabel),
    HOME_LINK_HREF: createLocalizedPath(locale, messages.site.homePath),
    HOME_LINK_TEXT: escapeHtml(localeMessages.privacy.footerHome),
    PRIVACY_LINK_HREF: createLocalizedPath(locale, messages.site.privacyPath),
    PRIVACY_LINK_TEXT: escapeHtml(localeMessages.privacy.title),
    CONTACT_LINK_HREF: createLocalizedPath(locale, messages.site.contactPath),
    CONTACT_LINK_TEXT: escapeHtml(localeMessages.privacy.footerContact),
    ...socialMetaReplacements,
    ...privacyReplacements,
  })
}

const createRedirectPage = (
  template: string,
  socialMetaReplacements: Record<string, string>,
  redirectTitle: string,
  redirectMessage: string,
  redirectSuffix: string,
  extraComment: string,
): string =>
  createLocalizedPage(template, {
    ...socialMetaReplacements,
    REDIRECT_TITLE: escapeHtml(redirectTitle),
    REDIRECT_MESSAGE: escapeHtml(redirectMessage),
    REDIRECT_SUFFIX: redirectSuffix,
    EXTRA_COMMENT: extraComment,
  })

export const generateLocalizedPages = (projectRoot: string): GeneratedPagePaths => {
  const messages = readMessages(projectRoot)
  const homeTemplate = readTextFile(resolve(projectRoot, 'templates/home.html'))
  const contactTemplate = readTextFile(resolve(projectRoot, 'templates/contact.html'))
  const privacyTemplate = readTextFile(resolve(projectRoot, 'templates/privacy.html'))
  const redirectTemplate = readTextFile(resolve(projectRoot, 'templates/redirect.html'))
  const jaLocaleMessages = messages.locales.ja as LocaleMessages
  const generatedRoot = resolve(projectRoot, '.generated')

  const inputs: Record<string, string> = {}
  const routes: Record<string, string> = {}

  ;(['ja', 'en'] as Locale[]).forEach((locale) => {
    const localeMessages = messages.locales[locale] as LocaleMessages
    const localizedRoot = resolve(generatedRoot, locale)
    const localizedContactRoot = resolve(generatedRoot, locale, 'contact')
    const localizedPrivacyRoot = resolve(generatedRoot, locale, 'privacy')

    ensureDirectory(localizedRoot)
    ensureDirectory(localizedContactRoot)
    ensureDirectory(localizedPrivacyRoot)

    const homeFilePath = resolve(localizedRoot, 'index.html')
    const contactFilePath = resolve(localizedContactRoot, 'index.html')
    const privacyFilePath = resolve(localizedPrivacyRoot, 'index.html')

    writeGeneratedFile(homeFilePath, createHomePage(homeTemplate, messages, locale, localeMessages))
    writeGeneratedFile(contactFilePath, createContactPage(contactTemplate, messages, locale, localeMessages))
    writeGeneratedFile(privacyFilePath, createPrivacyPage(privacyTemplate, messages, locale, localeMessages))

    inputs[`${locale}/index`] = homeFilePath
    inputs[`${locale}/contact/index`] = contactFilePath
    inputs[`${locale}/privacy/index`] = privacyFilePath
    routes[`/${locale}/`] = homeFilePath
    routes[`/${locale}/contact/`] = contactFilePath
    routes[`/${locale}/privacy/`] = privacyFilePath
  })

  const rootIndexFilePath = resolve(generatedRoot, 'index.html')
  const rootContactFilePath = resolve(generatedRoot, 'contact/index.html')
  const rootPrivacyFilePath = resolve(generatedRoot, 'privacy/index.html')

  writeGeneratedFile(
    rootIndexFilePath,
    createRedirectPage(
      redirectTemplate,
      createSocialMetaReplacements(
        messages,
        jaLocaleMessages,
        jaLocaleMessages.home.metaTitle,
        jaLocaleMessages.home.metaDescription,
        messages.site.homePath,
      ),
      'Redirecting...',
      'Redirecting to your preferred language...',
      '/',
      '',
    ),
  )
  writeGeneratedFile(
    rootContactFilePath,
    createRedirectPage(
      redirectTemplate,
      createSocialMetaReplacements(
        messages,
        jaLocaleMessages,
        jaLocaleMessages.contact.metaTitle,
        jaLocaleMessages.contact.metaDescription,
        messages.site.contactPath,
      ),
      'Redirecting...',
      'Redirecting to your preferred language...',
      '/contact/',
      '<!-- <script type="module" src="/src/entries/contact.ts"></script> -->',
    ),
  )
  writeGeneratedFile(
    rootPrivacyFilePath,
    createRedirectPage(
      redirectTemplate,
      createSocialMetaReplacements(
        messages,
        jaLocaleMessages,
        jaLocaleMessages.privacy.metaTitle,
        jaLocaleMessages.privacy.metaDescription,
        messages.site.privacyPath,
      ),
      'Redirecting...',
      'Redirecting to your preferred language...',
      '/privacy/',
      '<!-- <script type="module" src="/src/entries/privacy.ts"></script> -->',
    ),
  )

  inputs.index = rootIndexFilePath
  inputs['contact/index'] = rootContactFilePath
  inputs['privacy/index'] = rootPrivacyFilePath
  routes['/'] = rootIndexFilePath
  routes['/contact/'] = rootContactFilePath
  routes['/privacy/'] = rootPrivacyFilePath

  return { generatedRoot, inputs, routes }
}
