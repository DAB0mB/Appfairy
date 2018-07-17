import uglify from 'uglify'
import { freeText } from '../utils'
import Generator, { _ } from './base'

class InitGenerator extends Generator {
  get scripts() {
    return { ...this[_].scripts }
  }

  constructor() {
    super()

    Object.assign(this[_], {
      scripts: []
    })
  }

  generate() {
    const scripts = this.scripts

    return freeText `
      const Appfairy = require('appfairy')

      const scripts = {
        -->${this.joinScripts()}<--
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

  setScript(src, script) {
    if (src == null) {
      this[_].scripts.push(minify(script))
    }
    else {
      this[_].scripts[src] = true
    }
  }
}

Object.assign(InitGenerator.prototype[_], {
  joinScripts() {
    return Object.keys(this.scripts).map((src) => {
      let script = this[_].scripts[src]

      if (script !== true) {
        script = "'" + uglify.minify(script).code.replace(/'/g, "\\'") + "'"
      }

      return `'${src}': ${script},`
    }).join('\n')
  },
})

export default InitGenerator
