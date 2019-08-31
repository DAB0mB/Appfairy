/* eslint-disable */

const React = require('react')
const { transformProxies } = require('./utils')

let Controller

class ContactFormView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/ContactFormController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = ContactFormView

        return Controller
      }

      throw e
    }
  }

  render() {
    const proxies = Controller !== ContactFormView ? transformProxies(this.props.children) : {
      'name': {},
      'submit': {},
    }

    return (
      <div className="__af-div-block">
        <h3 className="__af-heading-7">Looking for a <strong>FREE</strong> <br />phone consultation?</h3>
        <div className="__af-w-form">
          <form id="email-form" name="email-form" data-name="Email Form" data-redirect="/thank-you" redirect="/thank-you"><label htmlFor="name" className="__af-field-label">Name:</label>{proxies['name'] && <input type="text" className="__af-w-input" maxLength={256} name="name" data-name="Name" placeholder="Enter your name" id="name" {...proxies['name']}>{proxies['name'].children}</input>}<label htmlFor="Phone" className="__af-field-label-2">Email Address:</label><input type="text" className="__af-w-input" maxLength={256} name="Phone" data-name="Phone" placeholder="Phone Number" id="Phone" required /><input type="text" className="__af-w-input" maxLength={256} name="email" data-name="Email" placeholder="Enter your email" id="email" required /><textarea id="Message" name="Message" placeholder="How can we help?" maxLength={5000} data-name="Message" className="__af-textarea __af-w-input" defaultValue={""} />{proxies['submit'] && <input type="submit" value="Submit" data-wait="Please wait..." className="__af-button __af-w-button" {...proxies['submit']}>{proxies['submit'].children}</input>}</form>
          <div className="__af-w-form-done">
            <div>Thank you! Your submission has been received!</div>
          </div>
          <div className="__af-w-form-fail">
            <div>Oops! Something went wrong while submitting the form.</div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ContactFormView

/* eslint-enable */