import React from 'react';
import { browserHistory } from 'react-router';

import FieldViewConfiguration from '../../Field/FieldViewConfiguration';

class Column extends React.Component {
    getDetailAction (entry) {
        return function() {
            const entityName = this.props.entity.name();
            const route = this.props.entity.editionView().enabled ? 'edit' : 'show';

            const to = `/${entityName}/${route}/${entry.identifierValue}`;
            browserHistory.push(to);
        }.bind(this);
    }

    isDetailLink(field) {
        if (false === field.isDetailLink()) {
            return false;
        }

        if (-1 === field.type().indexOf('reference')) {
            return true;
        }

        const referenceEntity = field.targetEntity().name();
        const relatedEntity = this.context.configuration.getEntity(referenceEntity);

        if (!relatedEntity) { return false; }

        return relatedEntity.isReadOnly ? relatedEntity.showView().enabled : relatedEntity.editionView().enabled;
    }

    render() {
        const {field, entry, entity} = this.props;
        const isDetailLink = this.isDetailLink(field);
        const detailAction = isDetailLink ? this.getDetailAction(this.props.entry) : null;
        const fieldView = FieldViewConfiguration.getFieldView(field.type());
        const props = Object.assign({
          value: this.props.entry.values[field.name()] || null,
          detailAction,
        }, this.props);

        let renderFunc = null;

        if (fieldView) {
            renderFunc = isDetailLink ? fieldView.getLinkWidget : fieldView.getReadWidget;
            return renderFunc.bind({props: props})();
        }
    }
}

Column.propTypes = {
    field: React.PropTypes.object.isRequired,
    entry: React.PropTypes.object.isRequired,
    entity: React.PropTypes.object.isRequired,
    configuration: React.PropTypes.object.isRequired,
    dataStore: React.PropTypes.object
};

Column.contextTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default Column;
