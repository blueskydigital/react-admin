jest.disableAutomock();
import React from 'react';
import { Link } from 'react-router';
import { shallow, mount, render } from 'enzyme';

import TemplateColumn from '../TemplateColumn';

describe('TemplateColumn', () => {

    it('should execute template function with current entry if is a function', () => {
        const template = e => e.first_name + ' ' + e.last_name.toUpperCase();
        const entry = { 'last_name': 'Doe', 'first_name': 'John' };
        const wrapper = mount(
          <TemplateColumn template={template} entry={entry} />
        );

        // console.log(wrapper.debug());

        expect(wrapper.find('span').text()).toBe('John DOE');
    });

});
