jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

describe('autoloader', () => {

    require('../Component/Column/NumberColumn');
    const autoload = require('../autoloader');

    describe('Should retrieve auto registrered component', () => {
        it('Should load a non loaded component', () => {
            var numberColumn = TestUtils.renderIntoDocument(<NumberColumn value={42} />);
            numberColumn = ReactDOM.findDOMNode(numberColumn);

            expect(+numberColumn.innerHTML).toEqual(42);
        });
    });
});
