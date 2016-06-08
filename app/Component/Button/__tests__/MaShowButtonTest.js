jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import MaShowButton from '../MaShowButton';

describe('MaShowButton', () => {
    let entry;

    beforeEach(() => {
        entry = {
            identifierValue: 23
        };
    });

    describe('With good props', () => {
        it('Should display label and default size', () => {
            const wrapper = mount(
              <MaShowButton entityName={'MyEntity'} entry={entry} label={'Show'} size={'xs'} />
            );
            const button = wrapper.find('.btn').node;

            expect(button.className).toEqual('btn btn-show btn-default btn-xs');
            expect(button.innerHTML).toContain('Show');
        });

        it('Should redirect to the show route', () => {
            const wrapper = shallow(
              <MaShowButton entityName={'MyEntity'} entry={entry} label={'Hello'} />
            );
            const button = wrapper.find('.btn');

            expect(button.props().to).toEqual('/MyEntity/show/23');
        });
    });
});
