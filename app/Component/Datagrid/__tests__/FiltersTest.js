jest.disableAutomock();

import React from 'react';

import Field from 'admin-config/lib/Field/Field';
import FieldViewConfiguration from '../../../Field/FieldViewConfiguration';
import routerWrapper from '../../../Test/RouterWrapper';

import StringFieldView from '../../../Field/StringFieldView';

import Filters from '../Filters';

describe('Filters', () => {

    FieldViewConfiguration.registerFieldView('string', StringFieldView);

    let pinnedFilter = new Field('author');
    pinnedFilter.pinned(true);

    let notPinned = new Field('name');

    let hidden = [];
    const hideFilter = (filter) => {
        return () => {
            hidden.push(filter.name());
        };
    };

    let updated = {};
    const updateField = (name, value) => {
        updated[name] = value;
    };
    const loc = {

    };

    function getFilters(filters) {
        return routerWrapper(() =>
          <Filters filters={filters} hideFilter={hideFilter} updateField={updateField}
            location={loc} />
        );
    }

    describe('Display', () => {
        it('should display pinned and selected filters', () => {
            const selectedFilters = [pinnedFilter, notPinned];
            let filters = getFilters(selectedFilters);

            const pinnedField = filters.find('.filter-author input');
            const pinnedLabel = filters.find('.filter-author label');
            const pinnedRemove = filters.find('.filter-author a.remove');
            expect(pinnedField.props().name).toEqual('author');
            expect(pinnedField.props().type).toEqual('text');
            expect(pinnedLabel.text()).toEqual('Author');
            expect(pinnedRemove.length).toEqual(0); // no remove when no value

            const notPinnedField = filters.find('.filter-name input');
            const notPinnedLabel = filters.find('.filter-name label');
            const notPinnedRemove = filters.find('.filter-name a.remove');
            expect(notPinnedField.props().name).toEqual('name');
            expect(notPinnedLabel.text()).toEqual('Name');
            expect(notPinnedRemove.html()).toContain('glyphicon-remove');
        });
    });

    describe('Callback', () => {
        it('should call hideFilter callback on filter remove', () => {
            const selectedFilters = [pinnedFilter, notPinned];
            let filters = getFilters(selectedFilters);
            const notPinnedRemove = filters.find('.filter-name a.remove');
            notPinnedRemove.simulate('click');

            expect(hidden).toEqual(['name']);
        });

        it('should call updateField callback on filter value changed', () => {
            const selectedFilters = [pinnedFilter, notPinned];
            let filters = getFilters(selectedFilters);
            const notPinnedField = filters.find('.filter-name input');
            notPinnedField.simulate('change', { target: { value: 'Me'} });

            expect(updated).toEqual({ name: 'Me' });
        });
    });
});
