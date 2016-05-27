jest.disableAutomock();
jest.mock('react-select');
import Select from 'react-select';

import React from 'react';
import { shallow, mount, render } from 'enzyme';

import SelectField from '../SelectField';

describe('SelectField', () => {
    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        Select.mockClear();
    });

    it('should get a select with correct props and state', () => {
        const choices = [
            { value: 1, label: 'First choice' },
            { value: 2, label: 'Second choice' },
            { value: 3, label: 'Third choice' }
        ];
        const value = 1;
        var select = shallow(
          <SelectField name="my_field" value={value} choices={choices} updateField={onChange}/>
        );

        expect(select.props().name).toBe('my_field');
        expect(select.props().value).toBe('1');
        expect(select.props().options).toEqual([
            { value: '1', label: 'First choice' },
            { value: '2', label: 'Second choice' },
            { value: '3', label: 'Third choice' }
        ]);

        select.props().onChange('2');

        expect(values).toEqual({ 'my_field': '2' });
    });

    it('should get a multi select with correct props and state', () => {
        const choices = [
            { value: 1, label: 'First choice' },
            { value: 2, label: 'Second choice' },
            { value: 3, label: 'Third choice' }
        ];
        const value = [2, 3];
        var select = shallow(
          <SelectField name="my_field" value={value} multiple={true} choices={choices} updateField={onChange}/>
        );

        expect(select.props().value).toBe('2,3');

        select.props().onChange('2,3,1');

        expect(values).toEqual({ 'my_field': ['2', '3', '1'] });
    });
});
