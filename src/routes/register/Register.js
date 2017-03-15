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
import Auth from '../../components/Utils/Auth.js';
import s from './Register.css';

class Register extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '', 
      password: '', 
      passwordConfirm: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {

    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    })
  }

  async handleSubmit(e) {

    e.preventDefault()
    
    const firstName = this.state.firstName.trim();
    const lastName = this.state.lastName.trim();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const passwordConfirm = this.state.passwordConfirm.trim();
    
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      return;
    }
    const registrationObj = {
      firstName: firstName,
      lastName: lastName,
      email: email, 
      password: password, 
      passwordConfirm: passwordConfirm
    }
    console.log('registrationObj', registrationObj)

    fetch('/signup', 
      { method: 'post', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationObj)
      })
    .then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);
        Auth.authenticateUser(json.token);
        Auth.setCookieInfo('user', json.user);
        window.location.href = `/`
    }).catch((err) => {
        console.log('err', err)
    });


    this.setState({
      firstName: '',
      lastName: '',
      email: '', 
      password: '', 
      passwordConfirm: ''
    })
    return;
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="signUp panel panel-primary col-xs-6 col-xs-offset-3">
            <div className="panel-body">
              <form onSubmit={this.handleSubmit} role="form">
                <div className="form-group">
                  <h1>Create account</h1>
                </div>
                <div className="form-group">
                  <label className="control-label">First Name</label>
                  <input id="signupFirstName" name="firstName" type="text" maxLength="50" className="form-control" onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <label className="control-label">Last Name</label>
                  <input id="signupLastName" name="lastName" type="text" maxLength="50" className="form-control" onChange={this.handleChange}/>
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
                  <label className="control-label">Password again</label>
                  <input id="signupPasswordagain" name="passwordConfirm" type="password" maxLength="25" className="form-control" onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <button id="signupSubmit" type="submit" className="btn btn-info btn-block">Create your account</button>
                </div>
                <p className="form-group">By creating an account, you agree to our <a href="#">Terms of Use</a> and our <a href="#">Privacy Policy</a>.</p>
                
                <p>Already have an account? <a href="#">Sign in</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withStyles(s)(Register);
