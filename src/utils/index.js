export { default as Internal } from './internal'
export { default as requireText } from './requireText'

// Useful for nested strings that should be evaluated
export const escape = (str, quote) => {
  str = str.replace(/\\/g, '\\\\')

  switch (quote) {
    case "'": return str.replace(/'/g, "\\'")
    case '"': return str.replace(/"/g, '\\"')
    case '`': return str.replace(/`/g, '\\`')
    default: return str
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/`/g, '\\`')
  }
}

// Encapsulates all rules under .af-container
export const encapsulateCSS = (css) => {
  return css.replace(
    /((?:^|\{|\})\s*(?:\/\*[^]*?\*\/)?\s*)([^@{}]+?)(\s*\{)/g, (
    match, left, rule, right
  ) => {
    // Animation keyframe e.g. 50%
    if (/^\d/.test(rule)) return match
    // Empty line skip, probably after a media query or so
    if (!rule.trim()) return match

    // Apply for all selectors in rule
    rule = rule.replace(/([^\s][^,]*)(\s*,?)/g, '.af-container $1$2')

    return `${left}${rule}${right}`
  })
}

// Will use the shortest indention as an axis
export const freeText = (text) => {
  if (text instanceof Array) {
    text = text.join('')
  }

  // This will allow inline text generation with external functions, same as ctrl+shift+c
  // As long as we surround the inline text with ==>text<==
  text = text.replace(
    /( *)==>((?:.|\n)*?)<==/g,
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
    .replace(/\n +\n/g, '\n\n')
}

// Calls freeText() and disables lint
export const freeLint = (script) => {
  return freeText(`
    /* eslint-disable */

    ==>${freeText(script)}<==

    /* eslint-enable */
  `)
}

// Calls freeLint() and ensures that 'this' is represented by window
export const freeContext = (script) => {
  return freeLint(`
    (function() {

    ==>${freeText(script)}<==

    }).call(window)
  `)
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
    .filter(word => word.trim())
}

// abc 5 0 -> 00abc
export const padLeft = (str, length, char = ' ') => {
  str = String(str)
  length = parseInt(length + 1 - str.length)

  return Array(length).join(char) + str
}
