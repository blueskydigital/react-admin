import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import AppComponent from './components/app'
import PostEditView from './posts/manip'
import PostListView from './posts/list'

export default (
  <Route path="/" component={AppComponent}>
    <IndexRedirect to="/posts" />
    <Route path="/posts" component={PostListView} />
    <Route path="/posts/:id" component={PostEditView} />
  </Route>
)
