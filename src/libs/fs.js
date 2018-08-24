import fs from 'fs'
import { promisify } from 'util'

export const mkdir = promisify(fs.mkdir)
export const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)
export const stat = promisify(fs.stat)
export const unlink = promisify(fs.unlink)
export const writeFile = promisify(fs.writeFile)

export default {
  mkdir,
  readdir,
  readFile,
  stat,
  unlink,
  writeFile,
}
