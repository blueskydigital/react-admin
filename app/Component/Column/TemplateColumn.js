import React from 'react';

class TemplateColumn extends React.Component {
    render() {
        const template = this.props.template;

        let computedTemplate = template;
        if ('function' === typeof template) {
            computedTemplate = template.apply(this, [this.props.entry]);
        }

        return (
            <span>{computedTemplate}</span>
        );
    }
}

TemplateColumn.propTypes = {
    template: React.PropTypes.func.isRequired,
    entry: React.PropTypes.object
};

export default TemplateColumn;
