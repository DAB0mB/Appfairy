import uglify from 'uglify-js'
import { fs } from '../libs'
import { Internal, escapeBrackets, freeText } from '../utils'
import Generator from './base'

const _ = Symbol('_InitGenerator')

@Internal(_)
class InitGenerator extends Generator {
  get scripts() {
    return { ...this[_].scripts }
  }

  constructor() {
    super()

    this[_].scripts = []
  }

  generate() {
    return freeText `
      require('./views')

      const Appfairy = require('appfairy')

      const scripts = {
        -->${this[_].joinScripts()}<--
      }

      const loadingPromises = Object.keys(scripts).map((src) => {
        const script = scripts[src]
        const scriptEl = document.createElement('script')

        if (script === true) {
          scriptEl.src = src
        }
        else {
          scriptEl.innerHTML = script
        }

        return new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      })

      module.exports = Appfairy.loading = Promise.all(loadingPromises)
    `
  }

  save(dir) {
    return fs.writeFile(`${dir}/index.js`, this.generate())
  }

  setScript(src, script) {
    if (src) {
      this[_].scripts[src] = true
    }
    else {
      this[_].scripts.push(uglify.minify(script).code)
    }
  }

  _joinScripts() {
    return Object.keys(this.scripts).map((src) => {
      let script = this[_].scripts[src]

      if (script !== true) {
        script = "'" + escapeBrackets(script) + "'"
      }

      return `'${src}': ${script},`
    }).join('\n')
  }
}

export default InitGenerator
