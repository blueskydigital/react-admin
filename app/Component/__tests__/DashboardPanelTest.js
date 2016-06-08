jest.disableAutomock();
jest.mock('react-router');

import React from 'react';
import { Link } from 'react-router';
import { shallow, mount, render } from 'enzyme';

import Entity from 'admin-config/lib/Entity/Entity';
import Entry from 'admin-config/lib/Entry';
import NumberField from 'admin-config/lib/Field/NumberField';
import Field from 'admin-config/lib/Field/Field';
import DateField from 'admin-config/lib/Field/DateField';

import FieldViewConfiguration from '../../Field/FieldViewConfiguration';
import StringFieldView from '../../Field/StringFieldView';
import NumberFieldView from '../../Field/NumberFieldView';
import DateFieldView from '../../Field/DateFieldView';

import RouterStub from '../../Test/RouterStub';
import ComponentWrapper from '../../Test/ComponentWrapper';

import DashboardPanel from '../DashboardPanel';

describe('DashboardPanel', () => {

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

    function getPanel(view, label, dataStore, sortDir, sortField, configuration) {
        if (!configuration) {
            configuration = {
                getEntity: () => new Entity()
            };
        }

        return wrapComponent(configuration, () => <DashboardPanel
            view={view}
            label={label}
            dataStore={dataStore}
            sortDir={sortDir}
            sortField={sortField}
            configuration={configuration}
            />
        );
    }

    let entity;
    let view;
    let dataStore;

    beforeEach(() => {
        entity = new Entity('posts');

        view = entity
            .listView('myView')
            .fields([
                new NumberField('id').label('#'),
                new Field('title').label('Title'),
                new DateField('created_at').label('Creation date')
            ]);

        dataStore = {
            getEntries: () => [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-28' }, 1)
            ]
        };
    });

    describe('Panel header', () => {
        it('should set header with label', () => {
            let panel = getPanel(view, entity.label(), dataStore, null, null, null);

            expect(panel.find('.panel-heading').first().text()).toEqual('Posts');
        });

        it('should set header with clickable label', () => {
            let panel = getPanel(view, entity.label(), dataStore, null, null);
            const link = panel.find('.panel-heading Link');

            link.simulate('click');

            // expect(link.node.state.clickedTo).toEqual('list');
            // expect(link.node.state.params).toEqual('{"entity":"posts"}');
        });
    });

    describe('Panel entries', () => {
        it('should set rows with correct values for each field', () => {
            let panel = getPanel(view, entity.label(), dataStore, null, null);
            const rows = panel.find('table tbody tr');

            expect(rows.length).toEqual(1);
            expect(rows.at(0).children().length).toEqual(3);
            expect(rows.at(0).children().at(1).text()).toEqual('First Post');
        });
    });
});
