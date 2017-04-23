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
import Auth from '../../components/Utils/Auth.js';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.statusChangeCallback = this.statusChangeCallback.bind(this);
  }


  componentDidMount() {
    // FB.getLoginStatus((response) => {
    //   console.log('Got login status');
    //   this.statusChangeCallback(response);
    // });
  }
  // componentDidMount() {
  //   window.fbAsyncInit = function() {
  //     FB.init({
  //       appId      : '1438461692877772',
  //       cookie     : true,  // enable cookies to allow the server to access
  //                         // the session
  //       xfbml      : true,  // parse social plugins on this page
  //       version    : 'v2.3' // use version 2.1
  //     });

  //     console.log('about to get login status');
  //     // Now that we've initialized the JavaScript SDK, we call
  //     // FB.getLoginStatus().  This function gets the state of the
  //     // person visiting this page and can return one of three states to
  //     // the callback you provide.  They can be:
  //     //
  //     // 1. Logged into your app ('connected')
  //     // 2. Logged into Facebook, but not your app ('not_authorized')
  //     // 3. Not logged into Facebook and can't tell if they are logged into
  //     //    your app or not.
  //     //
  //     // These three cases are handled in the callback function.
  //     FB.getLoginStatus(function(response) {
  //        console.log('Got login status');
  //       this.statusChangeCallback(response);
  //     }.bind(this));
  //   }.bind(this);

  //   // Load the SDK asynchronously
  //   (function(d, s, id) {
  //     var js, fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) return;
  //     js = d.createElement(s); js.id = id;
  //     js.src = "//connect.facebook.net/en_US/sdk.js";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   }(document, 'script', 'facebook-jssdk'));
  // }

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      Auth.setCookieInfo('userAccessToken', response.authResponse.accessToken);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
      FB.login(() => {
        FB.api('/me/accounts', (response) => {
          console.log('accounts');
          console.log(response);
          const pageAccessToken = response.data[0].access_token;
          console.log(`pageAccessToken${pageAccessToken}`);
          FB.api(
              '/1858035424460206/feed/',
              'POST',
            {
              message: '"hello"',
              access_token: pageAccessToken,
            },
              (response) => {
                // Insert your code here
                console.log(response);
              },
            );
        });
      }, { scope: 'publish_actions, manage_pages, publish_pages, read_insights, manage_pages' });
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
      FB.login((response) => {
        Auth.setCookieInfo('userAccessToken', response.accessToken);

        FB.api('/me/accounts', (response) => {
          console.log('accounts');
          console.log(response);
          const pageAccessToken = response.data[0].access_token;
          console.log(`pageAccessToken${pageAccessToken}`);
        });
      }, { scope: 'publish_actions, manage_pages, publish_pages, read_insights, manage_pages' });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const email = this.state.email.trim();
    const password = this.state.password.trim();

    if (!email || !password) {
      return;
    }

    const loginObj = {
      email,
      password,
    };

    console.log('loginObj', loginObj);

    fetch('/login',
      { method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginObj),
      })
    .then(res => res.json()).then((json) => {
      console.log(json);
      Auth.authenticateUser(json.token);
      Auth.setCookieInfo('user', json.user);
      window.location.href = '/dashboard';
    }).catch((err) => {
      console.log('err', err);
    });
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
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
                  <label className="control-label">Status</label>
                  <div id="status" />
                </div>
                <div className="form-group">
                  <label className="control-label">Email</label>
                  <input id="signupEmail" name="email" type="email" maxLength="50" className="form-control" onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label className="control-label">Password</label>
                  <input id="signupPassword" name="password" type="password" maxLength="25" className="form-control" placeholder="at least 6 characters" onChange={this.handleChange} />
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
