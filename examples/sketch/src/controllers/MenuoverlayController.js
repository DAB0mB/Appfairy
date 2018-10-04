import React from 'react'
import MenuOverlayView from '../views/MenuoverlayView'

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

class MenuOverlayController extends React.Component {
  render() {
    return (
      <div style={overlayStyle}>
        <MenuOverlayView>
          <close onClick={this.props.hideMenu}>
            {this.props.location.pathname !== '/' && (
              <home onClick={this.navHome} />
            )}
            {this.props.location.pathname !== '/project' && (
              <project onClick={this.navProject} />
            )}
          </close>
        </MenuOverlayView>
      </div>
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
