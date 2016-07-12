import React from 'react';
import Datagrid from '../Datagrid/Datagrid';

class ReferencedList extends React.Component {
    render() {
        const {entries, field, entityName, sortDir, sortField} = this.props;

        return (
            <Datagrid
                entityName={entityName}
                name={field.datagridName()}
                actions={null}
                listActions={[]}
                fields={field.targetFields()}
                entries={entries}
                sortDir={sortDir}
                sortField={sortField}
                />
        );
    }
}

ReferencedList.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    entries: React.PropTypes.array.isRequired,
    field: React.PropTypes.object.isRequired
};

ReferencedList.contextTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default ReferencedList;
