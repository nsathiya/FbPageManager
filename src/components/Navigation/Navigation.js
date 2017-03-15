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
  
  logout(e) {
    Auth.deauthenticateUser();
    Auth.setCookieInfo('user', null);
    console.log(Auth.getToken());
    window.location.href = `/`
  }

  render() {
    const userAuthenticated = Auth.isUserAuthenticated();
    let headerAccount = [
          <Link className={s.link} to="/about" key="about">About</Link>,
          <Link className={s.link} to="/contact" key="contact">Contact</Link>,
          <span className={s.spacer}> | </span>,

          <Link className={s.link} to="/login" key="login">Log in</Link>,
          <span className={s.spacer} key="or">or</span>,
          <Link className={cx(s.link, s.highlight)} to="/register" key="signup">Sign up</Link>
        ] 
   
    if (userAuthenticated){
      const user = Auth.getCookieInfo('user');
      headerAccount = [
          <a className={s.link}> Hi {user.firstName} </a>,
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
