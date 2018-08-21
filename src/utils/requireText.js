import { readFile, readFileSync } from 'fs'
import resolve from 'resolve'

const cache = {}

const requireText = (path) => {
  path = resolve.sync(path)

  return cache[path] = cache[path] || readFileSync(path).toString()
}

requireText.promise = (path) => new Promise((resolve, reject) => {
  resolve(path, (err, path) => {
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
