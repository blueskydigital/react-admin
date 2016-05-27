jest.disableAutomock();
jest.mock('react-router');

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Entry from 'admin-config/lib/Entry';
import routerWrapper from '../../../Test/RouterWrapper';

import MenuItem from '../MenuItem';

describe('MenuItem', () => {

    function getMenuItem(menu) {
        return routerWrapper(() => {
            return <MenuItem menu={menu} />;
        });
    }

    function getMenu(title, link, children = [], icon = null, isActive = false, isChildActive = false) {
        const uuid =  Math.random();

        return {
            uuid: uuid,
            title: () => title,
            isActive: () => isActive,
            isChildActive: () => isChildActive,
            link: () => link,
            icon: () => icon,
            hasChild: () => !!children.length,
            children: () => children
        };
    }

    describe('With simple menu without child', () => {
        it('Should display desired menu', () => {
            let menu = getMenu('Post', '/posts/list', [], null, true);
            let menuItem = getMenuItem(menu);

            let icons = menuItem.find('.glyphicon-list');
            expect(icons.length).toEqual(1);

            let link = menuItem.find('Link');
            link.simulate('click');

            expect(menuItem.find('li').props().className).toContain('active');
            expect(link.node.state.clickedTo).toEqual('/posts/list');
            expect(link.text()).toContain('Post');
        });
    });

    describe('With simple menu with children', () => {
        it('Should display desired buttons', () => {
            let child1 = getMenu('Post', '/posts/list', [], null, true);
            let child2 = getMenu('Comment', '/posts/list', [], null, false);
            let menu = getMenu('Blog', null, [child1, child2], null, false, true);
            let menuItem = getMenuItem(menu);

            let arrow = menuItem.find('.arrow');
            let childrenContainer = menuItem.find('.nav-second-level');
            let childNodes = menuItem.find('ul li');

            expect(arrow.props().className).toContain('glyphicon-menu-down');
            expect(childrenContainer).toBeTruthy();

            expect(childNodes.at(0).text()).toContain('Post');
            expect(childNodes.at(1).text()).toContain('Comment');
        });
    });
});
