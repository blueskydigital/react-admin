jest.disableAutomock();
import React from 'react';
import { Link } from 'react-router';
import { shallow, mount, render } from 'enzyme';

import BooleanColumn from '../BooleanColumn';

describe('BooleanColumn', () => {

    it('should get a span with correct class depending of Column value', () => {
        [true, false].forEach((booleanValue) => {
            const wrapper = shallow(
              <BooleanColumn value={booleanValue}/>
            );

            expect(wrapper.props().className).toBe(`boolean-${booleanValue}`);
        });
    });
});
