
import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action() {
    // const resp = await fetch('/graphql', {
    //   method: 'post',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query: '{news{title,link,content}}',
    //   }),
    //   credentials: 'include',
    // });
    const resp = await fetch('/getSplashData', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const { data } = await resp.json();

    console.log('__data__', data);
    if (!data) throw new Error('Failed to load splash data.');
    return {
      title: 'Telivy',
      component: <Layout><Home data={data} /></Layout>,
    };
  },

};
