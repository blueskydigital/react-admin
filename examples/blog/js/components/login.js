import React from 'react';
import { browserHistory } from 'react-router';

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      uname: '',
      pwd: ''
    };
  }

  unameChange(e) {
    e.preventDefault();
    this.setState({uname: e.target.value, pwd: this.state.pwd});
  }

  pwdChange(e) {
    e.preventDefault();
    this.setState({uname: this.state.uname, pwd: e.target.value});
  }

  login(e) {
    e.preventDefault();
    this.props.state.login(this.state).then((user) => {
      browserHistory.push('/');
    });
  }

  render() {
    return (
      <form role='form'>
        <div className='form-group'>
          <input type='text' value={this.state.uname}
            onChange={this.unameChange.bind(this)}
            placeholder='Username' />
          <input type='password' value={this.state.password}
            onChange={this.pwdChange.bind(this)}
            placeholder='Password' />
        </div>
        <button type='submit' onClick={this.login.bind(this)}>Submit</button>
      </form>
    );
  }

}
