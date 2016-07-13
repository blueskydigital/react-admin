import React from 'react';
import {Link} from 'react-router';

class ReferenceColumn extends React.Component {
    render() {
        const {value, field, entry} = this.props;
        const referenceEntity = field.targetEntity();
        const isDetail = referenceEntity.isReadOnly ? referenceEntity.showView().enabled : referenceEntity.editionView().enabled;

        if (isDetail) {
            const route = referenceEntity.isReadOnly ? 'show' : field.detailLinkRoute();
            const referenceId = entry.values[field.name()];
            const to = `${route}/${referenceEntity.name()}/${referenceId}`;

            return (
                <Link className="reference-column" to={to}>{value}</Link>
            );
        }

        return (
            <span>{value}</span>
        );
    }
}

ReferenceColumn.propTypes = {
    value: React.PropTypes.string,
    entry: React.PropTypes.object,
    field: React.PropTypes.object
};

export default ReferenceColumn;
