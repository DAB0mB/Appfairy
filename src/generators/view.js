import cheerio from 'cheerio'
import CleanCSS from 'clean-css'
import htmlMinifier from 'html-minifier'
import { fs } from '../libs'
import Generator from './base'

import {
  Internal,
  escapeBrackets,
  emptyDir,
  freeText,
  splitWords,
  upperFirst,
} from '../utils'

const _ = Symbol('_ViewGenerator')
const cleanCSS = new CleanCSS({ inline: false })

@Internal(_)
class ViewGenerator extends Generator {
  static async saveAll(viewGenerators, dir) {
    dir += '/views'

    await emptyDir(dir)

    const savingViews = viewGenerators.map((viewGenerator) => {
      return viewGenerator.save(dir)
    })

    const index = viewGenerators.map((viewGenerator) => {
      return `require('./${viewGenerator.name}.js')`
    }).join('\n')

    const savingIndex = fs.writeFile(`${dir}/index.js`, index)

    return Promise.all([
      ...savingViews,
      savingIndex,
    ])
  }

  get children() {
    return this[_].chidlren.slice()
  }

  set name(name) {
    Object.assign(this[_], {
      className: splitWords(name).map(upperFirst).join(''),
      elName: splitWords(name).map(word => word.toLowerCase()).join('-'),
      name:  splitWords(name).map(word => word.toLowerCase()).join('_'),
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
      const $afEl = $(`<af-${elName}><af-${elName} />`)

      $el.removeAttr('af-el')
      $afEl.insertAfter($el)
      $el.remove()

      Object.keys($el.attr()).forEach((attrName) => {
        const attrValue = $el.attr(attrName)

        $afEl.attr(attrName, attrValue)
      })

      return new ViewGenerator({
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

  generate() {
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

  save(dir) {
    const savingChildren = this[_].children.map((child) => {
      return child.save()
    })

    const savingSelf = fs.writeFile(`${dir}/${this.name}.js`, this.generate())

    return Promise.all([
      ...savingChildren,
      savingSelf,
    ])
  }
}

export default ViewGenerator
