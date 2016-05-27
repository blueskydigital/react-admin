jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';

import JsonField from '../JsonField';

describe('JsonField', () => {
    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    it('should get a code mirror field with correct props and state', () => {
        const value = 'var code;';
        const updatedValue = 'var code = 1;';
        const field = shallow(
          <JsonField name="my_field" value={value} updateField={onChange}/>
        );

        expect(field.props().value).toBe(value);

        field.props().onChange(updatedValue);

        expect(values).toEqual({ 'my_field': updatedValue });
    });
});
