import cheerio from 'cheerio'
import path from 'path'
import { fs, ncp, reread } from './libs'
import { emptyDir, freeLint, get } from './utils'
import { ViewWriter, ScriptWriter } from './writers'

export const transpile = async (config) => {
  let inputFiles
  let outputFiles

  await Promise.all([
    fs.readdir(config.input).then((files) => {
      inputFiles = files
    }),
    emptyOutputDir(config).then((files) => {
      outputFiles = files
    }),
  ])

  const writingIndex = fs.writeFile(`${config.output}/src/index.js`, freeLint(`
    require('./views')
    require('./scripts')
  `))

  const htmlFiles = inputFiles.filter(file => path.extname(file) == '.html')
  const publicSubDirs = inputFiles.filter(file => !htmlFiles.includes(file))

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

  mapping.push(mapOutput(config, outputFiles, 'public'))
  mapping.push(mapOutput(config, outputFiles, 'src', 'views'))
  mapping.push(mapOutput(config, outputFiles, 'src', 'scripts'))

  return Promise.all(mapping)
}

// Will retrieve a list of all files in the old output dir before emptying it
const emptyOutputDir = async (config) => {
  const files = {
    public: [],
    src: {
      views: [],
      scripts: [],
    },
  }

  if (config.map) try {
    await Promise.all([
      config.map.public &&
      reread(`${config.output}/public`).then(publicFiles => {
        files.public = publicFiles.map(file => path.relative(config.output, file))
      }),
      config.map.src.views &&
      reread(`${config.output}/src/views`).then(viewFiles => {
        files.src.views = viewFiles.map(file => path.relative(config.output, file))
      }),
      config.map.src.scripts &&
      reread(`${config.output}/src/scripts`).then(scriptFiles => {
        files.src.scripts = scriptFiles.map(file => path.relative(config.output, file))
      }),
    ])
  }
  catch (e) {
    // Not exist
  }

  await emptyDir(config.output)
  await fs.mkdir(`${config.output}/src`)

  return files
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

// Remove old files and copy output sub-dirs based on map config
const mapOutput = async (config, files, ...dirs) => {
  files = get(files, dirs)
  const value = get(config.map, dirs)
  const src = path.resolve(config.output, ...dirs)
  const dst = path.resolve(config.__dirname, value)

  await files.map((file) => {
    return fs.unlink(path.resolve(dst, file))
  })

  return ncp(src, dst)
}
