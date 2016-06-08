import React from 'react';
import {Link} from 'react-router';

class MaCreateButton extends React.Component {
    render() {
        const size = this.props.size ? ` btn-${this.props.size}` : '';
        const className = `btn btn-create btn-default${size}`;
        const to = `/${this.props.entityName}/create`;

        return (
            <Link className={className} to={to}>
                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;{this.props.label || 'Create'}
            </Link>
        );
    }
}

MaCreateButton.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaCreateButton;
