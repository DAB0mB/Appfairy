import cheerio from 'cheerio'
import path from 'path'
import { ViewGenerator, InitGenerator } from './generators'
import { fs } from './libs'

// TODO: Dynamically create an HTTP server that will serve all the static files
// See CSS @import: https://developer.mozilla.org/en-US/docs/Web/CSS/@import

const transpile = async (inputDir, outputDir) => {
  const htmlFiles = await listHTMLFiles(inputDir)
  const initGenerator = new InitGenerator()

  return Promise.all(htmlFiles.map((htmlFile) => {
    return transpileHTMLFile(
      inputDir,
      outputDir,
      htmlFile,
      initGenerator,
    )
  }))
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

  const scripts = head.find('script[type="text/javascript"]')
  const links = head.find('link[rel="stylesheet"][type="text/css"]')
  const styles = head.find('style')

  await Promise.all([
    setInitScripts(initGenerator, $head),
    appendCSSSheets(viewGenerator, $head),
    setHTML(viewGenerator, $body),
  ])
}

const listHTMLFiles = async (dir) => {
  const files = await fs.readdir(dir)

  return files.filter((file) => path.extname(file) == '.html')
}

const setInitScripts = async (initGenerator, $head) => {
  const $scripts = $head.find('script[type="text/javascript"]')
  const src = $scripts.attr('src')
}

const appendCSSSheets = async (viewGenerator, $head) => {
  const $links = $head.find('link[rel="stylesheet"][type="text/css"]')
  const $styles = $head.find('style')
  const hrefs = links.map(link => link.attr('href'))
}

const setHTML(viewGenerator, $body) {
  viewGenerator.html = $body.html()
}
