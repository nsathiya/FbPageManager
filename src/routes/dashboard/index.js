
import React from 'react';
import Dashboard from './Dashboard';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';
import Auth from '../../components/Utils/Auth.js';

export default {

  path: '/dashboard',

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

    // const token = Auth.getToken();
    // console.log('token', token)
    // const resp = await fetch('/allUsers', {
    //   method: 'get',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authentication': `$(token)`
    //   },
    // });

    // const { data } = await resp.json();

    // console.log('__data__', data);
    // if (!data) throw new Error('Failed to load users');
    return {
      title: 'FB Page Manager',
      component: <Layout><Dashboard/></Layout>,
    };
  },

};
