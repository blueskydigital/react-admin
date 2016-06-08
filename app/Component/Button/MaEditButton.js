import React from 'react';
import {Link} from 'react-router';

class MaEditButton extends React.Component {
    render() {
        const size = this.props.size ? ` btn-${this.props.size}` : '';
        const className = `btn btn-edit btn-default${size}`;
        const to = `/${this.props.entityName}/edit/${this.props.entry.identifierValue}`;

        return (
            <Link className={className} to={to}>
                <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;{this.props.label || 'Edit'}
            </Link>
        );
    }
}

MaEditButton.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    entry: React.PropTypes.object.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaEditButton;
