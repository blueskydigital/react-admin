jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import MaEditButton from '../MaEditButton';

describe('MaEditButton', () => {
    let entry;

    beforeEach(() => {
        entry = {
            identifierValue: 24
        };
    });

    describe('With good props', () => {
        it('Should display label and size', () => {
            const wrapper = mount(
              <MaEditButton entityName={'MyEntity'} entry={entry} label={'Delete'} size={'xs'} />
            );
            const editButton = wrapper.find('.btn').node;

            expect(editButton.className).toContain('btn btn-edit btn-default btn-xs');
            expect(editButton.innerHTML).toContain('Delete');
        });

        it('Should redirect to the edit route', () => {
            const wrapper = shallow(
              <MaEditButton entityName={'MyEntity'} entry={entry} label={'Delete'} size={'xs'} />
            );
            const editButton = wrapper.find('.btn');

            expect(editButton.props().to).toEqual('/MyEntity/edit/24');

            // wrapper.simulate('click');
            //
            // expect(editButton.props().params.entity).toEqual('MyEntity');
            // expect(editButton.props().params.id).toEqual(24);
        });
    });
});
