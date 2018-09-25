import React from 'react'
import MenuOverlayView from '../views/MenuoverlayView'

class MenuOverlayController extends React.Component {
  render() {
    return (
      <MenuOverlayView>
        <close hideMenu={this.props.hideMenu} />
        {this.props.location.pathname !== '/' && (
          <home onClick={this.navHome} />
        )}
        {this.props.location.pathname !== '/project' && (
          <project onClick={this.navProject} />
        )}
      </MenuOverlayView>
    )
  }

  navHome = () => {
    this.props.history.push('/')
  }

  navProject = () => {
    this.props.history.push('/project')
  }
}

export default MenuOverlayController
