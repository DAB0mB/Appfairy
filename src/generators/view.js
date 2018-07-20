import CleanCSS from 'clean-css'
import htmlMinifier from 'html-minifier'
import { fs } from '../libs'
import { Internal, escapeBrackets, emptyDir, splitWords, upperFirst } from '../utils'
import Generator from './base'

const _ = Symbol('_ViewGenerator')
const cleanCSS = new CleanCSS()

@Internal(_)
class ViewGenerator extends Generator {
  static async saveAll(viewGenerators, dir) {
    dir += '/views'

    await emptyDir(dir)

    const savingViews = viewGenerators.map((viewGenerator) => {
      viewGenerator.save(dir)
    })

    const index = viewGenerators.map((viewGenerator) => {
      return `import './${viewGenerator.name}.js'`
    }).join('\n')

    const savingIndex = fs.writeFile(`${dir}/index.js`, index)

    return Promise.all([
      ...savingViews,
      savingIndex,
    ])
  }

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
          style.innerHTML = '${escapeBrackets(this.css)}'
        }

        initializeView(view) {
          view.innerHTML = '${escapeBrackets(this.html)}'
        }
      }

      Appfairy.View.define('${this.elName}', ${this.className})

      module.exports = ${this.className}
    `
  }

  save(dir) {
    return fs.writeFile(`${dir}/${this.name}.js`, this.generate())
  }
}

export default ViewGenerator