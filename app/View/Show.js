import React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import NotFoundView from './NotFound';

import ViewActions from '../Component/ViewActions';
import Column from '../Component/Column/Column';

@observer
class ObservedShowView extends React.Component {

  render() {
    const view = this.props.state.view;
    if (!view) {
      return null;
    }

    const dataStore = this.props.state.dataStore;
    const entityName = this.props.state.entityName;
    const entry = dataStore.getFirstEntry(view.getEntity().uniqueId);

    if (!entry) {
      return null;
    }

    return (
        <div className="view show-view">
            <DevTools />
            <ViewActions state={this.props.state} />

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

class ShowView extends React.Component {

    componentDidMount() {
        this.props.state.loadShowData(this.props.routeParams.entity, this.props.routeParams.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.entity !== this.props.params.entity ||
            nextProps.params.id !== this.props.params.id) {
            this.props.state.loadShowData(nextProps.params.entity, nextProps.params.id);
        }
    }

    render() {
        return <ObservedShowView state={this.props.state} />
    }
}

export default ShowView;
