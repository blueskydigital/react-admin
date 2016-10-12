import React from 'react'
import { render } from 'react-dom'
import DevTools from 'mobx-react-devtools'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
// import TableState from '../../../src/states/data_table'
import ManipState from '../../../src/states/data_manip'
import DataRequester from '../../../src/services/requester'
import { convertQuery, getTotalItems } from './api_flavor'

const _requester = new DataRequester(convertQuery, getTotalItems)

let state = new ManipState()
state.requester = _requester

function i18n(str) {
  return state.i18n[str]
}

import PostsConfig from './posts'

let postConfig = PostsConfig(state)

import injectTapEventPlugin from 'react-tap-event-plugin'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class AppComponent extends React.Component {
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

var createElement = function (Component, props) {
  return <Component {...props} state={state} />
}

let app = (
  <Router history={browserHistory} createElement={createElement}>
    <Route path="/" component={AppComponent}>
      <IndexRedirect to="/posts/1" />
      <Route path="/posts" component={postConfig.createListView} />
      <Route path="/posts/:id" component={postConfig.createManip} />
    </Route>
  </Router>
)

const mount = document.getElementById("app")

render(app, mount)
