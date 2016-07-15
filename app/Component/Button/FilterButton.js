import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

class FilterButton extends React.Component {

    showFilter(filter) {
        return () => {
            this.props.showFilter(filter);
        };
    }

    render() {
        const buttons = this.props.filters.map((filter, i) => {
            return <MenuItem key={i} onSelect={this.showFilter(filter)}>{filter.label()}</MenuItem>;
        });
        const title = <span><span className="glyphicon glyphicon-filter" aria-hidden="true"></span>&nbsp;Add filters</span>;

        return (
            <DropdownButton id={this.props.entityName + "_filter_drop"} title={title}>
                {buttons}
            </DropdownButton>
        );
    }
}

FilterButton.propTypes = {
    filters: React.PropTypes.array,
    showFilter: React.PropTypes.func
};

export default FilterButton;
