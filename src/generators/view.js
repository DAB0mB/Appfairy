import CleanCSS from 'clean-css'
import htmlMinifier from 'html-minifier'
import { splitWords, upperFirst } from '../utils'
import Generator, { _ } from './generator'

const cleanCSS = new CleanCSS()

class ViewGenerator extends Generator {
  set name(name) {
    if (typeof name != 'string') {
      throw TypeError('ViewGenerator.name must be a string')
    }

    Object.assign(this[_], {
      className: splitWords(name).map(upperFirst).join(''),
      elName: 'af-' + splitWords(name).map(word => word.toLowerCase()).join(''),
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
    // Will validate as well
    this[_].html = htmlMinifier.minify(html)
  }

  get html() {
    return this[_].html
  }

  set css(css) {
    // Will validate as well
    this[_].css = cleanCSS.minify(css)
  }

  get css() {
    return this[_].css
  }

  constructor(props) {
    super()

    this.name = props.name
    this.css = props.css
    this.html = props.html
  }

  // Unlike the setter, this will only minify the appended CSS
  appendCSS(css) {
    this[_].css += cleanCSS.minify(css)
  }

  generate() {
    return freeText `
      const Appfairy = require('appfairy')

      class ${this.className} extends Appfairy.View {
        initializeStyle(style) {
          style.innerHTML = '${this.css.replace(/'/g, "\\'")}'
        }

        initializeView(view) {
          view.innerHTML = '${this.html.replace(/'/g, "\\'")}'
        }
      }

      Appfairy.View.define('${this.elName}', ${this.className})

      module.exports = ${this.className}
    `
  }
}
