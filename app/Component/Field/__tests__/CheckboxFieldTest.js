jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';

import CheckboxField from '../CheckboxField';

describe('CheckboxField', () => {
    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    it('should get an input with correct default value and editable', () => {
        [true, false, 1, 0].forEach((booleanValue) => {
            let checkbox = shallow(
              <CheckboxField name="my_checkbox_field" value={booleanValue} updateField={onChange}/>
            );

            expect(checkbox.props().checked).toBe(booleanValue ? true : false);

            checkbox.simulate('change', { 'target': { 'checked': booleanValue ? false : true} });

            expect(values['my_checkbox_field']).toBe(booleanValue ? 0 : 1);
        });
    });
});
