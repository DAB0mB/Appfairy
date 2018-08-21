/* eslint-disable */

const React = require('react')

exports.transformProxies = (children) => {
  const proxies = {}

  React.Children.forEach((child) => {
    proxies[child.type] = Object.assign({}, child.props)

    if (child.hasOwnProperty('key')) {
      props.key = child.key
    }

    if (child.hasOwnProperty('ref')) {
      props.ref = child.ref
    }
  })

  return proxies
}

/* eslint-enable */
