import React from 'react';
import Datagrid from '../Datagrid/Datagrid';

class ReferencedList extends React.Component {
    render() {
        const {entries, field, entityName, sortDir, sortField} = this.props;

        return (
            <Datagrid
                name={field.datagridName()}
                actions={null}
                listActions={[]}
                fields={field.targetFields()}
                state={this.context.state}
                entity={field.targetEntity()}
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
    configuration: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired
};

export default ReferencedList;
