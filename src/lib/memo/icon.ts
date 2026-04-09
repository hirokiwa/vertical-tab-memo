export const DEFAULT_FAVICON_ICON = '✏️'

export const FAVICON_OPTIONS = [
  { icon: '😀', label: '笑顔' },
  { icon: '😂', label: '爆笑' },
  { icon: '🥺', label: 'うるうる' },
  { icon: '😎', label: 'クール' },
  { icon: '🤔', label: '考え中' },
  { icon: '😴', label: '休憩' },
  { icon: '🔥', label: '熱量' },
  { icon: '✅', label: '完了' },
  { icon: '👆', label: '重要' },
  { icon: '👇', label: '下へ' },
  { icon: '❤️', label: '好き' },
  { icon: '💡', label: 'ひらめき' },
  { icon: '⭐', label: '優先' },
  { icon: '🚀', label: '集中' },
  { icon: '📌', label: '固定' },
  { icon: '✏️', label: 'えんぴつ' },
  { icon: '📣', label: '通知' },
  { icon: '⚠️', label: '注意' },
  { icon: '🎉', label: 'お祝い' },
  { icon: '🐙', label: 'たこ' },
  { icon: '🍀', label: '四つ葉' },
  { icon: '🍄', label: 'きのこ' },
  { icon: '🌏', label: '地球' },
  { icon: '🐥', label: 'ひよこ' },
  { icon: '🥦', label: 'ブロッコリー' },
  { icon: '🍔', label: 'ハンバーガー' },
  { icon: '🍙', label: 'おにぎり' },
  { icon: '🍺', label: 'ビール' },
  { icon: '🎁', label: 'プレゼント' },
  { icon: '🚗', label: '車' },
] as const

const SINGLE_EMOJI_PATTERN =
  /^(?:\p{Regional_Indicator}{2}|\p{Emoji}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?(?:\u200D\p{Emoji}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?)*)$/u

export const isSingleEmoji = (iconValue: string): boolean => SINGLE_EMOJI_PATTERN.test(iconValue.trim())

export const normalizeFaviconIcon = (iconValue: string | null): string => {
  if (iconValue === null) {
    return DEFAULT_FAVICON_ICON
  }
  const trimmedIconValue = iconValue.trim()
  return isSingleEmoji(trimmedIconValue) ? trimmedIconValue : DEFAULT_FAVICON_ICON
}

export const isPresetFaviconIcon = (faviconIcon: string): boolean =>
  FAVICON_OPTIONS.some((faviconOption) => faviconOption.icon === normalizeFaviconIcon(faviconIcon))

export const createFaviconDataUrl = (faviconIcon: string): string => {
  const iconValue = normalizeFaviconIcon(faviconIcon)
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="52">${iconValue}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`
}

export const createCustomIconValidationMessage = (rawIconValue: string): string => {
  const trimmedIconValue = rawIconValue.trim()
  if (isSingleEmoji(trimmedIconValue)) {
    return ''
  }
  return trimmedIconValue.length === 0 ? '絵文字1文字を入力してください。' : '絵文字は1文字だけ入力してください。'
}
