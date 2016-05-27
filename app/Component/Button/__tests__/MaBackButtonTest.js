jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import MaBackButton from '../MaBackButton';

describe('MaBackButton', () => {

    describe('With good props', () => {
        it('Should display label and size', () => {

            const wrapper = mount(
              <MaBackButton label={'Hello'} size={'xs'} />
            );
            const button = wrapper.find('.btn').node;

            expect(button.className).toContain('btn-xs');
            expect(button.innerHTML).toContain('Hello');
        });
    });
});
