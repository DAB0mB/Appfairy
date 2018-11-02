import cheerio from 'cheerio'
import HTMLtoJSX from 'htmltojsx'
import path from 'path'
import statuses from 'statuses'
import uglify from 'uglify-js'
import { fs, mkdirp } from '../libs'
import raw from '../raw'
import Writer from './writer'

import {
  encapsulateCSS,
  escape,
  freeLint,
  freeScope,
  freeText,
  Internal,
  splitWords,
  upperFirst,
} from '../utils'

const _ = Symbol('_ViewWriter')
const htmltojsx = new HTMLtoJSX({ createClass: false })

const flattenChildren = (children = [], flatten = []) => {
  children.forEach((child) => {
    flattenChildren(child[_].children, flatten)
  })

  flatten.push(...children)

  return flatten
}

@Internal(_)
class ViewWriter extends Writer {
  static async writeAll(viewWriters, dir, ctrlsDir) {
    await mkdirp(dir)

    const indexFilePath = `${dir}/index.js`
    const helpersFilePath = `${dir}/helpers.js`
    const childFilePaths = [indexFilePath, helpersFilePath]
    ctrlsDir = path.relative(dir, ctrlsDir)
    viewWriters = flattenChildren(viewWriters)

    const writingViews = viewWriters.map(async (viewWriter) => {
      const filePaths = await viewWriter.write(dir, ctrlsDir)
      childFilePaths.push(...filePaths)
    })

    const index = viewWriters.map((viewWriter) => {
      return `export { default as ${viewWriter.className} } from './${viewWriter.className}'`
    }).join('\n')

    const writingIndex = fs.writeFile(indexFilePath, freeLint(index))
    const writingHelpers = fs.writeFile(helpersFilePath, raw.viewHelpers)

    await Promise.all([
      ...writingViews,
      writingIndex,
      writingHelpers,
    ])

    return childFilePaths
  }

  get baseUrl() {
    return this[_].baseUrl
  }

  set baseUrl(baseUrl) {
    this[_].baseUrl = String(baseUrl)
  }

  get children() {
    return this[_].children.slice()
  }

  set name(name) {
    if (!isNaN(Number(name))) {
      name = statuses[name]
    }

    const words = splitWords(name)

    Object.assign(this[_], {
      ctrlClassName: words.concat('controller').map(upperFirst).join(''),
      className: words.concat('view').map(upperFirst).join(''),
      elName: words.map(word => word.toLowerCase()).join('-'),
      name:  words.concat('view').map(word => word.toLowerCase()).join('-'),
    })
  }

  get name() {
    return this[_].name
  }

  get ctrlClassName() {
    return this[_].ctrlClassName
  }

  get className() {
    return this[_].className
  }

  get elName() {
    return this[_].elName
  }

  set html(html) {
    if (!html) {
      this[_].html = ''
      this[_].children = []
      return
    }

    const children = this[_].children = []
    const $ = cheerio.load(html)

    // Encapsulate styles
    $('style').each((i, el) => {
      const $el = $(el)
      const html = $el.html()
      const css = encapsulateCSS(html, this.srouce)

      $el.html(css)
    })

    $('*').each((i, el) => {
      const $el = $(el)
      let className = $el.attr('class')

      if (className && !/af-class-/.test(className)) {
        className = className.replace(/([\w_-]+)/g, 'af-class-$1')

        switch (this.source) {
          case 'webflow':
            className = className
              .replace(/af-class-w-/g, 'w-')
            break
          case 'sketch':
            className = className
              .replace(/af-class-anima-/g, 'anima-')
              .replace(/af-class-([\w_-]+)an-animation([\w_-]+)/g, '$1an-animation$2')
            break
          default:
            className = className
              .replace(/af-class-w-/g, 'w-')
              .replace(/af-class-anima-/g, 'anima-')
              .replace(/af-class-([\w_-]+)an-animation([\w_-]+)/g, '$1an-animation$2')
        }

        $el.attr('class', className)
      }
    })

    let el = $('[af-el]')[0]

    while (el) {
      const $el = $(el)
      const elName = $el.attr('af-el')
      const $afEl = $(`<af-${elName}></af-${elName}>`)

      $afEl.attr('af-sock', $el.attr('af-sock'))
      $el.attr('af-el', null)
      $el.attr('af-sock', null)
      $afEl.insertAfter($el)
      $el.remove()

      const child = new ViewWriter({
        name: elName,
        html: $.html($el),
        baseUrl: this.baseUrl,
        styles: this.styles,
      })

      children.push(child)
      el = $('[af-el]')[0]
    }

    // Apply ignore rules AFTER child elements were plucked
    $('[af-ignore]').remove()
    // Empty inner HTML
    $('[af-empty]').html('').attr('af-empty', null)

    this[_].scripts = []

    // Set inline scripts. Will be loaded once component has been mounted
    $('script').each((i, script) => {
      const $script = $(script)
      const src = $script.attr('src')
      const type = $script.attr('type')

      // We're only interested in JavaScript script tags
      if (type && !/javascript/i.test(type)) return

      if (src) {
        this[_].scripts.push({
          type: 'src',
          body: src,
        })
      }
      else {
        this[_].scripts.push({
          type: 'code',
          body: $script.html(),
        })
      }

      $script.remove()
    })

    // Wrapping with .af-view will apply encapsulated CSS
    const $body = $('body')
    const $afContainer = $('<span class="af-view"></span>')

    $afContainer.append($body.contents())
    $afContainer.prepend('\n  ')
    $afContainer.append('\n  ')
    $body.append($afContainer)

    html = $body.html()

    this[_].html = html

    const sockets = this[_].sockets = []

    // Find root sockets
    $('[af-sock]').each((i, el) => {
      const $el = $(el)
      const socketName = $el.attr('af-sock')
      sockets.push(socketName)

      $el.attr('af-sock', null)
      // Workaround would help identify the closing tag
      el.tagName += `-af-sock-${socketName}`
    })

    // Refetch modified html
    html = $body.html()

    // Transforming HTML into JSX
    let jsx = htmltojsx.convert(html).trim()
    // Bind controller to view
    this[_].jsx = bindJSX(jsx, children)
  }

  get scripts() {
    return this[_].scripts ? this[_].scripts.slice() : []
  }

  get styles() {
    return this[_].styles.slice()
  }

  get html() {
    return this[_].html
  }

  get jsx() {
    return this[_].jsx
  }

  get sockets() {
    return this[_].sockets && [...this[_].sockets]
  }

  get source() {
    return this[_].source
  }

  set source(source) {
    this[_].source = String(source)
  }

  constructor(options) {
    super()

    this[_].children = []
    this[_].styles = options.styles || []

    this.name = options.name
    this.html = options.html
    this.source = options.source
  }

  async write(dir, ctrlsDir) {
    const filePath = `${dir}/${this.className}.js`
    const childFilePaths = [filePath]

    const writingChildren = this[_].children.map(async (child) => {
      const filePaths = await child.write(dir, ctrlsDir)
      childFilePaths.push(...filePaths)
    })

    const writingSelf = fs.writeFile(`${dir}/${this.className}.js`, this[_].compose(ctrlsDir))

    await Promise.all([
      ...writingChildren,
      writingSelf,
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

  _compose(ctrlsDir) {
    return freeLint(`
      import React from 'react'
      import { createScope, map, transformProxies } from './helpers'
      ==>${this[_].composeChildImports()}<==
      const scripts = [
        ==>${this[_].composeScriptsDeclerations()}<==
      ]

      let Controller

      class ${this.className} extends React.Component {
        static get Controller() {
          if (Controller) return Controller

          try {
            Controller = require('${ctrlsDir}/${this.ctrlClassName}')
            Controller = Controller.default || Controller

            return Controller
          }
          catch (e) {
            if (e.code == 'MODULE_NOT_FOUND') {
              Controller = ${this.className}

              return Controller
            }

            throw e
          }
        }

        componentDidMount() {
          ==>${this[_].composeScriptsInvocations()}<==
        }

        render() {
          const proxies = Controller !== ${this.className} ? transformProxies(this.props.children) : {
            ==>${this[_].composeProxiesDefault()}<==
          }

          return (
            <span>
              <style dangerouslySetInnerHTML={{ __html: \`
                ==>${this[_].composeStyleImports()}<==
              \` }} />
              ==>${this.jsx}<==
            </span>
          )
        }
      }

      export default ${this.className}
    `)
  }

  _composeStyleImports() {
    const hrefs = this[_].styles.map(({ type, body }) => {
      return type == 'href' && body
    }).filter(Boolean)

    const sheets = this[_].styles.map(({ type, body }) => {
      return type == 'sheet' && body
    }).filter(Boolean)

    let css = ''

    css += hrefs.map((href) => {
      return `@import url(${href});`
    }).join('\n')

    css += '\n\n'

    css += sheets.map((sheet) => {
      return sheet
    }).join('\n\n')

    return escape(css.trim())
  }

  _composeProxiesDefault() {
    return this[_].sockets.map((socket) => {
      return `'${socket}': [],`
    }).join('\n')
  }

  _composeChildImports() {
    const imports = this[_].children.map((child) => {
      return `import ${child.className} from './${child.className}'`
    })

    // Line skip
    imports.push('')

    return imports.join('\n')
  }

  _composeScriptsDeclerations() {
    return this[_].scripts.map((script) => {
      if (script.type == 'src') {
        return `fetch("${script.body}").then(body => body.text()),`
      }

      return `Promise.resolve("${escape(uglify.minify(script.body).code)}"),`
    }).join('\n')
  }

  _composeScriptsInvocations() {
    if (!this[_].scripts) return ''

    const invoke = freeScope('eval(arguments[0])', 'window', {
      'script': null,
    })

    return freeText(`
      scripts.concat(Promise.resolve()).reduce((loaded, loading) => {
        return loaded.then((script) => {
          ==>${invoke}<==

          return loading
        })
      })
    `)
  }
}

function bindJSX(jsx, children = []) {
  children.forEach((child) => {
    jsx = jsx.replace(
      new RegExp(`af-${child.elName}`, 'g'),
      `${child.className}.Controller`
    )
  })

  // ORDER MATTERS
  return jsx
    // Open close
    .replace(
      /<([\w_-]+)-af-sock-([\w_-]+)(.*?)>([^]*)<\/\1-af-sock-\2>/g, (
      match, el, sock, attrs, children
    ) => (
      // If there are nested sockets
      /<[\w_-]+-af-sock-[\w_-]+/.test(children) ? (
        `{map(proxies['${sock}'], props => <${el} ${mergeProps(attrs)}>{createScope(props.children, proxies => <React.Fragment>${bindJSX(children)}</React.Fragment>)}</${el}>)}`
      ) : (
        `{map(proxies['${sock}'], props => <${el} ${mergeProps(attrs)}>{props.children ? props.children : <React.Fragment>${children}</React.Fragment>}</${el}>)}`
      )
    ))
    // Self closing
    .replace(
      /<([\w_-]+)-af-sock-([\w_-]+)(.*?) \/>/g, (
      match, el, sock, attrs
    ) => (
      `{map(proxies['${sock}'], props => <${el} ${mergeProps(attrs)}>{props.children}</${el}>)}`
    ))
}

// Merge props along with class name
function mergeProps(attrs) {
  attrs = attrs.trim()

  if (!attrs) {
    return '{...props}'
  }

  let className = attrs.match(/className="([^"]+)"/)

  if (!className) {
    return `${attrs} {...props}`
  }

  className = className[1]
  attrs = attrs.replace(/ ?className="[^"]+"/, '')

  return `${attrs} {...{...props, className: \`${className} $\{props.className || ''}\`}}`.trim()
}

export default ViewWriter
