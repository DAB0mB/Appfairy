import { readFileSync } from 'fs'
import resolve from 'resolve'

const cache = {}

export default (path) => {
  return cache[path] = cache[path] || readFileSync(
    resolve.sync(path)
  ).toString()
}
