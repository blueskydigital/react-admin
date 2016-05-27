jest.disableAutomock();

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Entry from 'admin-config/lib/Entry';

import MaDatagridPagination from '../MaDatagridPagination';

describe('MaDatagridPagination', () => {

    let pages = [];
    const onChange = page => {
        pages.push(page);
    };

    function getPagination(items, page, perPage) {
        return mount(
          <MaDatagridPagination totalItems={items} onChange={onChange}
            page={page} perPage={perPage} />
        );
    }

    describe('Without items', () => {
        it('Should display "No record found"', () => {
            let pagination = getPagination(0, 1, 10);

            expect(pagination.text()).toContain('No record found.');
        });

        it('Should not display a pagination', () => {
            const pagination = getPagination(0, 1, 10);
            const paginationElement = pagination.find('.pagination');

            expect(paginationElement.length).toEqual(0);
        });
    });

    describe('Without less item than perPage', () => {
        it('Should display record number', () => {
            let pagination = getPagination(10, 1, 10);

            expect(pagination.text()).toContain('1 - 10 on 10');
        });

        it('Should not display a pagination', () => {
            const pagination = getPagination(10, 1, 10);
            const paginationElement = pagination.find('.pagination');

            expect(paginationElement.length).toEqual(0);
        });
    });

    describe('On page 2', () => {
        it('Should display record number', () => {
            let pagination = getPagination(30, 2, 10);

            expect(pagination.text()).toContain('11 - 20 on 30');
        });

        it('Should display a pagination', () => {
            const pagination = getPagination(30, 2, 10);
            const paginationElements = pagination.find('.pagination li');

            expect(paginationElements.at(0).text()).toEqual('« Prev');
            expect(paginationElements.at(1).text()).toEqual('1');
            expect(paginationElements.at(2).text()).toEqual('2');
            expect(paginationElements.at(3).text()).toEqual('3');
            expect(paginationElements.at(4).text()).toEqual('Next »');
        });
    });

    describe('pagination link', () => {
        it('Should call onChange callback', () => {
            const pagination = getPagination(56, 2, 10);
            const nextPage = pagination.find('a.next');

            nextPage.simulate('click');

            expect(pages).toEqual([3]);
        });
    });
});
