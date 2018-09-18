import path from 'path'
import { requireText } from '../utils'

const resolve = filename => path.resolve(__dirname, '../src/raw', filename)

// Exporting an object since we're dealing with a getter
export default {
  get viewHelpers() {
    return requireText(resolve('viewHelpers.js'))
  }
}
