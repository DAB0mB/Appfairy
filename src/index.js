import cheerio from 'cheerio'
import { ncp } from 'ncp'
import path from 'path'
import { promisify } from 'util'
import { ViewGenerator, InitGenerator } from './generators'
import { fs } from './libs'
import { emptyDir } from './utils'

export const transpile = async (inputDir, outputDir) => {
  let files

  await Promise.all([
    fs.readdir(dir).then(result => files = result),
    emptyDir(outputDir),
  ])

  const htmlFiles = files.filter(file => path.extname(file) == '.html')
  const publicSubDirs = files.filter(file => !htmlFiles.includes(file))
  const initGenerator = new InitGenerator()

  const transpilingHTMLFiles = htmlFiles.map((htmlFile) => {
    return transpileHTMLFile(
      inputDir,
      outputDir,
      htmlFile,
      initGenerator,
    )
  })

  const savingFiles = Promise.all(transpilingHTMLFiles).then((viewGenerators) => {
    return Promise.all([
      ViewGenerator.saveAll(viewGenerators, outputDir),
      initGenerator.save(outputDir),
    ])
  })

  const makingPublicDir = makePublicDir(
    inputDir,
    outputDir,
    publicSubDirs,
  )

  return Promise.all([
    savingFiles,
    makingPublicDir,
  ])
}

const transpileHTMLFile = async (
  inputDir,
  outputDir,
  htmlFile,
  initGenerator,
) => {
  const html = (await fs.readFile(`${inputDir}/${htmlFile}`)).toString()
  const $ = cheerio.load(html, { xmlMode: true })
  const $head = $('head')
  const $body = $('body')

  const viewGenerator = new ViewGenerator({ name: htmlFile })

  setInitScripts(initGenerator, $head)
  appendCSSSheets(viewGenerator, $head)
  setHTML(viewGenerator, $body)

  return viewGenerator
}

const makePublicDir = async (inputDir, outputDir, publicSubDirs) => {
  const publicDir = `${outputDir}/public`

  await emptyDir(publicDir)

  const makingPublicSubDirs = publicSubDirs.map((publicSubDir) => {
    return promisify(ncp)(
      `${inputDir}/${publicSubDir}`,
      `${publicDir}/${publicSubDir}`,
    )
  })

  return Promise.all(makingPublicSubDirs)
}

const setInitScripts = async (initGenerator, $head) => {
  const $scripts = $head.find('script[type="text/javascript"]')
  const src = $scripts.attr('src')

  initGenerator.setScript(src, $script.html())
}

const appendCSSSheets = async (viewGenerator, $head) => {
  const $links = $head.find('link[rel="stylesheet"][type="text/css"]')
  const hrefs = links.map(link => link.attr('href'))

  hrefs.forEach((href) => {
    viewGenerator.appendCSS(`@import "${href}";`)
  })
}

const setHTML = (viewGenerator, $body) => {
  viewGenerator.html = $body.html()
}
