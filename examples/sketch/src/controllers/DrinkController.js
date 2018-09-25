import React from 'react'
import DrinkView from '../views/DrinkView'

class DrinkController extends React.Component {
  render() {
    return (
      <DrinkView>
        <close onClick={this.close} />
      </DrinkView>
    )
  }

  close = () => {
    this.props.history.pop()
  }
}

export default DrinkController
