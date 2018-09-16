import fs from 'fs-extra'
import { promisify } from 'util'

export default promisify(fs.mkdirp)
