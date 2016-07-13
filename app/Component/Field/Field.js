import React from 'react';

import FieldViewConfiguration from '../../Field/FieldViewConfiguration';

class Field extends React.Component {
    render() {
        const {field, value, values, entry, entity, labelClass, fieldClass} = this.props;
        const fieldName = field.name();

        const fieldView = FieldViewConfiguration.getFieldView(field.type());
        const className = `edit-value react-admin-field-${field.name()} ` +
            (field.getCssClasses(this.props.entry) || (fieldClass || 'col-sm-10 col-md-8 col-lg-7'));

        const props = Object.assign({
          value: this.props.entry.values[field.name()] || null,
          fieldName,
          className
        }, this.props);

        const widget = fieldView ? fieldView.getWriteWidget.bind({props: props})() : null;

        return (
            <div>
                <label htmlFor={fieldName} className={`control-label ${labelClass || 'col-sm-2'}`}>
                  { field.label() }
                </label>

                <div className={className}>
                    { widget }
                </div>
            </div>
        );
    }
}

Field.propTypes = {
    entity: React.PropTypes.object.isRequired,
    entry: React.PropTypes.object.isRequired,
    field: React.PropTypes.object.isRequired,
    dataStore: React.PropTypes.object.isRequired,
    configuration: React.PropTypes.object,
    value: React.PropTypes.any,
    values: React.PropTypes.any,
    updateField: React.PropTypes.func.isRequired,
    labelClass: React.PropTypes.string,
    fieldClass: React.PropTypes.string,
    autoFocus: React.PropTypes.bool
};

export default Field;
