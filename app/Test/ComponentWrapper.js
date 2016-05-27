import React from 'react';
import { shallow, mount, render } from 'enzyme';

export default function ComponentWrapper(childContextTypes, childContext, cb) {
    const TestWrapper = React.createClass({
        childContextTypes: childContextTypes,

        getChildContext () {
            return childContext;
        },

        render () {
            return cb();
        }
    });

    return mount(
        <TestWrapper />
    );
}
