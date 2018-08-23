import cheerio from 'cheerio'
import csstree from 'css-tree'
import HTMLtoJSX from 'htmltojsx'
import path from 'path'
import pretty from 'pretty'
import statuses from 'statuses'
import { fs } from '../libs'
import Writer from './writer'

import {
  emptyDir,
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
  static async writeAll(viewWriters, dir) {
    dir += '/src/views'

    await emptyDir(dir)

    viewWriters = flattenChildren(viewWriters)

    const writingViews = viewWriters.map((viewWriter) => {
      return viewWriter.write(dir)
    })

    const index = viewWriters.map((viewWriter) => {
      return `exports.${viewWriter.className} = require('./${viewWriter.className}')`
    }).join('\n')

    const writingIndex = fs.writeFile(`${dir}/index.js`, freeLint(index))
    const writingUtils = fs.writeFile(`${dir}/utils.js`, viewUtils)

    return Promise.all([
      ...writingViews,
      writingIndex,
      writingUtils,
    ])
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
      className: words.concat('view').map(upperFirst).join(''),
      elName: words.map(word => word.toLowerCase()).join('-'),
      name:  words.concat('view').map(word => word.toLowerCase()).join('-'),
    })
  }

  get name() {
    return this[_].name
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
      const ast = csstree.parse($el.html())

      csstree.walk(ast, (node) => {
        if (node.type == 'ClassSelector') {
          node.name = `__af-${node.name}`;
        }
      })

      $el.html(csstree.generate(ast))
    })

    $('*').each((i, el) => {
      const $el = $(el)
      let className = $el.attr('class')

      if (className && !/__af-/.test(className)) {
        className = className.replace(/([\w_-]+)/g, '__af-$1')
        $el.attr('class', className)
      }
    })

    let el = $('[af-el]')[0]

    while (el) {
      const $el = $(el)
      const elName = $el.attr('af-el')
      const $afEl = $(`<af-${elName}></af-${elName}>`)

      $el.removeAttr('af-el')
      $afEl.attr($el.attr())
      $afEl.insertAfter($el)
      $el.remove()

      Object.keys($el.attr()).forEach((attrName) => {
        const attrValue = $el.attr(attrName)

        $afEl.attr(attrName, attrValue)
      })

      const child = new ViewWriter({
        name: elName,
        html: $el.html(),
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

    html = $('body').html()
    html = pretty(html)

    this[_].html = html

    $('[af-sock]').each((i, el) => {
      const $el = $(el)
      const socketName = $el.attr('af-sock')
      $el.attr('af-sock', null)
      // Workaround would help identify the closing tag
      el.tagName += `-af-sock-${socketName}`
    })

    // Transforming HTML into JSX
    let jsx = htmltojsx.convert($('body').html()).trim()
    // Bind controller to view
    this[_].jsx = bindJSX(jsx, children)
  }

  get html() {
    return this[_].html
  }

  get jsx() {
    return this[_].jsx
  }

  constructor(props) {
    super()

    this[_].children = []
    this.name = props.name
    this.html = props.html
  }

  write(dir) {
    const writingChildren = this[_].children.map((child) => {
      return child.write(dir)
    })

    const writingSelf = fs.writeFile(`${dir}/${this.className}.js`, this[_].compose())

    return Promise.all([
      ...writingChildren,
      writingSelf,
    ])
  }

  _compose() {
    return freeLint(`
      const React = require('react')
      ==>${this[_].composeChildImports()}<==

      class ${this.className} extends React.Component {
        render() {
          const proxies = transformProxies(this.props.children)

          return (
            ==>${this.jsx}<==
          )
        }
      }

      module.exports = ${this.className}
    `)
  }

  _composeChildImports() {
    const imports = this[_].children.map((child) => {
      return `const ${child.className} = require('./${child.className}')`
    })

    imports.push(`const { transformProxies } = require('./utils')`)

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
      /<([\w._-]+)-af-sock-([\w_-]+)(.*?)>([^]*)<\/\1-af-sock-\2>/g,
      "{proxies['$2'] && <$1$3 {...proxies['$2']}>{proxies['$2'].children ? proxies['$2'].children : <React.Fragment>$4</React.Fragment>}</$1>}"
    )
    // Self closing
    .replace(
      /<([\w._-]+)-af-sock-([\w_-]+)(.*?) \/>/g,
      "{proxies['$2'] && <$1$3 {...proxies['$2']}>{proxies['$2'].children}</$1>}"
    )
}

export default ViewWriter
