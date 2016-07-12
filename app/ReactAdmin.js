import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import Restful from 'restful.js';

import ConfigurationFactory from 'admin-config/lib/Factory';

import ViewActions from './Component/ViewActions';
import FieldViewConfiguration from './Field/FieldViewConfiguration';

import autoload from './autoloader'
import routes from './routes'
import NotFoundView from './View/NotFound';

import RestWrapper from './Services/RestWrapper';
import EntryRequester from './Services/EntryRequester';
import EntityStore from './Stores/EntityStore';

import Pace from 'pace';

class ReactAdmin extends React.Component {
    constructor(props) {
        super(props);

        const restful = Restful();
        const components = {
            ViewActions: ViewActions
        };
        const configuration = props.configureApp(
            new ConfigurationFactory(),
            FieldViewConfiguration,
            components,
            routes,
            restful,
            autoload
        );

        // add default route
        routes.props.children.push(<Route path="*" component={NotFoundView} />);

        this.store = new EntityStore(
          new EntryRequester(configuration, new RestWrapper(restful))
        );
        this.configuration = configuration;
    }

    // componentDidUpdate() {
    //     // stop progress bar
    //     Pace.stop();
    // }

    render() {
        // // start progress bar
        // Pace.start();

        // custom creation fn to pass down config to every component
        // Component wrapper:
        // http://stackoverflow.com/questions/27864720/react-router-pass-props-to-handler-component/27868548#27868548
        //
        // Custom createElement:
        // https://github.com/reactjs/react-router/issues/1857
        const config = this.configuration;
        const store = this.store;
        var createElement = function (Component, props) {
          return <Component {...props} configuration={config} state={store} />
        };

        return (
          <Router history={browserHistory} createElement={createElement}>
            {routes}
          </Router>
        );
    }
}

ReactAdmin.propTypes = {
    configureApp: React.PropTypes.func.isRequired
};

export default ReactAdmin;
