import { readFile, readFileSync } from 'fs'
import resolvePath from 'resolve'

const cache = {}

const requireText = (path) => {
  path = resolvePath.sync(path)

  return cache[path] = cache[path] || readFileSync(path).toString()
}

requireText.promise = (path) => new Promise((resolve, reject) => {
  resolvePath(path, (err, path) => {
    if (err) {
      return reject(err)
    }

    let content = cache[path]

    if (content) {
      return resolve(content)
    }

    readFile(path, (err, content) => {
      if (err) {
        return reject(err)
      }

      cache[path] = content = content.toString()

      resolve(content)
    })
  })
})

export default requireText
