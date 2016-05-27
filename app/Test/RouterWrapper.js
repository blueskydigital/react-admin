import React from 'react';
import RouterStub from './RouterStub';
import ComponentWrapper from './ComponentWrapper';

function wrapComponent(cb) {
    const childContextTypes = {
        router: React.PropTypes.func
    };
    const childContext = {
        router: RouterStub
    };

    return ComponentWrapper(childContextTypes, childContext, cb);
}

export default wrapComponent;
