jest.disableAutomock();
import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Field from 'admin-config/lib/Field/Field';
import NumberField from 'admin-config/lib/Field/NumberField';
import Entity from 'admin-config/lib/Entity/Entity';
import StringFieldView from '../../../Field/StringFieldView';
import NumberFieldView from '../../../Field/NumberFieldView';
import FieldViewConfiguration from '../../../Field/FieldViewConfiguration';

import Column from '../Column';

describe('Column', () => {

    FieldViewConfiguration.registerFieldView('string', StringFieldView);
    FieldViewConfiguration.registerFieldView('number', NumberFieldView);

    function getColumn(field, entity, entry, dataStore, configuration) {
        const wrapper = mount(
          <Column field={field} entity={entity} entry={entry}
                  dataStore={dataStore} configuration={configuration} />
        );
        return wrapper;
    }


    it('should display a string field', () => {
        const field = new Field('name');
        const entity = new Entity('posts');
        const entry = {
            values: {
                'name': 'my posts #1'
            }
        };
        const col = getColumn(field, entity, entry);

        expect(col.text()).toEqual('my posts #1');
    });

    it('should display a string field with a link', () => {
        const field = new NumberField('count');
        const entity = new Entity('posts');
        const entry = {
            values: {
                'count': 123
            }
        };
        field.isDetailLink(true);
        const col = getColumn(field, entity, entry);

        expect(col.find('a span').text()).toEqual('123');
    });
});
