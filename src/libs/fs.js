import fs from 'fs'
import { promisify } from 'util'

export const mkdir = promisify(fs.mkdir)
export const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)

export default {
  mkdir,
  readdir,
  readFile,
  writeFile,
}
