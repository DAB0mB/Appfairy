import cheerio from 'cheerio'
import CleanCSS from 'clean-css'
import htmlMinifier from 'html-minifier'
import { fs } from '../libs'
import Writer from './writer'

import {
  Internal,
  escapeBrackets,
  emptyDir,
  freeText,
  splitWords,
  upperFirst,
} from '../utils'

const _ = Symbol('_ViewWriter')
const cleanCSS = new CleanCSS({ inline: false })

@Internal(_)
class ViewWriter extends Writer {
  static async writeAll(viewWriters, dir) {
    dir += '/src/views'

    await emptyDir(dir)

    const writingViews = viewWriters.map((viewWriter) => {
      return viewWriter.write(dir)
    })

    const index = viewWriters.map((viewWriter) => {
      return `require('./${viewWriter.name}.js')`
    }).join('\n')

    const writingIndex = fs.writeFile(`${dir}/index.js`, index)

    return Promise.all([
      ...writingViews,
      writingIndex,
    ])
  }

  get children() {
    return this[_].chidlren.slice()
  }

  set name(name) {
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
      return
    }

    const $ = cheerio.load(html)

    this[_].children = $('> [af-el]').map((i, el) => {
      const $el = $(el)
      const elName = $el.attr('af-el')
      const $afEl = $(`<af-${elName}></af-${elName}>`)

      $el.removeAttr('af-el')
      $afEl.insertAfter($el)
      $el.remove()

      Object.keys($el.attr()).forEach((attrName) => {
        const attrValue = $el.attr(attrName)

        $afEl.attr(attrName, attrValue)
      })

      return new ViewWriter({
        name: elName,
        html: $el.html(),
        css: this.css,
      })
    }).toArray()

    // Will validate as well
    this[_].html = htmlMinifier.minify(html, {
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
      return child.write()
    })

    const writingSelf = fs.writeFile(`${dir}/${this.name}.js`, this[_].compose())

    return Promise.all([
      ...writingChildren,
      writingSelf,
    ])
  }

  _compose() {
    return freeText(`
      const Appfairy = require('appfairy')

      class ${this.className} extends Appfairy.View {
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
