import { ncp } from 'ncp'
import { promisify } from 'util'

export default promisify(ncp)
