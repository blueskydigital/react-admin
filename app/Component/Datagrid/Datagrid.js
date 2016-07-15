import React from 'react';
import { observer } from 'mobx-react';

import Header from '../../Component/Datagrid/ColumnHeader';
import DatagridActions from '../../Component/Datagrid/DatagridActions';

import Column from '../Column/Column';

@observer
class Datagrid extends React.Component {

    getDetailAction(entry) {
        return () => {
            const entityName = this.props.state.entity.name();
            const entity = this.context.configuration.getEntity(entityName);
            const route = entity.editionView().enabled ? 'edit' : 'show';
            const to = `/${entityName}/${route}/${entry.identifierValue}`;
            this.props.history.push(to);
        };
    }

    isDetailLink(field) {
        if (false === field.isDetailLink()) {
            return false;
        }

        if (-1 === field.type().indexOf('reference')) {
            return true;
        }

        const referenceEntity = field.targetEntity().name();
        const relatedEntity = this.context.configuration.getEntity(referenceEntity);

        if (!relatedEntity) { return false; }

        return relatedEntity.isReadOnly ? relatedEntity.showView().enabled : relatedEntity.editionView().enabled;
    }

    buildHeaders() {
        let headers = [];
        const {name, listActions, sortDir, sortField} = this.props;

        for (let i in this.props.fields) {
            const fieldName = this.props.fields[i].name();
            let sort = null;

            if (`${name}.${fieldName}` === sortField) {
                sort = sortDir;
            }

            headers.push(
                <Header
                    key={i}
                    sort={sort}
                    name={this.props.name}
                    fieldName={fieldName}
                    label={this.props.fields[i].label()}
                    onSort={this.props.onSort} />
            );
        }

        // List actions
        if (listActions && listActions.length) {
            headers.push(<th key={'actions'}>Actions</th>);
        }

        return headers;
    }

    buildRecords(entries) {
        const entityName = this.props.state.view.entity.name();
        const entity = this.context.configuration.getEntity(entityName);

        return entries.map((r, i) => (
            <tr key={i}>{this.buildCells(r, entity)}</tr>
        ));
    }

    buildCells(row, entity) {
        let cells = [];
        const actions = this.props.listActions;
        const entityName = this.props.entity.name();

        for (let i in this.props.fields) {
            const field = this.props.fields[i];
            const renderedField = <Column field={field} entity={entity} entry={row} configuration={this.context.configuration} />;

            cells.push(<td key={i}>{renderedField}</td>);
        }

        if (actions && actions.length) {
            cells.push(<td key={'datagrid-actions'}>
                <DatagridActions entityName={entityName} listActions={actions} entry={row} size={'xs'} />
            </td>);
        }

        return cells;
    }

    render() {
        const entries = this.props.state.dataStore.getEntries(this.props.entity.uniqueId);
        if(entries.length === 0) {
            return null;
        }

        return (
            <table className="datagrid">
                <thead>
                    <tr>
                        {this.buildHeaders()}
                    </tr>
                </thead>
                <tbody>
                    {this.buildRecords(entries)}
                </tbody>
            </table>
        );
    }
}

Datagrid.propTypes = {
    name: React.PropTypes.string.isRequired,
    entity: React.PropTypes.object.isRequired,
    listActions: React.PropTypes.array.isRequired,
    fields: React.PropTypes.array.isRequired,
    state: React.PropTypes.object.isRequired,
    onSort: React.PropTypes.func
};

Datagrid.contextTypes = {
    configuration: React.PropTypes.object
};

export default Datagrid;
