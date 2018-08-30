import CleanCSS from 'clean-css'
import fetch from 'node-fetch'
import path from 'path'
import { fs, mkdirp } from '../libs'
import { encapsulateCSS } from '../utils'
import Writer from './writer'

import {
  Internal,
  escape,
  freeText,
  freeLint,
  padLeft,
  requireText,
} from '../utils'

const _ = Symbol('_StyleWriter')
const cleanCSS = new CleanCSS({
  rebaseTo: '..'
})

@Internal(_)
class StyleWriter extends Writer {
  get styles() {
    return this[_].styles.slice()
  }

  get prefetch() {
    return this[_].prefetch
  }

  set prefetch(prefetch) {
    return this[_].prefetch = !!prefetch
  }

  get baseUrl() {
    return this[_].baseUrl
  }

  set baseUrl(baseUrl) {
    this[_].baseUrl = String(baseUrl)
  }

  constructor(options = {}) {
    super()

    this[_].styles = []

    this.baseUrl = options.baseUrl
    this.prefetch = options.prefetch
  }

  async write(dir, options) {
    await mkdirp(dir)

    options = {
      ...options,
      prefetch: this.prefetch,
    }

    const indexFilePath = `${dir}/index.js`
    const childFilePaths = [indexFilePath]

    if (!options.prefetch) {
      await fs.writeFile(indexFilePath, this[_].composeStyleLoader())
      return childFilePaths
    }

    const styleFileNames = this.styles.map((style, index, { length }) => {
      const fileName = padLeft(index, length / 10 + 1, 0) + '.css'
      const filePath = `${dir}/${fileName}`
      childFilePaths.push(filePath)

      return fileName
    })

    const fetchingStyles = this.styles.map(async (style, index) => {
      const styleFileName = styleFileNames[index]

      const sheet = style.type == 'sheet'
        ? style.body
        : /^http/.test(style.body)
        ? await fetch(style.body).then(res => res.text())
        : await requireText.promise(`${this.baseUrl}/${style.body}`)

      return fs.writeFile(`${dir}/${styleFileName}`, transformSheet(sheet))
    })

    const stylesIndexContent = styleFileNames.map((styleFileName) => {
      return `require('./${styleFileName}')`
    }).join('\n')

    const writingIndex = fs.writeFile(
      indexFilePath,
      freeLint(stylesIndexContent),
    )

    await Promise.all([
      ...fetchingStyles,
      writingIndex,
    ])

    return childFilePaths
  }

  setStyle(href, content) {
    let type
    let body

    if (href) {
      type = 'href'
      body = /^\w+:\/\//.test(href) ? href : path.resolve('/', href)
    }
    else {
      type = 'sheet'
      body = content
    }

    const exists = this[_].styles.some((style) => {
      return style.body == body
    })

    if (!exists) {
      this[_].styles.push({ type, body })
    }
  }

  _composeStyleLoader() {
    this[_].styles.forEach((style) => {
      if (style.type == 'sheet') {
        style.body = transformSheet(style.body)
      }
    })

    const styles = this[_].styles.map((style) => {
      return freeText(`
        {
          type: '${style.type}',
          body: '${escape(style.body, "'")}',
        },
      `)
    }).join('\n')

    return freeLint(`
      const styles = [
        ==>${styles}<==
      ]

      const loadingStyles = styles.map((style) => {
        let styleEl
        let loading

        if (style.type == 'href') {
          styleEl = document.createElement('link')

          loading = new Promise((resolve, reject) => {
            styleEl.onload = resolve
            styleEl.onerror = reject
          })

          styleEl.rel = 'stylesheet'
          styleEl.type = 'text/css'
          styleEl.href = style.body
        }
        else {
          styleEl = document.createElement('style')
          styleEl.type = 'text/css'
          styleEl.innerHTML = style.body

          loading = Promise.resolve()
        }

        document.head.appendChild(styleEl)

        return loading
      })

      module.exports = Promise.all(loadingStyles).then(() => {
        const styleSheets = Array.from(document.styleSheets).filter((styleSheet) => {
          return styleSheet.href && styles.some((style) => {
            return style.type == 'href' && styleSheet.href.match(style.body)
          })
        })

        styleSheets.forEach((styleSheet) => {
          Array.from(styleSheet.rules).forEach((rule) => {
            if (rule.selectorText) {
              rule.selectorText = rule.selectorText.replace(/([^\\s][^,]*)(\\s*,?)/g, '.af-container $1$2')
            }
          })
        })
      })
    `)
  }
}

// Will minify and encapsulate classes
function transformSheet(sheet) {
  sheet = encapsulateCSS(sheet)
  sheet = cleanCSS.minify(sheet).styles

  // Make URLs absolute so webpack won't throw any errors
  return sheet.replace(/url\(([^)]+)\)/g, (match, url) => {
    if (/^(.+):\/\//.test(url)) return match

    url = path.resolve('/', url)
    return `url(${url})`
  })
}

export default StyleWriter
