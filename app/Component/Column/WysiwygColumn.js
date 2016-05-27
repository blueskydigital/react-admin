import React from 'react';

class WysiwygColumn extends React.Component {
    render() {
        let {value} = this.props;

        return <div dangerouslySetInnerHTML={{__html: value}} />;
    }
}

WysiwygColumn.propTypes = {
    value: React.PropTypes.any
};

export default WysiwygColumn;
