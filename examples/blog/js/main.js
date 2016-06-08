import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
// import ReactAdmin from '../build/react-admin-standalone.min.js';
import ReactAdmin from '../../../app/ReactAdmin';

import * as ApiFlavor from './api_flavor';
import ETags from './entities/tag';
import EComments from './entities/comment';
import EPosts from './entities/post';
import MyMenu from './menu';

function configureApp(nga, fieldViewConfiguration, components, routes, restful, autoload) {

    ApiFlavor.init(restful);

    // Add custom component
    var SendEmail = React.createClass({
        render: function () {
            return <a className='btn btn-default' href='#/stats'>Show stats</a>;
        }
    });
    autoload('SendEmail', SendEmail);

    var admin = nga.application('rest-admin backend demo') // application main title
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    // create da entities
    admin
        .addEntity(nga.entity('tags'))
        .addEntity(nga.entity('comments'))
        .addEntity(nga.entity('posts'));
    // init them
    var tag = ETags(nga, admin);
    var comment = EComments(nga, admin);
    var post = EPosts(nga, admin);

    // customize menu
    admin.menu(MyMenu(nga, admin));

    // Add custom route
    var ViewActions = components.ViewActions;
    var Stats = React.createClass({
        render: function () {
            return <div>
                <ViewActions buttons={['back']} />
                <h1>Stats</h1>
                <p className='lead'>You can add custom pages, too</p>
            </div>;
        }
    });

    routes.props.children.push(
      <Route name="stats" path="/stats" component={Stats} />
    );

    return admin;
}

render(
  <ReactAdmin configureApp={configureApp} />,
  document.getElementById('my-app')
);
