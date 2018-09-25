import React from 'react'
import ProjectView from '../views/ProjectpageView'

class ProjectController extends React.Component {
  state = {
    showingMenu: false
  }

  render() {
    return (
      <ProjectView>
        {this.state.showingMenu && (
          <menu
            onClick={this.showMenu}
            hideMenu={this.hideMenu}
            location={this.props.location}
            history={this.props.history}
          />
        )}
      </ProjectView>
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
}

export default ProjectController
