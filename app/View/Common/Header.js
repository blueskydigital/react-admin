import React from 'react';
import {Link} from 'react-router';

class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <h1>
                    <Link to="/">
                        {this.props.title}
                    </Link>
                </h1>
            </header>
        );
    }
}

Header.propTypes = {
    title: React.PropTypes.string.isRequired
};

export default Header;
