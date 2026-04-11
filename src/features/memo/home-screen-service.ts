import { createFaviconDataUrl, normalizeFaviconIcon } from '../../lib/memo'
import type { PageElements } from './elements'

export type HomeScreenService = ReturnType<typeof createHomeScreenService>

const createHomeScreenIconDataUrl = (faviconIcon: string, iconSize: number): string => {
  const canvasElement = document.createElement('canvas')
  canvasElement.width = iconSize
  canvasElement.height = iconSize

  const canvasContext = canvasElement.getContext('2d')

  if (canvasContext === null) {
    return createFaviconDataUrl(faviconIcon)
  }

  const normalizedFaviconIcon = normalizeFaviconIcon(faviconIcon)
  const iconCenter = iconSize / 2
  const iconFontSize = Math.floor(iconSize * 0.72)

  canvasContext.fillStyle = '#ffffff'
  canvasContext.fillRect(0, 0, iconSize, iconSize)
  canvasContext.textAlign = 'center'
  canvasContext.textBaseline = 'middle'
  canvasContext.font = `${iconFontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
  canvasContext.fillText(normalizedFaviconIcon, iconCenter, iconCenter)

  return canvasElement.toDataURL('image/png')
}

const createManifestObjectUrl = (manifestName: string, icon192Url: string, icon512Url: string): string => {
  const manifestJson = JSON.stringify({
    name: manifestName,
    short_name: manifestName,
    icons: [
      {
        src: icon192Url,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: icon512Url,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'browser',
  })

  return URL.createObjectURL(new Blob([manifestJson], { type: 'application/manifest+json' }))
}

export const createHomeScreenService = (pageElements: PageElements) => {
  let currentManifestObjectUrl = ''

  const updateHomeScreenIcon = (faviconIcon: string): void => {
    const normalizedFaviconIcon = normalizeFaviconIcon(faviconIcon)
    const faviconSvgUrl = createFaviconDataUrl(normalizedFaviconIcon)
    const faviconPngUrl = createHomeScreenIconDataUrl(normalizedFaviconIcon, 96)
    const appleTouchIconUrl = createHomeScreenIconDataUrl(normalizedFaviconIcon, 180)
    const manifestIcon192Url = createHomeScreenIconDataUrl(normalizedFaviconIcon, 192)
    const manifestIcon512Url = createHomeScreenIconDataUrl(normalizedFaviconIcon, 512)
    const nextManifestObjectUrl = createManifestObjectUrl(
      pageElements.appleMobileWebAppTitleMeta.content,
      manifestIcon192Url,
      manifestIcon512Url,
    )

    if (currentManifestObjectUrl !== '') {
      URL.revokeObjectURL(currentManifestObjectUrl)
    }

    pageElements.faviconLink.href = faviconSvgUrl
    pageElements.faviconPngLink.href = faviconPngUrl
    pageElements.shortcutIconLink.href = faviconPngUrl
    pageElements.appleTouchIconLink.href = appleTouchIconUrl
    pageElements.manifestLink.href = nextManifestObjectUrl
    currentManifestObjectUrl = nextManifestObjectUrl
  }

  return {
    updateHomeScreenIcon,
  }
}
