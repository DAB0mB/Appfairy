import cheerio from 'cheerio'
import HTMLtoJSX from 'htmltojsx'
import path from 'path'
import statuses from 'statuses'
import { fs, mkdirp } from '../libs'
import { encapsulateCSS } from '../utils'
import Writer from './writer'

import {
  freeLint,
  Internal,
  requireText,
  splitWords,
  upperFirst,
} from '../utils'

const _ = Symbol('_ViewWriter')
const htmltojsx = new HTMLtoJSX({ createClass: false })
const viewUtils = requireText(path.resolve(__dirname, '../src/utils/view.js'))

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
    const utilsFilePath = `${dir}/utils.js`
    const childFilePaths = [indexFilePath, utilsFilePath]
    ctrlsDir = path.relative(dir, ctrlsDir)
    viewWriters = flattenChildren(viewWriters)

    const writingViews = viewWriters.map(async (viewWriter) => {
      const filePaths = await viewWriter.write(dir, ctrlsDir)
      childFilePaths.push(...filePaths)
    })

    const index = viewWriters.map((viewWriter) => {
      return `exports.${viewWriter.className} = require('./${viewWriter.className}')`
    }).join('\n')

    const writingIndex = fs.writeFile(indexFilePath, freeLint(index))
    const writingUtils = fs.writeFile(utilsFilePath, viewUtils)

    await Promise.all([
      ...writingViews,
      writingIndex,
      writingUtils,
    ])

    return childFilePaths
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
      const css = encapsulateCSS(html)

      $el.html(css)
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
      })

      children.push(child)
      el = $('[af-el]')[0]
    }

    // Apply ignore rules AFTER child elements were plucked
    $('[af-ignore]').remove()
    // Empty inner HTML
    $('[af-empty]').html('').attr('af-empty', null)
    // Remove inline script tags. Will ensure Webflow runtime library and jQuery
    // are not loaded
    $('script').remove()

    // Wrapping with .af-container will apply encapsulated CSS
    const $body = $('body')
    const $afContainer = $('<span class="af-container"></span>')

    $afContainer.append($body.contents())
    $afContainer.prepend('\n  ')
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

  get html() {
    return this[_].html
  }

  get jsx() {
    return this[_].jsx
  }

  get sockets() {
    return this[_].sockets && [...this[_].sockets]
  }

  constructor(props) {
    super()

    this[_].children = []
    this.name = props.name
    this.html = props.html
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

  _compose(ctrlsDir) {
    return freeLint(`
      const React = require('react')
      ==>${this[_].composeChildImports()}<==

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

        render() {
          const proxies = Controller !== ${this.className} ? transformProxies(this.props.children) : {
            ==>${this[_].composeProxiesDefault()}<==
          }

          return (
            ==>${this.jsx}<==
          )
        }
      }

      module.exports = ${this.className}
    `)
  }

  _composeProxiesDefault() {
    return this[_].sockets.map((socket) => {
      return `'${socket}': [],`
    }).join('\n')
  }

  _composeChildImports() {
    const imports = this[_].children.map((child) => {
      return `const ${child.className} = require('./${child.className}')`
    })

    imports.push(`const { createScope, map, transformProxies } = require('./utils')`)

    return imports.join('\n')
  }
}

function bindJSX(jsx, children = []) {
  children.forEach((child) => {
    jsx = jsx.replace(
      new RegExp(`(?<!__)af-${child.elName}`, 'g'),
      `${child.className}.Controller`
    )
  })

  // ORDER MATTERS
  return jsx
    // Open close
    .replace(
      /<([\w._-]+)-af-sock-([\w_-]+)(.*?)>([^]*)<\/\1-af-sock-\2>/g, (
      match, el, sock, attrs, children
    ) => (
      // If there are nested sockets
      /<[\w._-]+-af-sock-[\w._-]+/.test(children) ? (
        `{map(proxies['${sock}'], props => <${el} ${mergeProps(attrs)}>{createScope(props.children, proxies => <React.Fragment>${bindJSX(children)}</React.Fragment>)}</${el}>)}`
      ) : (
        `{map(proxies['${sock}'], props => <${el} ${mergeProps(attrs)}>{props.children ? props.children : <React.Fragment>${children}</React.Fragment>}</${el}>)}`
      )
    ))
    // Self closing
    .replace(
      /<([\w._-]+)-af-sock-([\w_-]+)(.*?) \/>/g, (
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
