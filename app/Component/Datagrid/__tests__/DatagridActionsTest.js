jest.disableAutomock();
jest.mock('react-router');

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Entry from 'admin-config/lib/Entry';

import DatagridActions from '../DatagridActions';


describe('DatagridActions', () => {

    let myEntry;

    function getActions(entityName, listActions, entry, size=null) {
        return mount(
          <DatagridActions entityName={entityName} listActions={listActions} entry={entry} size={size} />
        );
    }

    beforeEach(() => {
        myEntry = new Entry('posts', { 'id': 1, 'title': 'First Post' }, 1);
    });

    describe('Without actions', () => {
        it('Should not display anything', () => {
            let actions = getActions('MyEntity', [], myEntry);

            expect(actions.children().length).toEqual(0);
        });
    });

    describe('With actions', () => {
        it('Should display list of buttons with default size', () => {
            let actions = getActions('MyEntity', ['edit', 'delete'], myEntry);

            expect(actions.children().length).toEqual(2);
            expect(actions.childAt(0).text()).toContain('Edit');
            expect(actions.childAt(1).text()).toContain('Delete');
            expect(actions.find('.btn').first().props().className)
              .toEqual('btn btn-edit btn-default');
        });

        it('Should display list of buttons with specified', () => {
            let actions = getActions('MyEntity', ['edit', 'delete'], myEntry, 'xs');

            expect(actions.find('.btn').first().props().className)
              .toEqual('btn btn-edit btn-default btn-xs');
        });

        it('Should display clickable button', () => {
            let actions = getActions('MyEntity', ['edit'], myEntry);
            let edit = actions.find('Link');

            edit.simulate('click');
            expect(edit.props().to).toEqual('/MyEntity/edit/1');
        });
    });
});
