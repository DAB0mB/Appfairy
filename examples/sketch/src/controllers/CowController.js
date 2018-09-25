import React from 'react'
import CowView from '../views/CowView'

class CowController extends React.Component {
  render() {
    return (
      <CowView>
        <close onClick={this.props.close} />
      </CowView>
    )
  }

  close = () => {
    this.props.history.pop()
  }
}

export default CowController
