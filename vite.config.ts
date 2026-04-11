import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { defineConfig } from 'vite'
import { generateLocalizedPages } from './build/site-generator'

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

  if (!normalizedPathname.startsWith('/ja/') && !normalizedPathname.startsWith('/en/')) {
    return []
  }

  const canonicalPath = normalizedPathname
  const jaPath = `/ja${pagePath === '/' ? '/' : pagePath}`
  const enPath = `/en${pagePath === '/' ? '/' : pagePath}`

  return [
    { tag: 'link', attrs: { rel: 'canonical', href: canonicalPath }, injectTo: 'head' as const },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'ja', href: jaPath }, injectTo: 'head' as const },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'en', href: enPath }, injectTo: 'head' as const },
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: pagePath }, injectTo: 'head' as const },
  ]
}

const generatedPages = generateLocalizedPages(__dirname)

const moveGeneratedBuildFiles = (): void => {
  const distGeneratedRoot = resolve(__dirname, 'dist/.generated')
  const distRoot = resolve(__dirname, 'dist')

  if (!existsSync(distGeneratedRoot)) {
    return
  }

  cpSync(distGeneratedRoot, distRoot, { recursive: true })
  rmSync(distGeneratedRoot, { recursive: true, force: true })
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
