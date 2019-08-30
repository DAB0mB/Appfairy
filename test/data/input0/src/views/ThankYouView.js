/* eslint-disable */

const React = require('react')
const { transformProxies } = require('./utils')

let Controller

class ThankYouView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/ThankYouController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = ThankYouView

        return Controller
      }

      throw e
    }
  }

  render() {
    const proxies = Controller !== ThankYouView ? transformProxies(this.props.children) : {
      'message': {},
    }

    return (
      <div>
        <div className="__af-section __af-top-bar">
          <div className="__af-container __af-w-container"><a href="tel:1800 529 636" className="__af-button __af-top-button __af-w-button">Free Call! 1800 529 636</a></div>
        </div>
        <div className="__af-section-2">
          <div className="__af-w-container">
            <div className="__af-div-block-2"><img src="images/Laymens-Law-and-Finance.png" width={200} className="__af-image" /></div>
          </div>
        </div>
        <div id="contact" className="__af-section-3 __af-thanks">
          <div className="__af-container-2 __af-thank-you __af-w-container">
            {proxies['message'] && <h1 className="__af-heading-3 __af-ty" {...proxies['message']}>{proxies['message'].children ? proxies['message'].children : <React.Fragment>Thank You!</React.Fragment>}</h1>}
            <p className="__af-paragraph-3">We have received your enquiry. Someone from our team will get back to you as soon as possible.</p>
          </div>
        </div>
        <div className="__af-section-8">
          <div className="__af-w-container">
            <div className="__af-text-block-2">© 2018 Laymens Group</div>
          </div>
        </div>
        {/* [if lte IE 9]><![endif] */}
      </div>
    )
  }
}

module.exports = ThankYouView

/* eslint-enable */