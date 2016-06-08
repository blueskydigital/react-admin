import React from 'react';
import {Link} from 'react-router';

class MaShowButton extends React.Component {
    render() {
        const size = this.props.size ? ` btn-${this.props.size}` : '';
        const className = `btn btn-show btn-default${size}`;
        const to = `/${this.props.entityName}/show/${this.props.entry.identifierValue}`;

        return (
            <Link className={className} to={to}>
                <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;{this.props.label || 'Show'}
            </Link>
        );
    }
}

MaShowButton.propTypes = {
    entityName: React.PropTypes.string.isRequired,
    entry: React.PropTypes.object.isRequired,
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaShowButton;
