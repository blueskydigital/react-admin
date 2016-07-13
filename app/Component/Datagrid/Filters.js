import React from 'react';

import FieldViewConfiguration from '../../Field/FieldViewConfiguration';

class Filters extends React.Component {

    buildRows(filters) {
        const { entity, dataStore, updateField, hideFilter } = this.props;
        const { search } = this.props.location.query || {};

        return filters.map((filter, i) => {
            const filterName = filter.name();
            const value = search && filterName in search ? search[filterName] : null;
            const autoFocus = !filter.pinned();
            const fieldName = filter.name();
            const fieldView = FieldViewConfiguration.getFieldView(filter.type());
            if(! fieldView) {
              return null;
            }
            const className = `filter-value react-admin-field-${filter.name()} col-sm-8 col-md-8`;
            const values = null;
            let deleteLink = null;

            if (!filter.pinned()) {
                deleteLink = (
                    <a className="remove" onClick={hideFilter(filter)}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </a>
                );
            }

            const props = Object.assign({
              value,
              fieldName,
              className
            }, this.props);

            const widget = fieldView ? fieldView.getWriteWidget.bind({props: props})() : null;

            return (
                <div className={`form-field form-group filter-${fieldName}`} key={i}>
                    <span className="col-sm-1 col-xs-1">{deleteLink}</span>

                    <div>
                        <label htmlFor={fieldName} className={"control-label col-sm-3 col-md-3"}>{ filter.label() }</label>

                        <div className={className}>
                            {widget}
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        const filters = this.props.filters;

        return (
            <div className="filters form-horizontal col-md-offset-6 col-md-6 col-lg-6">
                {this.buildRows(filters)}
            </div>
        );
    }
}

Filters.propTypes = {
    filters: React.PropTypes.array.isRequired,
    updateField: React.PropTypes.func.isRequired,
    hideFilter: React.PropTypes.func.isRequired,
    entity: React.PropTypes.object,
    dataStore: React.PropTypes.object
};

export default Filters;
