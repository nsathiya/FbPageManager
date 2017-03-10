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
          <h1>Our Specialists</h1>
          {
          // Pulling data from graphql
          // {this.props.news.map(item => (
          //   <article key={item.link} className={s.newsItem}>
          //     <h1 className={s.newsTitle}><a href={item.link}>{item.title}</a></h1>
          //     <div
          //       className={s.newsDesc}
          //       // eslint-disable-next-line react/no-danger
          //       dangerouslySetInnerHTML={{ __html: item.content }}
          //     />
          //   </article>
          // ))}
            <div>

              <div className="row">
                {this.props.data.map((item, i) => (
                  <div className="col-xs-4" key={i}>
                    <h4>{item.title}</h4>
                    <div>{item.content}</div>
                  </div>
                  ),
                )}
              </div>

            </div>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
