import React from 'react'
import BurgerView from '../views/BurgerView'

class BurgerController extends React.Component {
  render() {
    return (
      <BurgerView>
        <close onClick={this.close} />
      </BurgerView>
    )
  }

  close = {
    this.props.history.pop()
  }
}

export default BurgerController
