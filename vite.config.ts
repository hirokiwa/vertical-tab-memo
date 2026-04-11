import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { defineConfig } from 'vite'
import { generateLocalizedPages } from './build/site-generator'

const siteMessages = JSON.parse(readFileSync(resolve(__dirname, 'src/i18n/common.json'), 'utf-8')) as {
  site: {
    siteUrl: string
  }
}

const createAbsoluteUrl = (pathname: string): string => {
  const normalizedSiteUrl = siteMessages.site.siteUrl.endsWith('/')
    ? siteMessages.site.siteUrl.slice(0, -1)
    : siteMessages.site.siteUrl

  return `${normalizedSiteUrl}${pathname}`
}

const googleTagScript = {
  tag: 'script',
  attrs: {
    async: true,
    src: 'https://www.googletagmanager.com/gtag/js?id=G-TJXMD0CGC7',
  },
  injectTo: 'head',
} as const

const googleTagInlineScript = {
  tag: 'script',
  children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-TJXMD0CGC7');`,
  injectTo: 'head',
} as const

const createSeoTags = (pathname: string) => {
  const normalizedGeneratedPathname = pathname.startsWith('/.generated/')
    ? pathname.replace(/^\/\.generated/, '')
    : pathname === '/.generated/index.html'
      ? '/index.html'
      : pathname

  const normalizedPathname = normalizedGeneratedPathname.endsWith('/index.html')
    ? normalizedGeneratedPathname.replace(/index\.html$/, '')
    : normalizedGeneratedPathname

  const pagePath =
    normalizedPathname === '/ja/' || normalizedPathname === '/en/'
      ? '/'
      : normalizedPathname.startsWith('/ja/')
        ? normalizedPathname.replace(/^\/ja/, '')
        : normalizedPathname.startsWith('/en/')
          ? normalizedPathname.replace(/^\/en/, '')
          : normalizedPathname

  const canonicalPath = normalizedPathname
  const jaPath = `/ja${pagePath === '/' ? '/' : pagePath}`
  const enPath = `/en${pagePath === '/' ? '/' : pagePath}`
  const defaultPath = pagePath

  return [
    { tag: 'link', attrs: { rel: 'canonical', href: createAbsoluteUrl(canonicalPath) }, injectTo: 'head' as const },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'ja', href: createAbsoluteUrl(jaPath) }, injectTo: 'head' as const },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'en', href: createAbsoluteUrl(enPath) }, injectTo: 'head' as const },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: createAbsoluteUrl(defaultPath) }, injectTo: 'head' as const },
  ]
}

const generatedPages = generateLocalizedPages(__dirname)

const copyGeneratedEntry = (sourcePath: string, targetPath: string): void => {
  const sourceStats = statSync(sourcePath)

  if (sourceStats.isDirectory()) {
    readdirSync(sourcePath).forEach((entryName) => {
      copyGeneratedEntry(resolve(sourcePath, entryName), resolve(targetPath, entryName))
    })
    return
  }

  rmSync(targetPath, { force: true })
  cpSync(sourcePath, targetPath)
}

const moveGeneratedBuildFiles = (): void => {
  const distGeneratedRoot = resolve(__dirname, 'dist/.generated')
  const distRoot = resolve(__dirname, 'dist')

  if (!existsSync(distGeneratedRoot)) {
    return
  }

  readdirSync(distGeneratedRoot).forEach((entryName) => {
    copyGeneratedEntry(resolve(distGeneratedRoot, entryName), resolve(distRoot, entryName))
  })
  rmSync(distGeneratedRoot, { recursive: true, force: true })
}

const createBuildDate = (): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

const writeSitemap = (): void => {
  const sitemapTemplatePath = resolve(__dirname, 'templates/sitemap.xml')
  const sitemapOutputPath = resolve(__dirname, 'dist/sitemap.xml')
  const sitemapTemplate = readFileSync(sitemapTemplatePath, 'utf-8')
  const sitemapXml = sitemapTemplate.replaceAll('2026-03-24', createBuildDate())

  writeFileSync(sitemapOutputPath, sitemapXml)
}

const resolveGeneratedPagePath = (requestPathname: string): string | undefined => {
  const directMatch = generatedPages.routes[requestPathname]

  if (directMatch !== undefined) {
    return directMatch
  }

  if (requestPathname.includes('.')) {
    return undefined
  }

  const normalizedRequestPathname = requestPathname.endsWith('/') ? requestPathname : `${requestPathname}/`
  return generatedPages.routes[normalizedRequestPathname]
}

export default defineConfig(() => ({
  plugins: [
    {
      name: 'serve-generated-localized-pages',
      apply: 'serve',
      configureServer: (server) => {
        server.middlewares.use(async (request, response, next) => {
          const requestUrl = request.url === undefined ? '/' : request.url
          const requestPathname = requestUrl.split('?')[0]
          const htmlFilePath = resolveGeneratedPagePath(requestPathname)

          if (htmlFilePath === undefined) {
            next()
            return
          }

          generateLocalizedPages(__dirname)

          const html = readFileSync(htmlFilePath, 'utf-8')
          const transformedHtml = await server.transformIndexHtml(requestPathname, html, request.originalUrl)
          response.setHeader('Content-Type', 'text/html')
          response.end(transformedHtml)
        })
      },
    },
    {
      name: 'inject-build-head-tags',
      apply: 'build',
      closeBundle: () => {
        moveGeneratedBuildFiles()
        writeSitemap()
      },
      transformIndexHtml: {
        order: 'post',
        handler: (_html, context) => {
          const pathname = context.path.startsWith('/') ? context.path : `/${context.path}`
          return [googleTagScript, googleTagInlineScript, ...createSeoTags(pathname)]
        },
      },
    },
  ],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(generatedPages.inputs).map(([entryName, filePath]) => [
          relative(generatedPages.generatedRoot, filePath).replace(/\.html$/, ''),
          resolve(__dirname, filePath),
        ]),
      ),
    },
  },
}))
