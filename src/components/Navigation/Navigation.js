/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import Auth from '../Utils/Auth.js';

class Navigation extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      authenticated : false
    }
    this.statusChangeCallback = this.statusChangeCallback.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount(){
    if (Auth.getCookieInfo('userName') && Auth.getCookieInfo('userAccessToken'))
      this.setState({
        authenticated:true
      })
  }
  
  logout(e) {
    Auth.deauthenticateUser();
    Auth.setCookieInfo('user', null);
    console.log(Auth.getToken());
    window.location.href = `/`
  }

  login(e) {
    FB.getLoginStatus((response) => {
      console.log(response);
      this.statusChangeCallback(response);
    });
  }

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(response) {
    console.log("Login response- ", response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {

      Auth.setCookieInfo('userAccessToken', response.authResponse.accessToken);
      FB.api('/me', (response)=> {
        console.log('me', response);
        Auth.setCookieInfo('userName', response.name);
        this.setState({
          authenticated: true
        });
      });

    } else if (response.status === 'not_authorized') {

      // The person is logged into Facebook, but not your app.
      FB.login(() => {
        Auth.setCookieInfo('userAccessToken', response.authResponse.accessToken);
        FB.api('/me', (response)=> {
          Auth.setCookieInfo('userName', response.name);
          this.setState({
            authenticated: true
          });
        });
      }, { scope: 'publish_actions, manage_pages, publish_pages, read_insights, manage_pages' });

    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      FB.login((response) => {
        console.log('In unknown', response);
        Auth.setCookieInfo('userAccessToken', response.authResponse.accessToken)
        FB.api('/me', (response)=> {
          Auth.setCookieInfo('userName', response.name);
          this.setState({
            authenticated: true
          });
        });
      }, { scope: 'publish_actions, manage_pages, publish_pages, read_insights, manage_pages' });
    }
  }

  render() {
    const userAuthenticated = this.state.authenticated;
    let headerAccount = [
          <span className={s.spacer}> | </span>,
          <Link className={s.link} onClick={this.login}>Log in with Facebook</Link>,
        ]

    if (userAuthenticated){
      const user = Auth.getCookieInfo('userName');
      headerAccount = [
          <a className={s.link}> Hi {user} </a>,
          <span className={s.spacer}> | </span>,
          <Link className={s.link} onClick={this.logout} to="/" key="logout">Log Out</Link>
        ]
    }

    return (
      <div className={s.root} role="navigation">
        {headerAccount}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
