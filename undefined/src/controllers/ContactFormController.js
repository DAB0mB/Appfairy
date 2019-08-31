import React from 'react'
import ContactFormView from '../views/ContactFormView'

class ContactFormController extends React.Component {
  state = {}

  render() {
    return (
      <ContactFormView>
        <name onChange={this.setName} />
        <submit onClick={this.submit} />
      </ContactFormView>
    )
  }

  setName = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  submit = () => {
    this.props.history.push('/thank-you', {
      name: this.state.name
    })
  }
}

export default ContactFormController
