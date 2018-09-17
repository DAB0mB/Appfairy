/* eslint-disable */

const React = require('react')

const getPropertyDescriptors = (obj) => {
  const descriptors = {}
  let proto = obj

  do {
    const protoDescriptors = Object.getOwnPropertyDescriptors(proto)

    Object.entries(protoDescriptors).forEach(([key, descriptor]) => {
      descriptors[key] = descriptor
    })
  } while (proto = proto.__proto__)

  return descriptors
}

const flattenPrototypes = (src) => {
  const descriptors = getPropertyDescriptors(src)
  const dst = {}

  Object.entries(descriptors).forEach(([key, descriptor]) => {
    if (!descriptor.hasOwnProperty('value')) {
      descriptor.configurable = true

      descriptor.get = () => {
        return src[key]
      }

      descriptor.set = (value) => {
        return src[key] = value
      }
    }
    else if (typeof descriptor.value == 'function') {
      const fn = descriptor.value
      descriptor.configurable = true
      descriptor.writable = true

      descriptor.value = function () {
        return fn.apply(src, arguments)
      }
    }
    else {
      delete descriptor.value
      delete descriptor.writable
      descriptor.configurable = true

      descriptor.get = () => {
        return src[key]
      }

      descriptor.set = (value) => {
        return src[key] = value
      }
    }

    Object.defineProperty(dst, key, descriptor)
  })

  return dst
}

exports.transformProxies = (children = []) => {
  const proxies = {}

  React.Children.forEach(children, (child) => {
    const props = Object.assign({}, child.props)

    if (!proxies[child.type]) {
      proxies[child.type] = props
    }
    else if (!(proxies[child.type] instanceof Array)) {
      proxies[child.type] = [proxies[child.type], props]
    }
    else {
      proxies[child.type].push(props)
    }

    if (child.key != null) {
      props.key = child.key
    }

    if (child.ref != null) {
      props.ref = child.ref
    }
  })

  return proxies
}

exports.createScope = (children, callback) => {
  const proxies = exports.transformProxies(children)

  return callback(proxies)
}

exports.map = (props, callback) => {
  if (props == null) return null
  if (!(props instanceof Array)) return callback(props)

  return props.map(callback)
}

const flatDocument = flattenPrototypes(document)
exports.fabricateDocument = (node) => {
  const document = Object.create(flatDocument, {
    getElementsByClassName: {
      configurable: true,
      enumerable: true,
      writable: true,
      value(className) {
        return node.getElementsByClassName('af-class' + className)
      }
    },
    querySelector: {
      configurable: true,
      enumerable: true,
      writable: true,
      value(query) {
        query = query
          .replace(/\.([\w_-]+)/g, '.af-class-$1')
          .replace(/\[class(.?)="( ?)([^"]+)( ?)"\]/g, '[class$1="$2af-class-$3$4"]')

        return node.querySelector(query)
      }
    },
    querySelectorAll: {
      configurable: true,
      enumerable: true,
      writable: true,
      value(query) {
        query = query
          .replace(/\.([\w_-]+)/g, '.af-class-$1')
          .replace(/\[class(.?)="( ?)([^"]+)( ?)"\]/g, '[class$1="$2af-class-$3$4"]')

        return node.querySelectorAll(query)
      }
    },
  })

  return document
}

const flatWindow = flattenPrototypes(window)
exports.fabricateWindow = (document) => {
  const window = Object.create(flatWindow, {
    document: {
      configurable: true,
      enumerable: true,
      get() {
        return document
      }
    },
    window: {
      configurable: true,
      enumerable: true,
      get() {
        return window
      }
    },
  })

  return window
}

/* eslint-enable */
