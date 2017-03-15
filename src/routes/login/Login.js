/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import Auth from '../../components/Utils/Auth.js'

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '', 
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {

    e.preventDefault()
    
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    
    if ( !email || !password ) {
      return;
    }
    
    const loginObj = {
      email: email, 
      password: password
    }
   
    console.log('loginObj', loginObj)

    fetch('/login', 
      { method: 'post', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginObj)
      })
    .then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);
        Auth.authenticateUser(json.token);
        Auth.setCookieInfo('user', json.user);
        window.location.href = `/dashboard`
    }).catch((err) => {
        console.log('err', err)
    });

  }

  handleChange(e) {
    
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    })

  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="logIn panel panel-primary col-xs-6 col-xs-offset-3">
            <div className="panel-body">
              <form onSubmit={this.handleSubmit} role="form">
                <div className="form-group">
                  <h1>Sign Up</h1>
                </div>
                <div className="form-group">
                  <label className="control-label">Email</label>
                  <input id="signupEmail" name="email" type="email" maxLength="50" className="form-control" onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <label className="control-label">Password</label>
                  <input id="signupPassword" name="password" type="password" maxLength="25" className="form-control" placeholder="at least 6 characters" onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <button id="signupSubmit" type="submit" className="btn btn-info btn-block">Create your account</button>
                </div>
                
                <p>Dont have an account? <a href="/register">Sign Up</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
