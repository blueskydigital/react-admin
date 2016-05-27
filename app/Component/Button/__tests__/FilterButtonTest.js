jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { List } from 'immutable'
import Field from 'admin-config/lib/Field/Field';
import FieldViewConfiguration from '../../../Field/FieldViewConfiguration';
import StringFieldView from '../../../Field/StringFieldView';
import FilterButton from '../FilterButton';

describe('FieldButton', () => {

    FieldViewConfiguration.registerFieldView('string', StringFieldView);

    let filter = new Field('note');
    filter.pinned(true);

    let showned = [];
    const showFilter = f => {
        showned.push(f.name());
    };

    describe('With good props', () => {
        it('Should display label and default size', () => {
            const wrapper = mount(
              <FilterButton filters={List([filter])} showFilter={showFilter} />
            );
            const title = wrapper.find('DropdownButton span').first();
            expect(title.html()).toContain('Add filters');

            const filterButtonButton = wrapper.find('DropdownButton button');
            expect(filterButtonButton.type()).toEqual('button');
            expect(filterButtonButton.props().className).toEqual('dropdown-toggle btn btn-default');
        });

        it('Should call showFilter callback', () => {
            const wrapper = mount(
              <FilterButton filters={List([filter])} showFilter={showFilter} />
            );
            wrapper.find('.dropdown-menu a').simulate('click');

            expect(showned).toEqual(['note']);
        });
    });
});
