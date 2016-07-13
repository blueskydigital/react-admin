import React from 'react';
import { observer } from 'mobx-react';

import Compile from '../Component/Compile';
import Notification from '../Services/Notification';
import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityStore from '../Stores/EntityStore';
import Field from '../Component/Field/Field';


class EditView extends React.Component {

    componentDidMount() {
        this.props.state.loadEditData(this.props.routeParams.entity, this.props.routeParams.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id) {
            this.props.state.loadEditData(nextProps.params.entity, nextProps.params.id);
        }
    }

    updateField(name, value) {
        const choiceFields = this.props.state.view.getFieldsOfType('choice');

        this.props.state.updateData(name, value, choiceFields);
    }

    save(e) {
        e.preventDefault();
        this.props.state.saveData().then(this.onUpdated.bind(this));
    }

    onUpdated() {
        Notification.log('Changes successfully saved.', { addnCls: 'humane-flatty-success' });
    }

    buildFields(view, entry, dataStore) {
        let fields = [];
        const values = this.props.state.values;

        for (let field of view.getFields()) {
            const value = values[field.name()];

            fields.push(
                <div className="form-field form-group" key={field.order()}>
                    <Field field={field} value={value} values={values}
                           entity={view.entity} entry={entry}
                           dataStore={dataStore}
                           updateField={this.updateField.bind(this)} />
                </div>
            );
        }

        return fields;
    }

    render() {
        if (this.props.state.loading || !this.props.state.view || this.props.state.view.type != 'EditView') {
          return null;
        }

        if (this.props.state.resourceNotFound) {
            return <NotFoundView/>;
        }

        const dataStore = this.props.state.dataStore;

        if(!dataStore) {
            return null;
        }

        const entityName = this.props.state.entityName;
        const view = this.props.state.view;
        const entry = dataStore.getFirstEntry(view.entity.uniqueId);

        if (!entry) {
            return null;
        }

        return (
            <div className="view edit-view">
                <ViewActions entityName={entityName} entry={entry} buttons={this.props.state.viewActions} />

                <div className="page-header">
                    <h1><Compile entry={entry}>{view.title() || 'Edit one ' + entityName}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="edit-view">
                    <form className="col-lg-12 form-horizontal" onSubmit={this.save.bind(this)}>

                        {this.buildFields(view, entry, dataStore)}

                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-primary"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default EditView;
