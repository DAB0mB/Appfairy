/* eslint-disable */

const React = require('react')

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

exports.getPropertyDescriptors = (obj) => {
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

exports.delegate = (src) => {
  const descriptors = getPropertyDescriptors(document)
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

/* eslint-enable */
