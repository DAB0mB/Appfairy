import rimraf from 'rimraf'
import { promisify } from 'util'

export default promisify(rimraf)
