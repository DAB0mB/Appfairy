import * as babel from 'babel-core'
import path from 'path'
import uglify from 'uglify-js'
import { requireText } from '../utils'

const resolve = filename => path.resolve(__dirname, '../src/patches', filename)

// Exporting an object since we're dealing with a getter
export default {
  get webflow() {
    return requireText(resolve('webflow.js'), (code) => {
      return uglify.minify(
        babel.transform(code, {
          presets: [path.resolve(__dirname, '../node_modules/babel-preset-env')],
        }).code
      ).code
    });
  }
}
