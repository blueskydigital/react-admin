import React from 'react';
import {Link} from 'react-router';

class MaDeleteButton extends React.Component {
    render() {
        const size = this.props.size ? ` btn-${this.props.size}` : '';
        const className = `btn btn-delete btn-default${size}`;
        const to = `/${this.props.entityName}/delete/${this.props.entry.identifierValue}`;

        return (
            <Link className={className} to={to}>
                <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;{this.props.label || 'Delete'}
            </Link>
        );
    }
}

MaDeleteButton.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    entry: React.PropTypes.object.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaDeleteButton;
