import mkdirp from 'mkdirp'
import { promisify } from 'util'

export default promisify(mkdirp)
