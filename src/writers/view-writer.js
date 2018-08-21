import cheerio from 'cheerio'
import HTMLtoJSX from 'htmltojsx'
import pretty from 'pretty'
import statuses from 'statuses'
import { fs } from '../libs'
import Writer from './writer'

import {
  Internal,
  emptyDir,
  freeLint,
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
  static async writeAll(viewWriters, dir) {
    dir += '/src/views'

    await emptyDir(dir)

    viewWriters = flattenChildren(viewWriters)

    const writingViews = viewWriters.map((viewWriter) => {
      return viewWriter.write(dir)
    })

    const index = viewWriters.map((viewWriter) => {
      return `exports.${viewWriter.className} = require('./${viewWriter.name}')`
    }).join('\n')

    const writingIndex = fs.writeFile(`${dir}/index.js`, freeLint(index))

    return Promise.all([
      ...writingViews,
      writingIndex,
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

    let jsx = htmltojsx.convert(html).trim()

    children.forEach((child) => {
      jsx = jsx.replace(
        new RegExp(`af-${child.elName}`, 'g'),
        `${child.className}.Controller`
      )
    })

    this[_].jsx = jsx
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
          return (
            ==>${this.jsx}<==
          )
        }
      }

      module.exports = ${this.className}
    `)
  }

  _composeChildImports() {
    return this[_].children.map((child) => {
      return `const ${child.className} = require('./${child.className}')`
    }).join('\n')
  }
}

export default ViewWriter
