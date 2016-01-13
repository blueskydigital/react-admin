import React from 'react';

class NumberColumn extends React.Component {
    render() {
        const {value, detailAction} = this.props;

        if (detailAction) {
            return <a onClick={detailAction}>{value}</a>;
        }

        return (
            <span>{value}</span>
        );
    }
}

NumberColumn.propTypes = {
    value: React.PropTypes.number,
    detailAction: React.PropTypes.func
};

import register from '../../autoloader';
register('NumberColumn', NumberColumn);

export default NumberColumn;
