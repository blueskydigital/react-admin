jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import MaListButton from '../MaListButton';

describe('MaListButton', () => {

    describe('With good props', () => {
        it('Should display label', () => {
            const wrapper = mount(
              <MaListButton entityName={'MyEntity'} label={'Hello'} />
            );
            const button = wrapper.find('.btn').node;

            expect(button.className).toContain('btn btn-list btn-default');
            expect(button.innerHTML).toContain('Hello');
        });

        it('Should display size', () => {
            const wrapper = mount(
              <MaListButton entityName={'MyEntity'} label={'Hello'} size={'xs'} />
            );
            const button = wrapper.find('.btn').node;

            expect(button.className).toEqual('btn btn-list btn-default btn-xs');
        });

        it('Should redirect to the list route', () => {
            const wrapper = shallow(
              <MaListButton entityName={'Gandalf'} label={'Hello'} size={'xs'} />
            );
            const button = wrapper.find('.btn');

            expect(button.props().to).toEqual('list');

            wrapper.simulate('click');

            expect(button.props().params.entity).toEqual('Gandalf');
        });
    });
});
