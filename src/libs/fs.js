import fs from 'fs'
import { promisify } from 'util'

export const mkdir = promisify(fs.mkdir)
export const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)
export const stat = promisify(fs.stat)
export const unlink = promisify(fs.unlink)
export const writeFile = promisify(fs.writeFile)

export const exists = (path) => {
  return new Promise((resolve) => {
    fs.stat(path, (err) => {
      resolve(!err)
    })
  })
}

export default {
  exists,
  mkdir,
  readdir,
  readFile,
  stat,
  unlink,
  writeFile,
}
