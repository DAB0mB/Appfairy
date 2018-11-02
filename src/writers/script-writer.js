import fetch from 'node-fetch'
import path from 'path'
import uglify from 'uglify-js'
import { fs, mkdirp } from '../libs'
import Writer from './writer'

import {
  Internal,
  escape,
  freeText,
  freeLint,
  freeContext,
  padLeft,
  requireText,
} from '../utils'

const _ = Symbol('_ScriptWriter')

@Internal(_)
class ScriptWriter extends Writer {
  get scripts() {
    return this[_].scripts.slice()
  }

  get prefetch() {
    return this[_].prefetch
  }

  set prefetch(prefetch) {
    return this[_].prefetch = !!prefetch
  }

  get baseUrl() {
    return this[_].baseUrl
  }

  set baseUrl(baseUrl) {
    this[_].baseUrl = String(baseUrl)
  }

  constructor(options = {}) {
    super()

    this[_].scripts = []

    this.baseUrl = options.baseUrl
    this.prefetch = options.prefetch
  }

  async write(dir, options) {
    await mkdirp(dir)

    options = {
      ...options,
      prefetch: this.prefetch,
    }

    const indexFilePath = `${dir}/index.js`
    const childFilePaths = [indexFilePath]

    if (!options.prefetch) {
      await fs.writeFile(indexFilePath, this[_].composeScriptLoader())
      return childFilePaths
    }

    const scriptFileNames = this.scripts.map((script, index, { length }) => {
      const fileName = padLeft(index, length / 10 + 1, 0) + '.js'
      const filePath = `${dir}/${fileName}`
      childFilePaths.push(filePath)

      return fileName
    })

    const fetchingScripts = this.scripts.map(async (script, index) => {
      const scriptFileName = scriptFileNames[index]

      let code = script.type == 'code'
        ? script.body
        : /^http/.test(script.body)
        ? await fetch(script.body)
          .then(res => res.text())
          .then(text => uglify.minify(text).code)
        : requireText(`${this.baseUrl}/${script.body}`)
      code = code.replace(/\n\/\/# ?sourceMappingURL=.*\s*$/, '')
      code = freeContext(code)

      return fs.writeFile(`${dir}/${scriptFileName}`, code)
    })

    const scriptsIndexContent = scriptFileNames.map((scriptFileName) => {
      return `import './${scriptFileName}'`
    }).join('\n')

    const writingIndex = fs.writeFile(
      indexFilePath,
      freeLint(scriptsIndexContent),
    )

    await Promise.all([
      ...fetchingScripts,
      writingIndex,
    ])

    return childFilePaths
  }

  setScript(src, content) {
    let type
    let body

    if (src) {
      type = 'src'
      body = /^\w+:\/\//.test(src) ? src : path.resolve('/', src)
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

  _composeScriptLoader() {
    const scripts = this[_].scripts.map((script) => {
      return freeText(`
        {
          type: '${script.type}',
          body: '${escape(script.body, "'")}',
        },
      `)
    }).join('\n')

    return freeLint(`
      const scripts = [
        ==>${scripts}<==
      ]

      const loadingScripts = scripts.reduce((loaded, script) => loaded.then(() => {
        const scriptEl = document.createElement('script')
        scriptEl.type = 'text/javascript'
        let loading

        if (script.type == 'src') {
          scriptEl.src = script.body

          loading = new Promise((resolve, reject) => {
            scriptEl.onload = resolve
            scriptEl.onerror = reject
          })
        }
        else {
          scriptEl.innerHTML = script.body

          loading = Promise.resolve()
        }

        document.head.appendChild(scriptEl)

        return loading
      }), Promise.resolve())

      export default loadingScripts
    `)
  }
}

export default ScriptWriter
