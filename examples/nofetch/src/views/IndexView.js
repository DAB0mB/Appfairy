/* eslint-disable */

const React = require('react')
const ContactFormView = require('./ContactFormView')
const { transformProxies } = require('./utils')

let Controller

class IndexView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/IndexController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = IndexView

        return Controller
      }

      throw e
    }
  }

  render() {
    const proxies = Controller !== IndexView ? transformProxies(this.props.children) : {
      'contact-form': {},
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
        <div id="contact" className="__af-section-3">
          <div className="__af-container-2 __af-w-container">
            <h1 className="__af-heading-3">Registered Immigration Agent in Sydney, Australia</h1>
            {proxies['contact-form'] && <ContactFormView.Controller {...proxies['contact-form']}>{proxies['contact-form'].children}</ContactFormView.Controller>}
          </div>
        </div>
        <div className="__af-section-5">
          <div className="__af-w-container">
            <h3 className="__af-heading">Not sure which immigration visa to apply for?<br /><br />Our migration agents advise the best visa options to you based on your personal situation.</h3>
            <div className="__af-row __af-w-row">
              <div className="__af-blurb __af-w-col __af-w-col-3 __af-w-col-small-6"><img src="images/10543173-0-icon1-1_110543173-0-icon1-1.png" className="__af-image-2" />
                <h4>Student Migration</h4>
                <p className="__af-paragraph-2">For any students or graduates planning to migrate to Australia, our expert show you the right path of achieving your goals.</p>
              </div>
              <div className="__af-blurb __af-w-col __af-w-col-3 __af-w-col-small-6"><img src="images/10543178-0-icon2-1_110543178-0-icon2-1.png" className="__af-image-2" />
                <h4>Permanent Residency</h4>
                <p className="__af-paragraph-2">- General Skilled Migration<br />- Specialist Entry Migration<br />- Employer Sponsored Migration<br />- Visitor Migration</p>
              </div>
              <div className="__af-blurb __af-w-col __af-w-col-3 __af-w-col-small-6"><img src="images/10543188-0-icon3-1_110543188-0-icon3-1.png" className="__af-image-2" />
                <h4>Family Migration</h4>
                <p className="__af-paragraph-2">There are a number of visa options for partners, fiancés, children &amp; parents.&nbsp;<br /><br />- Partner Visa<br />- Children Visa<br />- Parents Visa</p>
              </div>
              <div className="__af-blurb __af-w-col __af-w-col-3 __af-w-col-small-6"><img src="images/10543173-0-icon1-1_110543173-0-icon1-1.png" className="__af-image-2" />
                <h4>Business Migration</h4>
                <p className="__af-paragraph-2">Business owners or investors could stay in Australia on a temporary &amp; permanent basis:<br /><br />- Business Innovation &amp; Investment Visa<br />- Business Talent Visa<br />- Investor Retirement Visa</p>
              </div>
            </div>
          </div>
        </div>
        <div className="__af-section-6">
          <div className="__af-w-container">
            <h3 className="__af-heading">Meet Our Team</h3>
            <div className="__af-row-2 __af-w-row">
              <div className="__af-blurb __af-w-col __af-w-col-4"><img src="images/10541288-0-hshot1.png" width={150} className="__af-image-3" />
                <h4 className="__af-heading-5">Benjamin Hakim</h4>
                <h5 className="__af-heading-4">Principal Director</h5>
                <p className="__af-paragraph-2">- Lawyer<br />- Registered Migration Agent<br />- Benjamin is fluent in Arabic&nbsp;<br />- He has assisted many Arabic speaking clients successfully migrate to or remain in Australia</p>
              </div>
              <div className="__af-blurb __af-w-col __af-w-col-4"><img src="images/10541298-0-hshot2.png" width={150} className="__af-image-3" />
                <h4 className="__af-heading-5">Silvia Levame</h4>
                <h5 className="__af-heading-4">Senior Consultant</h5>
                <p className="__af-paragraph-2">- Registered Foreign Lawyer<br />- Migration Agent &amp; Licensed Conveyancer<br />- Benjamin is fluent in Arabic&nbsp;<br />- Over 40 years experience in the legal profession</p>
              </div>
              <div className="__af-w-col __af-w-col-4"><img src="images/10541308-0-hshot3.png" width={150} className="__af-image-3" />
                <h4 className="__af-heading-5">Emma Drynan</h4>
                <h5 className="__af-heading-4">Consultant</h5>
                <p className="__af-paragraph-2">- Registered Migration Agent<br />- Fluent in Mandarin<br />- She has helped many Chinese immigrants establish themselves and their businesses in Australia.</p>
              </div>
            </div>
          </div><a href="#contact" className="__af-button __af-w-button">Contact Us</a></div>
        <div className="__af-section-4">
          <div className="__af-container-3 __af-w-container">
            <div className="__af-rich-text-block __af-w-richtext">
              <h3><strong>Why Are We Different?</strong></h3>
              <p>We believe plain-language legal advice that is both clear and accurate is best to assist our client to achieve their goals and objectives.</p>
              <p>Having been working with clients facing different situations and challenges in applying for PR visas, TR visas, business visas, family visas and others, our lawyers &amp; migration agents have helped countless clients migrate successfully or remain in Australia.</p>
              <p>‍</p>
            </div><a href="#contact" className="__af-button __af-w-button">Contact Us</a></div>
        </div>
        <div className="__af-section-7">
          <div className="__af-w-container">
            <div className="__af-text-block">We have offices in Sydney, Melbourne and Brisbane</div>
            <h2 className="__af-heading-6"><a href="tel:1800529636" className="__af-link">Contact Laymens today on Free Call 1800 529 636</a></h2>
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

module.exports = IndexView

/* eslint-enable */