jest.disableAutomock();
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import WysiwygField from '../WysiwygField';
import Editor from 'react-medium-editor/lib/editor'

describe('WysiwygField', () => {

    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    it('should get a div with correct default value and editable', () => {
        const html = '<p>Para</p>';
        const instance = TestUtils.renderIntoDocument(
          <WysiwygField name="my_field" value={html} updateField={onChange}/>
        );
        const editor = TestUtils.findRenderedComponentWithType(instance, Editor);

        expect(editor.state.text).toBe('<p>Para</p>');

        editor.change('<p>Para</p><p>My new Para</p>');

        expect(values).toEqual({ 'my_field': '<p>Para</p><p>My new Para</p>' });
    });
});
