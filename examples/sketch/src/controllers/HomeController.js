import React from 'react'
import HomeView from '../views/HomeView'
import MenuOverlayController from './MenuoverlayController'

class HomeController extends React.Component {
  state = {
    showingMenu: false
  }

  render() {
    return (
      <React.Fragment>
        <HomeView>
          <menu onClick={this.showMenu} />
          <cow onClick={this.navCow} />
          <burger onClick={this.navBurger} />
          <drink onClick={this.navDrink} />
        </HomeView>
        {this.state.showingMenu && (
          <MenuOverlayController
            hideMenu={this.hideMenu}
            location={this.props.location}
            history={this.props.history}
          />
        )}
      </React.Fragment>
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

  navCow = () => {
    this.props.history.push('/cow')
  }

  navBurger = () => {
    this.props.history.push('/burger')
  }

  navDrink = () => {
    this.props.history.push('/drink')
  }
}

export default HomeController
