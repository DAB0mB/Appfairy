import uglify from 'uglify-js'
import { fs } from '../libs'
import { Internal, escapeBrackets, freeText } from '../utils'
import Generator from './base'

const _ = Symbol('_InitGenerator')

@Internal(_)
class InitGenerator extends Generator {
  get scripts() {
    return this[_].scripts.slice()
  }

  constructor() {
    super()

    this[_].scripts = []
  }

  generate() {
    return freeText(`
      require('./views')

      const Appfairy = require('appfairy')

      const scripts = [
        -->${this[_].joinScripts()}<--
      ]

      const loadingPromises = scripts.map((script) => {
        const scriptEl = document.createElement('script')
        scriptEl.setAttribute('type', 'text/javascript')

        if (script.type == 'src') {
          scriptEl.src = script.body
        }
        else {
          scriptEl.innerHTML = script.body
        }

        return new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      })

      module.exports = Appfairy.loading = Promise.all(loadingPromises)
    `)
  }

  save(dir) {
    return fs.writeFile(`${dir}/index.js`, this.generate())
  }

  setScript(src, content) {
    let type
    let body

    if (src) {
      type = 'src'
      body = src
    }
    else {
      type = 'code'
      body = uglify.minify(content).code
    }

    const exists = this[_].scripts.some((script) => {
      return script.body == body
    })

    if (!exists) {
      this[_].scripts.push({ type, body })
    }
  }

  _joinScripts() {
    return this[_].scripts.map((script) => {
      return freeText(`
        {
          type: '${script.type}',
          body: '${escapeBrackets(script.body)}',
        },
      `)
    }).join('\n')
  }
}

export default InitGenerator
