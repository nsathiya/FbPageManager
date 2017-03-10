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
import s from './Home.css';
import image from './profbg2.jpeg';

const mainImage = {
  backgroundImage: `url(${image})`,
};

class Home extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string,
    })).isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>

          <section className={s.mainImg} style={mainImage} >
            <div className="row">
              <div className={s.mainLogo}>
                <h1 className="col-xs-6 col-xs-offset-3"> Get answers from experts. Right away. </h1>
              </div>
            </div>
          </section>

          <section>
            <div className="row">
              <h1 className="col-xs-6 col-xs-offset-3"> Let us help you, get help faster. </h1>
            </div>
          </section>

          <section>
            <div className="row">
              {this.props.data.map((item, i) => (
                <div className="col-xs-4" key={i}>
                  <h4>{item.title}</h4>
                  <div>{item.content}</div>
                </div>
                ),
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
