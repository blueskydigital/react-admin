jest.disableAutomock();
import React from 'react';
import { Link } from 'react-router';
import { shallow, mount, render } from 'enzyme';

import JsonColumn from '../JsonColumn';


describe('JsonColumn', () => {

    it('should display an array of literals', () => {
        const wrapper = shallow(
          <JsonColumn value={['abc', 123]}/>
        );
        expect(wrapper.find('table').props().className).toBe('table table-condensed');
        expect(wrapper.find('tr').first().find('td').text()).toBe('abc');
        expect(wrapper.find('tr').last().find('td').text()).toBe('123');
    });

    it('should display an object of literals', () => {
        const wrapper = shallow(
          <JsonColumn value={{title1: 'name1', title2: 'name2'}}/>
        );

        expect(wrapper.find('table').props().className).toBe('table table-condensed table-bordered');
        expect(wrapper.find('tr').first().find('th').text()).toBe('title1');
        expect(wrapper.find('tr').first().find('td').text()).toBe('name1');
        expect(wrapper.find('tr').last().find('th').text()).toBe('title2');
        expect(wrapper.find('tr').last().find('td').text()).toBe('name2');
    });

    it('should display a mix of array and objects', () => {
        const wrapper = mount(
          <JsonColumn value={[123, {test1: 'value1'}]}/>
        );

        expect(wrapper.find('table').first().props().className).toBe('table table-condensed');
        expect(wrapper.find('tr').first().find('td').text()).toBe('123');

        const table2 = wrapper.find('td table');
        expect(table2.props().className).toBe('table table-condensed table-bordered');
        expect(table2.find('th').text()).toBe('test1');
        expect(table2.find('td').text()).toBe('value1');
    });
});
