jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import MaDeleteButton from '../MaDeleteButton';

describe('MaDeleteButton', () => {

    let entry;

    beforeEach(() => {
        entry = {
            identifierValue: 23
        };
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            const wrapper = mount(
              <MaDeleteButton entityName={'MyEntity'} entry={entry} label={'Delete'} size={'xs'} />
            );
            const deleteButton = wrapper.find('.btn').node;

            expect(deleteButton.className).toContain('btn btn-delete btn-default btn-xs');
            expect(deleteButton.innerHTML).toContain('Delete');
        });

        it('Should redirect to the create route', () => {
            const wrapper = shallow(
              <MaDeleteButton entityName={'MyEntity'} entry={entry} label={'Delete'} size={'xs'} />
            );
            const deleteButton = wrapper.find('.btn');

            expect(deleteButton.props().to).toEqual('/MyEntity/delete/23');

            // wrapper.simulate('click');
            //
            // expect(deleteButton.props().params.entity).toEqual('MyEntity');
            // expect(deleteButton.props().params.id).toEqual(23);
        });
    });
});
