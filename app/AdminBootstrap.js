import React from 'react';
import {RouteHandler, Link} from 'react-router';

import Header from './View/Common/Header';
import Sidebar from './View/Common/Sidebar';

import FieldViewConfiguration from './Field/FieldViewConfiguration';

import BooleanFieldView from './Field/BooleanFieldView';
import DateFieldView from './Field/DateFieldView';
import EmailFieldView from './Field/EmailFieldView';
import FileFieldView from './Field/FileFieldView';
import JsonFieldView from './Field/JsonFieldView';
import NumberFieldView from './Field/NumberFieldView';
import StringFieldView from './Field/StringFieldView';
import ReferencedListFieldView from './Field/ReferencedListFieldView';
import ReferenceFieldView from './Field/ReferenceFieldView';
import ReferenceManyFieldView from './Field/ReferenceManyFieldView';
import TextFieldView from './Field/TextFieldView';
import TemplateFieldView from './Field/TemplateFieldView';
import WysiwygFieldView from './Field/WysiwygFieldView';
import ChoiceFieldView from './Field/ChoiceFieldView';
import ChoicesFieldView from './Field/ChoicesFieldView';

FieldViewConfiguration.registerFieldView('boolean', BooleanFieldView);
FieldViewConfiguration.registerFieldView('date', DateFieldView);
FieldViewConfiguration.registerFieldView('datetime', DateFieldView);
FieldViewConfiguration.registerFieldView('email', EmailFieldView);
FieldViewConfiguration.registerFieldView('file', FileFieldView);
FieldViewConfiguration.registerFieldView('json', JsonFieldView);
FieldViewConfiguration.registerFieldView('number', NumberFieldView);
FieldViewConfiguration.registerFieldView('choice', ChoiceFieldView);
FieldViewConfiguration.registerFieldView('choices', ChoicesFieldView);
FieldViewConfiguration.registerFieldView('referenced_list', ReferencedListFieldView);
FieldViewConfiguration.registerFieldView('reference', ReferenceFieldView);
FieldViewConfiguration.registerFieldView('reference_many', ReferenceManyFieldView);
FieldViewConfiguration.registerFieldView('string', StringFieldView);
FieldViewConfiguration.registerFieldView('template', TemplateFieldView);
FieldViewConfiguration.registerFieldView('text', TextFieldView);
FieldViewConfiguration.registerFieldView('wysiwyg', WysiwygFieldView);

class AdminBootstrap extends React.Component {
    getChildContext() {
        return {
            configuration: this.props.configuration,
            state: this.props.state
        };
    }

    render() {
        return (
            <div>
                <Header title={this.props.configuration.title()}/>
                <Sidebar menuViews={this.props.configuration.menu()}/>
                <div className="view-wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

AdminBootstrap.childContextTypes = {
    configuration: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired
};

AdminBootstrap.propTypes = {
    configuration: React.PropTypes.object.isRequired
};

export default AdminBootstrap;
