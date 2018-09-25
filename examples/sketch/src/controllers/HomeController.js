import React from 'react'
import HomeView from '../views/HomeView'

class HomeController extends React.Component {
  state = {
    showingMenu: false
  }

  render() {
    return (
      <HomeView>
        {this.state.showingMenu && (
          <menu
            onClick={this.showMenu}
            hideMenu={this.hideMenu}
            location={this.props.location}
            history={this.props.history}
          />
        )}
        <burger onClick={this.navBurger} />
        <drink onClick={this.navDrink} />
      </HomeView>
    )
  }

  showMenu = () => {
    this.setState({
      showingMenu: true
    })
  }

  hideMenu = () => {
    this.setState({
      showingMenu: false
    })
  }

  navBurger = () => {
    this.props.history.push('/burger')
  }

  navDrink = () => {
    this.props.history.push('/drink')
  }
}

export default HomeController
