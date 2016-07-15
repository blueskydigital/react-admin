import React from 'react';
import { Route, IndexRoute } from 'react-router';

import DashboardView from './View/Dashboard';
import ListView from './View/List';
import ShowView from './View/Show';
import CreateView from './View/Create';
import EditView from './View/Edit';
import DeleteView from './View/Delete';
import AdminBootstrap from './AdminBootstrap';


export default (onEnter = null) => {
  return (
    <Route path="/" component={AdminBootstrap}>
      <IndexRoute name="dashboard" onEnter={onEnter} component={DashboardView} />
      <Route name="list" path=":entity/list" onEnter={onEnter} component={ListView} />
      <Route name="create" path=":entity/create" onEnter={onEnter} component={CreateView} />
      <Route name="edit" path=":entity/edit/:id" onEnter={onEnter} component={EditView}/>
      <Route name="delete" path=":entity/delete/:id" onEnter={onEnter} component={DeleteView}/>
      <Route name="show" path=":entity/show/:id" onEnter={onEnter} component={ShowView}/>
    </Route>
  );
}
