jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import MaCreateButton from '../MaCreateButton';


describe('MaCreateButton', () => {

    describe('With good props', () => {
        it('Should display label and size', () => {
            const wrapper = mount(
              <MaCreateButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />
            );
            const createButton = wrapper.find('.btn').node;

            expect(createButton.className).toContain('btn btn-create btn-default btn-xs');
            expect(createButton.innerHTML).toContain('Hello');
        });

        it('Should redirect to the create route', () => {
            const wrapper = shallow(
              <MaCreateButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />
            );
            const createButton = wrapper.find('.btn');

            expect(createButton.props().to).toEqual('create');

            wrapper.simulate('click');

            expect(createButton.props().params.entity).toEqual('MyEntity');
        });
    });
});
