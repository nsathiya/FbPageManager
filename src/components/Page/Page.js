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
import s from './Page.css';

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
  };

  //   componentDidMount(){
  //       window.fbAsyncInit = function() {
  //           FB.init({
  //             appId      : '1438461692877772',
  //             cookie     : true,  // enable cookies to allow the server to access
  //                               // the session
  //             xfbml      : true,  // parse social plugins on this page
  //             version    : 'v2.3' // use version 2.1
  //           });
  //         }

  //         // Load the SDK asynchronously
  //         (function(d, s, id) {
  //           var js, fjs = d.getElementsByTagName(s)[0];
  //           if (d.getElementById(id)) return;
  //           js = d.createElement(s); js.id = id;
  //           js.src = "//connect.facebook.net/en_US/sdk.js";
  //           fjs.parentNode.insertBefore(js, fjs);
  //         }(document, 'script', 'facebook-jssdk'));
  // }

  render() {
    const { title, html } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Page);
