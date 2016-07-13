import React from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityStore from '../Stores/EntityStore';
import Notification from '../Services/Notification';

@observer
class DeleteView extends React.Component {

    componentDidMount() {
        this.props.state.loadDeleteData(this.props.routeParams.entity, this.props.routeParams.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id) {
            this.props.state.loadDeleteData(nextProps.params.entity, nextProps.params.id);
        }
    }

    delete(e) {
        e.preventDefault();
        const state = this.props.state;
        this.props.state.deleteData().then(this.onDeleted.bind(this));
    }

    onDeleted() {
        const entityName = this.props.state.entityName;

        Notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });

        browserHistory.push(`/${entityName}/list`);
    }

    cancelDelete() {
      window.history.back();
    }

    render() {
        if (this.props.state.resourceNotFound) {
            return <NotFoundView/>;
        }

        const dataStore = this.props.state.dataStore;

        if(! dataStore) {
            return null;
        }

        const entityName = this.props.state.entityName;
        const view = this.props.state.view;
        const entry = dataStore.getFirstEntry(view.entity.uniqueId);

        if (!entry) {
            return null;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <ViewActions entityName={entityName} buttons={this.props.state.viewActions} />

                        <div className="page-header">
                            <h1>{view.title() || 'Delete one ' + entityName}</h1>
                            <p className="description">{view.description()}</p>
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

export default DeleteView;
