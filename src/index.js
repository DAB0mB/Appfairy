import cheerio from 'cheerio'
import { ncp } from 'ncp'
import path from 'path'
import { promisify } from 'util'
import { ViewWriter, ScriptWriter } from './writers'
import { fs } from './libs'
import { emptyDir, freeText } from './utils'

export const transpile = async (inputDir, outputDir, options = {}) => {
  let files

  await emptyDir(outputDir)

  await Promise.all([
    fs.readdir(inputDir).then(result => files = result),
    emptyDir(outputDir),
  ])

  const writingIndex = fs.writeFile(`${outputDir}/index.js`, freeText(`
    require('./views')
    require('./scripts')
  `))

  const htmlFiles = files.filter(file => path.extname(file) == '.html')
  const publicSubDirs = files.filter(file => !htmlFiles.includes(file))

  const scriptWriter = new ScriptWriter({
    prefetch: options.prefetch
  })

  const transpilingHTMLFiles = htmlFiles.map((htmlFile) => {
    return transpileHTMLFile(
      inputDir,
      outputDir,
      htmlFile,
      scriptWriter,
    )
  })

  const writingFiles = Promise.all(transpilingHTMLFiles).then((viewWriters) => {
    return Promise.all([
      ViewWriter.writeAll(viewWriters, outputDir),
      scriptWriter.write(outputDir),
    ])
  })

  const makingPublicDir = makePublicDir(
    inputDir,
    outputDir,
    publicSubDirs,
  )

  return Promise.all([
    writingIndex,
    writingFiles,
    makingPublicDir,
  ])
}

const transpileHTMLFile = async (
  inputDir,
  outputDir,
  htmlFile,
  scriptWriter,
) => {
  const html = (await fs.readFile(`${inputDir}/${htmlFile}`)).toString()
  const $ = cheerio.load(html, { xmlMode: true })
  const $head = $('head')
  const $body = $('body')

  const viewWriter = new ViewWriter({
    name: htmlFile.split('.').slice(0, -1).join('.')
  })

  setScripts(scriptWriter, $head)
  appendCSSSheets(viewWriter, $head)
  setHTML(viewWriter, $body)

  return viewWriter
}

const makePublicDir = async (inputDir, outputDir, publicSubDirs) => {
  const publicDir = `${outputDir}/public`

  await emptyDir(publicDir)

  const makingPublicSubDirs = publicSubDirs.filter((publicSubDir) => {
    return ['css', 'fonts', 'images', 'js'].includes(publicSubDir)
  })
  .map((publicSubDir) => {
    return promisify(ncp)(
      `${inputDir}/${publicSubDir}`,
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

    viewWriter.appendCSS(`@import "${href}";`)
  })
}

const setHTML = (viewWriter, $body) => {
  viewWriter.html = $body.html()
}
