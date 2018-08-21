import CleanCSS from 'clean-css'
import fetch from 'node-fetch'
import { fs } from '../libs'
import Writer from './writer'

import {
  Internal,
  emptyDir,
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
    options = {
      ...options,
      prefetch: this.prefetch,
    }

    await emptyDir(`${dir}/src/styles`)

    if (!options.prefetch) {
      return fs.writeFile(`${dir}/src/styles/index.js`, this[_].composeStyleLoader())
    }

    const styleFileNames = this.styles.map((style, index, { length }) => {
      return padLeft(index, length / 10 + 1, 0) + '.css'
    })

    const fetchingStyles = this.styles.map(async (style, index) => {
      const styleFileName = styleFileNames[index]

      const sheet = style.type == 'sheet'
        ? style.body
        : /^http/.test(style.body)
        ? await fetch(style.body).then(res => res.text())
        : await requireText.promise(`${this.baseUrl}/${style.body}`)

      return fs.writeFile(`${dir}/src/styles/${styleFileName}`, cleanCSS.minify(sheet).styles)
    })

    const stylesIndexContent = styleFileNames.map((styleFileName) => {
      return `require('./${styleFileName}')`
    }).join('\n')

    const writingIndex = fs.writeFile(
      `${dir}/src/styles/index.js`,
      freeLint(stylesIndexContent),
    )

    return Promise.all([
      ...fetchingStyles,
      writingIndex,
    ])
  }

  setStyle(href, content) {
    let type
    let body

    if (href) {
      type = 'href'
      body = href
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
        style.body = cleanCSS.minify(style.body).styles
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
            style.onload = resolve
            style.onerror = reject
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

      module.exports = Promise.all(loadingStyles)
    `)
  }
}

export default StyleWriter
