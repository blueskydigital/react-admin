jest.disableAutomock();
import React from 'react';
import { Link } from 'react-router';
import { shallow, mount, render } from 'enzyme';
import StringColumn from '../Column/StringColumn';
import Compile from '../Compile';

describe('Compile', () => {

    function getCompiledLinkFromString(strElement) {
        return mount(<Compile>{strElement}</Compile>);
    }

    function getCompiledLink(to, params) {
        return mount(<Compile><Link to={to} params={params}></Link></Compile>);
    }

    describe('With simple string', () => {
        it('Should wrap text inside a span', () => {
            const wrapper = mount(<Compile>Hello</Compile>);
            expect(wrapper.find('span').text()).toEqual('Hello');
        });

        it('Should wrap react text inside when a root tag exists', () => {
            const wrapper = mount(<Compile>{'My text'}</Compile>);
            expect(wrapper.find('span').text()).toEqual('My text');
        });

        it('Should not wrap text inside when a jsx root tag exists', () => {
            const wrapper = mount(<Compile><p>My text</p></Compile>);
            expect(wrapper.html()).toEqual('<p>My text</p>');
        });

        it('Should not wrap text inside when a root tag exists', () => {
            const wrapper = mount(<Compile>{'<p>My text</p>'}</Compile>);
            // <p /> is not wrapper by Compile, but React wrap the text
            expect(wrapper.find('p').text()).toEqual('My text');
        });
    });

    describe('With context', () => {
        it('Should be able to use context with jsx', () => {
            const entry = {id: 42};
            let compiled = mount(<Compile entry={entry}>I am entry {entry.id}</Compile>);

            expect(compiled.find('span').text()).toEqual('I am entry 42');
        });

        it('Should be able to use context with a string', () => {
            const entry = {id: 43};
            let compiled = mount(<Compile entry={entry}>{"I am entry {entry.id}"}</Compile>);
            expect(compiled.find('span').text()).toEqual('I am entry 43')
        });
    });

    describe('With external component', () => {
        it('Should be able to use Link component from string', () => {
            let compiled = getCompiledLinkFromString(
              '<Link to={"create"} params={{entity: "posts"}} />'
            );

            expect(compiled.find('Link').props().params.entity).toEqual('posts');
            // compiled.find('Link').simulate('click');
        });

        it('Should be able to use another component from string', () => {
            let compiled = getCompiledLinkFromString(
              '<MaCreateButton entityName={"tags"} />'
            );
            expect(compiled.find('Link').props().to).toEqual('create');
            expect(compiled.find('Link').props().params.entity).toEqual('tags');
        });

        it('Should be able to use another component from jsx', () => {
            let compiled = getCompiledLink('create', {entity: 'posts'});
            expect(compiled.find('Link').props().to).toEqual('create');
            expect(compiled.find('Link').props().params.entity).toEqual('posts');
        });
    });

    describe('Compile sub elements', () => {
        it('should compile any children', () => {
            const column = '<a onClick={this.props.detailAction}><StringColumn value={this.props.value} /></a>';
            let clicked = false;
            const detailAction = () => {
                clicked = true;
            };

            let compiled = mount(
              <Compile detailAction={detailAction} value={123}>{column}</Compile>
            );

            // console.log(compiled.debug());

            expect(compiled.find('StringColumn').text()).toEqual('123');
            compiled.find('a').simulate('click');
            expect(clicked).toBeTruthy();
        });

        it('should compile element returned from a function', () => {
            var column = function() {
                return <StringColumn value={this.props.value} />;
            };
            let compiled = mount(<Compile value={'bike'}>{column}</Compile>);

            expect(compiled.find('StringColumn').text()).toEqual('bike');
        })
    });
});
