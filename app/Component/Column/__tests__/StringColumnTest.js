jest.disableAutomock();
import React from 'react';
import { Link } from 'react-router';
import { shallow, mount, render } from 'enzyme';

import StringColumn from '../StringColumn';

describe('StringColumn', () => {

    it('should display given value', () => {
        const wrapper = shallow(<StringColumn value={'Hello'} />);

        expect(wrapper.find('span').text()).toBe('Hello');
    });
});
