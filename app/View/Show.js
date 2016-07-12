import React from 'react';
import { observer } from 'mobx-react';

import { hasEntityAndView, getView, onLoadFailure } from '../Mixins/MainView';

import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import EntityStore from '../Stores/EntityStore';
import Column from '../Component/Column/Column';

@observer
class ShowView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.hasEntityAndView = hasEntityAndView.bind(this);
        this.getView = getView.bind(this);
        this.onLoadFailure = onLoadFailure.bind(this);

        this.viewName = 'ShowView';
        this.actions = [];
        this.isValidEntityAndView = this.hasEntityAndView(this.props.routeParams.entity);
    }

    // componentDidMount() {
    //     if (this.isValidEntityAndView) {
    //
    //         this.refreshData();
    //     }
    // }

    init(entityName, id) {
        this.view = this.getView(entityName);
        this.actions = view.actions() || ['list', 'edit', 'delete'];

        this.props.state.loadShowData(this.view, id);
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

    // onChange() {
    //     this.setState(EntityStore.getState());
    // }

    render() {
        if (!this.isValidEntityAndView || this.props.state.resourceNotFound) {
            return <NotFoundView/>;
        }

        const dataStore = this.props.state.dataStore;

        if(!dataStore) {
            return null;
        }

        const entityName = this.props.state.entityName;
        const view = this.getView(entityName);

        const entry = dataStore.getFirstEntry(view.getEntity().uniqueId);
        const actions = this.actions;

        if (!entry) {
            return null;
        }

        return (
            <div className="view show-view">
                <ViewActions entityName={entityName} entry={entry} buttons={actions} />

                <div className="page-header">
                    <h1>{view.title() || entityName + ' detail'}</h1>
                    <p className="description">{view.description()}</p>
                </div>

                <div className="row form-horizontal" id="show-view">
                    { view.getFields().map((field, i) => (
                        <div className="col-lg-12 form-group" key={i}>
                            <label className="col-sm-2 control-label">{ field.label() }</label>

                            <div className={'show-value react-admin-field-' + field.name() + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7')}>
                                <Column field={field} entity={view.getEntity()} entry={entry} dataStore={dataStore} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ShowView;
