import cheerio from 'cheerio'
import path from 'path'
import { ViewWriter, ScriptWriter } from './writers'
import { fs, ncp } from './libs'
import { emptyDir, freeLint } from './utils'

export const transpile = async (inputDir, outputDir, options = {}) => {
  let files

  await Promise.all([
    fs.readdir(inputDir).then((result) => {
      files = result
    }),
    fs.exists(outputDir).then((exists) => {
      if (exists) {
        // Removing dir is dangerous, so we will just print a warning and exit
        console.error(`Output directory ${outputDir} already exists`)
        process.exit(1)
      }

      return fs.mkdir(outputDir)
    }).then(() => {
      return fs.mkdir(`${outputDir}/src`)
    })
  ])

  const writingIndex = fs.writeFile(`${outputDir}/src/index.js`, freeLint(`
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
      options,
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
  options,
) => {
  const html = (await fs.readFile(`${inputDir}/${htmlFile}`)).toString()
  const $ = cheerio.load(html)
  const $head = $('head')
  const $body = $('body')

  const viewWriter = new ViewWriter({
    name: htmlFile.split('.').slice(0, -1).join('.'),
    minify: options.minify,
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
    return ncp(
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

    viewWriter.appendCSS(`@import "${href}";`, true)
  })
}

const setHTML = (viewWriter, $body) => {
  viewWriter.html = $body.html()
}
