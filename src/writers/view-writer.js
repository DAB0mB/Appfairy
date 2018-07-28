import cheerio from 'cheerio'
import CleanCSS from 'clean-css'
import htmlMinifier from 'html-minifier'
import statuses from 'statuses'
import { fs } from '../libs'
import Writer from './writer'

import {
  Internal,
  escapeBrackets,
  emptyDir,
  freeLint,
  splitWords,
  upperFirst,
} from '../utils'

const _ = Symbol('_ViewWriter')
const cleanCSS = new CleanCSS({ inline: false })

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
      return `require('./${viewWriter.name}')`
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
        css: this.css,
      })

      children.push(child)
      el = $('[af-el]')[0]
    }

    // Will validate as well
    this[_].html = htmlMinifier.minify($('body').html(), {
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      collapseWhitespace: true,
    })
  }

  get html() {
    return this[_].html
  }

  set css(css) {
    // Will validate as well
    this[_].css = css ? cleanCSS.minify(css).styles : ''
  }

  get css() {
    return this[_].css
  }

  constructor(props) {
    super()

    this[_].children = []
    this.name = props.name
    this.css = props.css
    this.html = props.html
  }

  // Unlike the setter, this will only minify the appended CSS
  appendCSS(css) {
    this[_].css += cleanCSS.minify(css).styles
  }

  write(dir) {
    const writingChildren = this[_].children.map((child) => {
      return child.write(dir)
    })

    const writingSelf = fs.writeFile(`${dir}/${this.name}.js`, this[_].compose())

    return Promise.all([
      ...writingChildren,
      writingSelf,
    ])
  }

  _compose() {
    return freeLint(`
      const Appfairy = require('appfairy')

      class ${this.className} extends Appfairy.View(HTMLElement) {
        initializeStyle(style) {
          style.innerHTML = '${escapeBrackets(this.css)}'
        }

        initializeView(view) {
          view.innerHTML = '${escapeBrackets(this.html)}'
        }
      }

      Appfairy.View.define('${this.elName}', ${this.className})

      module.exports = ${this.className}
    `)
  }
}

export default ViewWriter
