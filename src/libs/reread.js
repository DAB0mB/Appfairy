import reread from 'recursive-readdir'
import { promisify } from 'util'

export default promisify(reread)
