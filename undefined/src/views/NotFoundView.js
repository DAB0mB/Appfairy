/* eslint-disable */

const React = require('react')
const { transformProxies } = require('./utils')

let Controller

class NotFoundView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/NotFoundController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = NotFoundView

        return Controller
      }

      throw e
    }
  }

  render() {
    const proxies = Controller !== NotFoundView ? transformProxies(this.props.children) : {

    }

    return (
      <div className="__af-utility-page-wrap">
        <div className="__af-utility-page-content"><img src="https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg" />
          <h2>Page not found</h2>
          <div>The page you are looking for doesn't exist or has been moved.</div>
        </div>
      </div>
      {/* [if lte IE 9]><![endif] */}
    )
  }
}

module.exports = NotFoundView

/* eslint-enable */