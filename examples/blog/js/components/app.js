import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import DevTools from 'mobx-react-devtools'

export default class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <MuiThemeProvider className="view-wrapper">
          {this.props.children}
        </MuiThemeProvider>
        <DevTools />
      </div>
    )
  }
}
