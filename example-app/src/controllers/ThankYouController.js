import React from 'react'
import ThankYouView from '../views/ThankYouView'

export default (props) => (
  <ThankYouView>
    <message>Thank You! {props.location.state.name}</message>
  </ThankYouView>
)
