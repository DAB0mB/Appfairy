import rimraf from 'rimraf'
import { promisify } from 'util'
import { fs } from '../libs'

export { default as Internal } from './internal'

// Ensure dir exists and is empty
export const emptyDir = async (dir) => {
  await promisify(rimraf)(dir)

  return fs.mkdir(dir)
}

// Useful for nested strings that should be evaluated
export const escapeBrackets = (str) => {
  return str
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
}

// Will use the shortest indention as an axis
export const freeText = (text) => {
  if (text instanceof Array) {
    text = text.join('')
  }

  // This will allow inline text generation with external functions, same as ctrl+shift+c
  // As long as we surround the inline text with -->text<--
  text = text.replace(
    /( *)-->((?:.|\n)*)<--/g,
    (match, baseIndent, content) =>
  {
    return content
      .split('\n')
      .map(line => `${baseIndent}${line}`)
      .join('\n')
  })

  const lines = text.split('\n')

  const minIndent = lines.filter(line => line.trim()).reduce((minIndent, line) => {
    const currIndent = line.match(/^ */)[0].length

    return currIndent < minIndent ? currIndent : minIndent
  }, Infinity)

  return lines
    .map(line => line.slice(minIndent))
    .join('\n')
    .trim()
}

// upper -> Upper
export const upperFirst = (str) => {
  return str.substr(0, 1).toUpperCase() + str.substr(1)
}

// foo_barBaz -> ['foo', 'bar', 'Baz']
export const splitWords = (str) => {
  return str
    .replace(/[A-Z]/, ' $&')
    .split(/[^a-zA-Z0-9]+/)
}
