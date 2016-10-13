import React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui'
import CircularProgress from 'material-ui/CircularProgress'
import FlatButton from 'material-ui/FlatButton'
import DevTools from 'mobx-react-devtools'

@observer
class Loading extends React.Component {
  render() {
    return this.props.state.loading ? <CircularProgress color="#fff" /> : <span />
  }
}

export default class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <MuiThemeProvider className="view-wrapper">
          <div>
            <Toolbar>
              <ToolbarGroup firstChild={true}>
                <FlatButton><Link to="/" >SampleAPp</Link></FlatButton>
                <FlatButton><Link to="/posts" >Posts</Link></FlatButton>
              </ToolbarGroup>
              <ToolbarGroup>
                <Loading state={this.props.state}/>
              </ToolbarGroup>
            </Toolbar>
            {this.props.children}
          </div>
        </MuiThemeProvider>
        <DevTools />
      </div>
    )
  }
}
