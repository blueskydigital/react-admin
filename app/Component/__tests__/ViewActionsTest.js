jest.disableAutomock();
import React from 'react';
import { Link } from 'react-router';
import { shallow, mount, render } from 'enzyme';
import ViewActions from '../ViewActions';


describe('ViewActions', () => {

    let view;
    let entry;

    beforeEach(() => {
        entry = {
            identifierValue: 11
        };
        view = {
            entity: {
                name: () => 'MyEntity'
            }
        };
    });

    describe('With buttons prop', () => {
        it('Should display desired buttons', () => {
            let viewActions = mount(
              <ViewActions buttons={['back', 'delete']} entry={entry} entityName={view.entity.name()} />
            );

            // console.log(viewActions.debug());

            expect(viewActions.find('.btn-back').text()).toContain('Back');
            expect(viewActions.find('.btn-delete').text()).toContain('Delete');
        });
    });
});
