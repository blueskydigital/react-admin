jest.disableAutomock();
jest.mock('../SelectField');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
// import sd from 'skin-deep';
import SelectField from '../SelectField';
import AdminChoiceField from 'admin-config/lib/Field/ChoiceField';
import Immutable from 'immutable';

import ChoiceField from '../ChoiceField';

describe('ChoiceField', () => {

    let values;

    beforeEach(() => {
        SelectField.mockClear();
        values = Immutable.Map({});
    });

    it('should get a choice with correct props', () => {
        const myChoiceField = new AdminChoiceField('my_field');
        myChoiceField.choices([
            { value: 1, label: 'First choice' },
            { value: 2, label: 'Second choice' },
            { value: 3, label: 'Third choice' }
        ]);
        const instance = TestUtils.renderIntoDocument(
          <ChoiceField fieldName="my_field" field={myChoiceField} values={values}/>
        );
        const select = TestUtils.findRenderedComponentWithType(instance, SelectField);

        expect(select.props.choices).toEqual([
            { value: 1, label: 'First choice' },
            { value: 2, label: 'Second choice' },
            { value: 3, label: 'Third choice' }
        ]);
    });

    it('should get a filtered choice with correct props', () => {
        const myChoiceField = new AdminChoiceField('my_field');
        myChoiceField.choices(function (entry) {
            const choices = {
                something: [
                    { value: 1, label: 'First choice' },
                    { value: 2, label: 'Second choice' },
                    { value: 3, label: 'Third choice' }
                ]
            };

            return choices[entry.values.otherFieldVal];
        });
        values = values.set('otherFieldVal', 'something');
        const instance = TestUtils.renderIntoDocument(
          <ChoiceField fieldName="my_field" field={myChoiceField} values={values}/>
        );
        const select = TestUtils.findRenderedComponentWithType(instance, SelectField);

        expect(select.props.choices).toEqual([
            { value: 1, label: 'First choice' },
            { value: 2, label: 'Second choice' },
            { value: 3, label: 'Third choice' }
        ]);
    });
});
