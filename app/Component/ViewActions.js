import React from 'react';

import { FilterButton, MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton } from './Button';

class ViewActions extends React.Component {

    render() {
        const { size, entry, showFilter } = this.props;
        const view = this.props.state.view;
        const entityName = view.entity.name();
        const buttons = this.props.state.viewActions || [];
        const filters = this.props.state.unselectedFilters;
        let results;
        let i = 0;

        results = buttons.map(button => {
            switch (button) {
                case 'filters':
                    if(! filters.length) {
                      return null;
                    }
                    return <FilterButton key={i++} entityName={entityName} filters={filters} showFilter={showFilter} />;
                case 'create':
                    return <MaCreateButton key={i++} entityName={entityName} size={size} />;
                case 'show':
                    if (!entry) {
                        return <div key={i++} />;
                    }

                    return <MaShowButton key={i++} entityName={entityName} entry={entry} size={size} />;
                case 'back':
                    return <MaBackButton key={i++} size={size} />;
                case 'list':
                    return <MaListButton key={i++} entityName={entityName} size={size} />;
                case 'edit':
                    if (!entry) {
                        return <div key={i++} />;
                    }
                    return <MaEditButton key={i++} entityName={entityName} entry={entry} size={size} />;
                case 'delete':
                    if (!entry) {
                        return <div key={i++} />;
                    }

                    return <MaDeleteButton key={i++} entityName={entityName} entry={entry} size={size} />;
                default:
                    return button;
            }
        });

        return (
            <span className="ma-view-actions">{results}</span>
        );
    }
}

ViewActions.propTypes = {
    size: React.PropTypes.string,
    showFilter: React.PropTypes.func
};

ViewActions.defaultProps = { view: null };

export default ViewActions;
