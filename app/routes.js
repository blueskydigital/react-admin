import React from 'react';
import { Route, IndexRoute } from 'react-router';

import DashboardView from './View/Dashboard';
import ListView from './View/List';
import ShowView from './View/Show';
import CreateView from './View/Create';
import EditView from './View/Edit';
import DeleteView from './View/Delete';
import AdminBootstrap from './AdminBootstrap';

export default (
  <Route path="/" component={AdminBootstrap}>
    <IndexRoute name="dashboard" component={DashboardView} />
    <Route name="list" path=":entity/list" component={ListView} />
    <Route name="create" path=":entity/create" component={CreateView} />
    <Route name="edit" path=":entity/edit/:id" component={EditView}/>
    <Route name="delete" path=":entity/delete/:id" component={DeleteView}/>
    <Route name="show" path=":entity/show/:id" component={ShowView}/>
  </Route>
);
