jest.disableAutomock();
jest.mock('react-router');

import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Entity from 'admin-config/lib/Entity/Entity';
import Entry from 'admin-config/lib/Entry';
import NumberField from 'admin-config/lib/Field/NumberField';
import Field from 'admin-config/lib/Field/Field';
import DateField from 'admin-config/lib/Field/DateField';
import ListView from 'admin-config/lib/View/ListView';

import FieldViewConfiguration from '../../../Field/FieldViewConfiguration';
import StringFieldView from '../../../Field/StringFieldView';
import NumberFieldView from '../../../Field/NumberFieldView';
import DateFieldView from '../../../Field/DateFieldView';

import RouterStub from '../../../Test/RouterStub';
import ComponentWrapper from '../../../Test/ComponentWrapper';

import Datagrid from '../Datagrid';


describe('Datagrid', () => {

    FieldViewConfiguration.registerFieldView('string', StringFieldView);
    FieldViewConfiguration.registerFieldView('number', NumberFieldView);
    FieldViewConfiguration.registerFieldView('date', DateFieldView);

    function wrapComponent(configuration, cb) {
        const childContextTypes = {
            router: React.PropTypes.func,
            configuration: React.PropTypes.object
        };
        const childContext = {
            router: RouterStub,
            configuration: configuration
        };

        return ComponentWrapper(childContextTypes, childContext, cb);
    }

    let sorted = {};
    const onSort = (name, dir) => {
        sorted = {};
        sorted[name] = dir;
    };

    let view, router, fields;

    function getDatagrid(name, entityName, fields, view, router, entries, sortDir, sortField, configuration) {
        if (!configuration) {
            configuration = {
                getEntity: () => new Entity()
            };
        }

        return wrapComponent(configuration, () => <Datagrid
                name={name}
                fields={fields}
                entityName={entityName}
                view={view}
                router={router}
                entries={entries}
                sortDir={sortDir}
                sortField={sortField}
                listActions={view.listActions()}
                onSort={onSort}
            />
        );
    }

    beforeEach(() => {
        view = new ListView('myView');

        router = {
            getCurrentQuery: () => 1
        };

        fields = [
            new NumberField('id').label('#'),
            new Field('title').label('Title').isDetailLink(true),
            new DateField('created_at').label('Creation date')
        ];
    });

    describe('Column headers', () => {
        it('should set header with correct label for each field', () => {
            let datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);
            let headers = datagrid.find('thead th');

            expect(headers.at(0).text()).toEqual('#');
            expect(headers.at(1).text()).toEqual('Title');
            expect(headers.at(2).text()).toEqual('Creation date');
        });

        it('should send `sort` event to datagrid when clicking on header', () => {
            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, [], null, null);

            datagrid.find('thead th a').at(0).simulate('click');  // click on ID header
            expect(sorted).toEqual({ 'myView.id': 'ASC' });

            datagrid.find('thead th a').at(2).simulate('click');  // click on Creation date header
            expect(sorted).toEqual({ 'myView.created_at': 'ASC' });
        });
    });

    describe('Datagrid entries', () => {
        it('should set rows with correct values for each field', () => {
            const entries = [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-27' }, 1),
                new Entry('posts', { 'id': 2, 'title': 'Second Post', 'created_at': '2015-05-28' }, 2),
                new Entry('posts', { 'id': 3, 'title': 'Third Post', 'created_at': '2015-05-29' }, 3),
                new Entry('posts', { 'id': 44, 'title': '44th Post', 'created_at': '2016-05-29' }, 44)
            ];

            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, entries);
            const rows = datagrid.find('tbody tr');

            expect(rows.length).toEqual(4);
            expect(rows.at(0).children().length).toEqual(3);

            expect(rows.at(0).find('td').at(1).text()).toEqual('First Post');
            expect(rows.at(2).find('td').at(2).text()).toEqual('2015-05-29');
            expect(rows.at(3).find('td').at(1).text()).toEqual('44th Post');
        });

         it('should set rows with correct values, plus action buttons', () => {
            const entries = [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-27' }, 1)
            ];
            view = view.listActions(['edit']);
            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, entries);
            const cells = datagrid.find('tbody tr td');

            expect(cells.length).toEqual(4);  // 3 + actions buttons
            expect(cells.at(3).text()).toContain('Edit');
        });

        it('should set make editable link from id cell', () => {
            const entries = [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-27' }, 1)
            ];
            view = view.listActions(['edit']);
            const datagrid = getDatagrid('myView', 'myEntity', fields, view, router, entries, null, null);
            const cells = datagrid.find('tbody tr td');

            expect(cells.find('a').at(0).text()).toBe('1'); // id
        });
    });
});
