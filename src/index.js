import cheerio from 'cheerio'
import path from 'path'
import { ViewWriter, ScriptWriter } from './writers'
import { fs, ncp } from './libs'
import { emptyDir, freeLint } from './utils'

export const transpile = async (config) => {
  let files

  await Promise.all([
    fs.readdir(config.input).then((result) => {
      files = result
    }),
    emptyDir(config.output).then(() => {
      return fs.mkdir(`${config.output}/src`)
    }),
  ])

  const writingIndex = fs.writeFile(`${config.output}/src/index.js`, freeLint(`
    require('./views')
    require('./scripts')
  `))

  const htmlFiles = files.filter(file => path.extname(file) == '.html')
  const publicSubDirs = files.filter(file => !htmlFiles.includes(file))

  const scriptWriter = new ScriptWriter({
    prefetch: config.prefetch
  })

  const transpilingHTMLFiles = htmlFiles.map((htmlFile) => {
    return transpileHTMLFile(
      config,
      htmlFile,
      scriptWriter,
    )
  })

  const writingFiles = Promise.all(transpilingHTMLFiles).then((viewWriters) => {
    return Promise.all([
      ViewWriter.writeAll(viewWriters, config.output),
      scriptWriter.write(config.output),
    ])
  })

  const makingPublicDir = makePublicDir(
    config,
    publicSubDirs,
  )

  await Promise.all([
    writingIndex,
    writingFiles,
    makingPublicDir,
  ])

  if (!config.map) {
    return
  }

  const mapping = []

  if (config.map.public) {
    const publicDir = path.resolve(config.path, config.map.public)
    mapping.push(ncp(`${config.out}/public`, publicDir))
  }

  if (config.map.src) {
    if (config.map.src.views) {
      const viewsDir = path.resolve(config.path, config.map.src.views)
      mapping.push(ncp(`${config.out}/src/views`, viewsDir))
    }

    if (config.map.src.views) {
      const scriptsDir = path.resolve(config.path, config.map.src.scripts)
      mapping.push(ncp(`${config.out}/src/scripts`, scriptsDir))
    }
  }

  return Promise.all(mapping)
}

const transpileHTMLFile = async (
  config,
  htmlFile,
  scriptWriter,
) => {
  const html = (await fs.readFile(`${config.input}/${htmlFile}`)).toString()
  const $ = cheerio.load(html)
  const $head = $('head')
  const $body = $('body')

  const viewWriter = new ViewWriter({
    name: htmlFile.split('.').slice(0, -1).join('.'),
    minify: config.minify,
  })

  setScripts(scriptWriter, $head)
  appendCSSSheets(viewWriter, $head)
  setHTML(viewWriter, $body)

  return viewWriter
}

const makePublicDir = async (config, publicSubDirs) => {
  const publicDir = `${config.output}/public`

  await emptyDir(publicDir)

  const makingPublicSubDirs = publicSubDirs.filter((publicSubDir) => {
    return ['css', 'fonts', 'images', 'js'].includes(publicSubDir)
  })
  .map((publicSubDir) => {
    return ncp(
      `${config.input}/${publicSubDir}`,
      `${publicDir}/${publicSubDir}`,
    )
  })

  return Promise.all(makingPublicSubDirs)
}

const setScripts = async (scriptWriter, $head) => {
  const $scripts = $head.find('script[type="text/javascript"]')

  $scripts.each((i, script) => {
    const $script = $head.find(script)

    scriptWriter.setScript($script.attr('src'), $script.html())
  })
}

const appendCSSSheets = async (viewWriter, $head) => {
  const $links = $head.find('link[rel="stylesheet"][type="text/css"]')

  $links.each((i, link) => {
    const href = $head.find(link).attr('href')

    viewWriter.appendCSS(`@import "${href}";`, true)
  })
}

const setHTML = (viewWriter, $body) => {
  viewWriter.html = $body.html()
}
