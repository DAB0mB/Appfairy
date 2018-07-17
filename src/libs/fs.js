import fs from 'fs'
import { promisify } from 'util'

export const readdir = promisify(fs.readdir.bind(ts))
export const readFile = promisify(fs.readFile.bind(ts))

export default {
  readdir,
  readFile,
}
