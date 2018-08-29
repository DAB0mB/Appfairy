/* eslint-disable */

const React = require('react')
const { transformProxies } = require('./utils')

let Controller

class UnauthorizedView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/UnauthorizedController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = UnauthorizedView

        return Controller
      }

      throw e
    }
  }

  render() {
    const proxies = Controller !== UnauthorizedView ? transformProxies(this.props.children) : {

    }

    return (
      <div className="__af-utility-page-wrap">
        <div className="__af-utility-page-content __af-w-password-page __af-w-form">
          <form method="post" action="/.wf_auth" className="__af-utility-page-form __af-w-password-page"><img src="https://d3e54v103j8qbb.cloudfront.net/static/password-page-lock.832ca8e2c9.svg" />
            <h2>Protected page</h2>
            <div style={{display: 'none'}} className="__af-w-password-page __af-w-embed __af-w-script"><input type="hidden" name="path" defaultValue="<%WF_FORM_VALUE_PATH%>" /><input type="hidden" name="page" defaultValue="<%WF_FORM_VALUE_PAGE%>" /></div><input type="password" name="pass" placeholder="Enter your password" maxLength={256} autofocus="true" className="__af-w-password-page __af-w-input" /><input type="submit" defaultValue="Submit" data-wait="Please wait..." className="__af-w-password-page __af-w-button" /></form>
          <div className="__af-w-password-page __af-w-form-fail">
            <div>Incorrect password. Please try again.</div>
          </div>
          <div style={{display: 'none'}} className="__af-w-password-page __af-w-embed __af-w-script">
          </div>
        </div>
      </div>
      {/* [if lte IE 9]><![endif] */}
    )
  }
}

module.exports = UnauthorizedView

/* eslint-enable */