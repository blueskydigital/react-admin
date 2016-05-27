jest.unmock('../InputField');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import InputField from '../InputField';

describe('InputField', () => {

    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    it('should get an input with correct default value and editable', () => {

        // Render a checkbox with label in the document
        const input = TestUtils.renderIntoDocument(
          <InputField name="my_field" value="default val" updateField={onChange}/>
        );
        const inputNode = ReactDOM.findDOMNode(input);

        expect(inputNode.value).toBe('default val');

        TestUtils.Simulate.change(inputNode, { target: { value: 'Hello, world'} });

        expect(values['my_field']).toBe('Hello, world');
    });
});
