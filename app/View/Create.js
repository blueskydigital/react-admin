import React from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import Compile from '../Component/Compile';
import Notification from '../Services/Notification';
import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityStore from '../Stores/EntityStore';
import Field from '../Component/Field/Field';

@observer
class CreateView extends React.Component {

    componentDidMount() {
        this.props.state.loadCreateData(this.props.routeParams.entity);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity) {
            this.props.state.loadCreateData(nextProps.params.entity);
        }
    }

    updateField(name, value) {
        this.props.state.updateData(name, value);
    }

    save(e) {
        e.preventDefault();
        this.props.state.saveData(this.props.state.view).then(this.onCreated.bind(this));
    }

    onCreated(dataStore) {
        const entityName = this.props.state.entityName;
        const entry = dataStore.getFirstEntry(this.props.state.view.entity.uniqueId);

        Notification.log('Element successfully created.', {addnCls: 'humane-flatty-success'});

        const to = `/${entityName}/edit/${entry.identifierValue}`;
        browserHistory.push(to);
    }

    buildFields(view, entry, dataStore) {
        let fields = [];
        const values = this.props.state.values;

        for (let field of view.getFields()) {
            const value = values[field.name()];

            fields.push(
                <div className="form-field form-group" key={field.order()}>
                    <Field field={field} value={value} entity={view.entity}
                           values={values} entry={entry}
                           dataStore={dataStore}
                           updateField={this.updateField.bind(this)} />
                </div>
            );
        }

        return fields;
    }

    render() {
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
            <div className="view create-view">
                <ViewActions entityName={entityName} entry={entry}
                    buttons={this.props.state.viewActions}
                />

                <div className="page-header">
                    <h1><Compile entry={entry}>{view.title() || 'Create new ' + entityName}</Compile></h1>
                    <p className="description"><Compile>{view.description()}</Compile></p>
                </div>

                <div className="row form-horizontal" id="create-view">
                    <form className="col-lg-12 form-horizontal" onSubmit={this.save.bind(this)}>

                        {this.buildFields(view, entry, dataStore)}

                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-primary">
                                  <span className="glyphicon glyphicon-ok"></span> Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default CreateView;
