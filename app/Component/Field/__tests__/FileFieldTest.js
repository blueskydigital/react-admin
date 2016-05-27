jest.disableAutomock();
jest.mock('rc-upload/lib/IframeUploader');

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import AdminFileField from 'admin-config/lib/Field/FileField';
import IframeUploader from 'rc-upload/lib/IframeUploader';

import FileField from '../FileField';

describe('FileField', () => {

    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        IframeUploader.mockClear();
    });

    it('should display a upload button and change value on upload', () => {
        let field = new AdminFileField();

        field.uploadInformation({
            url: '/upload',
            apifilename: 'name'
        });

        var ffield = shallow(
          <FileField name="my_field" field={field} value={null} updateField={onChange}/>
        );
        const upload = ffield.find('Upload');

        upload.props().onSuccess('{ "name": "my-cat.jpeg" }', { name: 'cat.jpg' });

        jest.clearAllTimers(); // to avoid waiting for the end of setTimout calls

        expect(values).toEqual({ 'my_field': 'my-cat.jpeg' });
    });
});
