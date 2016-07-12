import React from 'react';
import { observer } from 'mobx-react';

import { hasEntityAndView, getView, onLoadFailure, onSendFailure } from '../Mixins/MainView';

import Compile from '../Component/Compile';
import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';

import EntityStore from '../Stores/EntityStore';
import Notification from '../Services/Notification';

@observer
class DeleteView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.hasEntityAndView = hasEntityAndView.bind(this);
        this.getView = getView.bind(this);
        this.onLoadFailure = onLoadFailure.bind(this);
        this.onSendFailure = onSendFailure.bind(this);

        this.viewName = 'DeleteView';
        this.actions = [];
        this.isValidEntityAndView = this.hasEntityAndView(this.props.routeParams.entity);
    }

    componentDidMount() {
        if (this.isValidEntityAndView) {
            this.init(this.props.routeParams.entity, this.props.routeParams.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id) {

            this.isValidEntityAndView = this.hasEntityAndView(nextProps.params.entity);
            if (this.isValidEntityAndView) {
                this.init(nextProps.params.entity, nextProps.params.id);
            }
        }
    }

    init(entityName, id) {
        this.id = id;
        this.view = this.getView();
        this.actions = this.view.actions() || ['back'];
        this.refreshData();
    }

    refreshData() {
        this.props.state.loadDeleteData(this.view, this.id);
    }

    delete(e) {
        e.preventDefault();
        this.props.state.deleteData(this.view, this.id).then(this.onDeleted.bind(this));
    }

    onDeleted() {
        const params = this.props.routeParams;
        const entityName = params.entity;

        Notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });

        this.props.history.push(`/${entityName}/list`);
    }

    cancelDelete() {
      window.history.back();
    }

    render() {
        if (!this.isValidEntityAndView || this.props.state.resourceNotFound) {
            return <NotFoundView/>;
        }

        const dataStore = this.props.state.dataStore;

        if(!dataStore || !this.view) {
            return null;
        }

        const entityName = this.props.routeParams.entity;
        const entry = dataStore.getFirstEntry(this.view.entity.uniqueId);

        if (!entry) {
            return null;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <ViewActions entityName={this.view.entity.name()} buttons={this.actions} />

                        <div className="page-header">
                            <h1><Compile entry={entry}>{this.view.title() || 'Delete one ' + entityName}</Compile></h1>
                            <p className="description"><Compile entry={entry}>{this.view.description()}</Compile></p>
                        </div>
                    </div>
                </div>

                <div className="row" id="delete-view">
                    <div className="col-lg-12">
                        <p>Are you sure ?</p>
                        <button className="btn btn-danger" onClick={this.delete.bind(this)}>Yes</button>
                        <button onClick={this.cancelDelete.bind(this)} className="btn btn-default">No</button>
                    </div>
                </div>
            </div>
        );
    }
}

DeleteView.contextTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default DeleteView;
