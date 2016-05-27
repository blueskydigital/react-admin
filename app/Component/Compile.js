import React from 'react';
import {Link} from 'react-router';
import jsx from 'jsx-transform';
import objectAssign from 'object-assign';

import { MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton } from './Button';
import { StringColumn, BooleanColumn, DateColumn, NumberColumn, ChoicesColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn, JsonColumn, ReferencedList, WysiwygColumn } from './Column';
import { InputField, CheckboxField, ButtonField, JsonField, DateField, SelectField, TextField, WysiwygField } from './Field';

const Components = {
    MaBackButton, MaCreateButton, MaShowButton, MaEditButton, MaDeleteButton, MaListButton,
    StringColumn, BooleanColumn, DateColumn, NumberColumn, ChoicesColumn, ReferenceColumn, ReferenceManyColumn, TemplateColumn, JsonColumn, ReferencedList, WysiwygColumn,
    InputField, CheckboxField, ButtonField, JsonField, DateField, SelectField, TextField, WysiwygField,
    Link, React
};

// TODO: use https://github.com/bigpipe/react-jsx ?

class Compile extends React.Component {
    evalInContext(template, context) {
        let variables = [];

        if ('string' === typeof template) {
            let args = [];
            for (let i in context) {
                if (this.hasOwnProperty(i)) {
                    args.push(i);
                    variables.push(this[i]);
                }
            }
            // code string to eval
            args.push(`return ${jsx.fromString(template, context)};`);

            // console.log(args);

            // code will be executed in an isolated scope
            template = Function.apply(null, args);
        }

        if ('function' === typeof template) {
            return template.apply(this, variables);
        }

        if (console) {
            console.error(`Unable to compile template of type ${typeof template}`);
        }

        return '';
    }

    render() {

        let props = {
          factory: 'this.createElement',
          passUnknownTagsToFactory: true,
          createElement: React.createElement
        };

        let children = this.props.children;

        if (!children) {
            return null;
        }

        // Avoid string without root element
        if (Array.isArray(children)) {
            children = children.join('');
        }

        if ('string' === typeof children || 'function' === typeof children) {
            // Wrap element without root tag
            if ('string' === typeof children) {
                if (children.trim()[0] !== '<') {
                    children = `<span>${children}</span>`;
                }
            }

            // Import components into context
            props = objectAssign(props, Components, this.props);
            props.props = this.props;

            return this.evalInContext.apply(props, [children, props]);
        }

        return children;
    }
}

export default Compile;
