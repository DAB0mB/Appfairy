/* eslint-disable */

const React = require('react')

exports.transformProxies = (children = []) => {
  const proxies = {}

  React.Children.forEach(children, (child) => {
    const props = proxies[child.type] = Object.assign({}, child.props)

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

/* eslint-enable */
