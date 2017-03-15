/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import passport from './core/passport';
import { Strategy } from 'passport-local';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import { port, auth } from './config';
import * as dbUtils from './core/dbUtils.js';

const flash = require('connect-flash');
const logger = require('morgan');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local')
const bCrypt = require('bcrypt-nodejs');
const app = express();


//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
// app.use(expressJwt({
//   secret: auth.jwt.secret,
//   credentialsRequired: false,
//   getToken: req => req.cookies.id_token,
// }));

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
}

const createHash = (password) => {
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

const generateToken = (user) => {
  return jwt.sign(user, 'SECRET', {
    expiresIn: 604800 // in seconds
  });
}

//app.use(session({secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

if (__DEV__) {
  app.enable('trust proxy');
}

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', { session: false });

passport.serializeUser( (user, done) => {

  console.log('in serializeUser');
  done(null, user._id);
});
 
passport.deserializeUser( async (id, done) => {
  console.log('in deserializeUser');
  const user = await dbUtils.findUserById(id)
  done(err, user)
  
});

// Setting username field to email rather than username
const localOptions = {
  usernameField: 'email'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {

  try {
      console.log('entering local login strategy')
      const user = await dbUtils.findUserByEmail(email);


      // Username does not exist, log error & redirect back
      if (!user){
        console.log('User Not Found with username '+username);
        return done(null, false, req.status(400).send('message', 'User Not found.'));                 
      }
      
      // User exists but wrong password, log the error 
      if (!isValidPassword(user, password)){
        console.log('Invalid Password');
        return done(null, false, req.status(400).send('message', 'Invalid Password'));
      }
      
      // User and password both match, return user
      return done(null, user);
    } catch (err) {
      done(err)
    }

});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'SECRET'
}
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await dbUtils.findUserById(payload._id);
    if (user)
      return done(null, user)
    return done(null, false);

  } catch(err) {
    
    console.log('err from jwtLogin', err)
    done(err, false)

  }
  

})

passport.use(jwtLogin);
passport.use(localLogin);

// // passport/login.js
// passport.use('login', new LocalStrategy({
//     passReqToCallback : true
//   },
//   async (req, username, password, done) => { 
//     console.log('in login')
//     // check in mongo if a user with username exists or not

//     try {
//       const user = await dbUtils.findUserByUsername(username);

//       // Username does not exist, log error & redirect back
//       if (!user){
//         console.log('User Not Found with username '+username);
//         return done(null, false, req.status(400).send('message', 'User Not found.'));                 
//       }
      
//       // User exists but wrong password, log the error 
//       if (!isValidPassword(user, password)){
//         console.log('Invalid Password');
//         return done(null, false, req.status(400).send('message', 'Invalid Password'));
//       }
      
//       // User and password both match, return user
//       return done(null, user);
//     } catch (err) {
//       done(err)
//     }
    
//   })
// );

// passport.use('signup', new LocalStrategy({
//     passReqToCallback : true
//   },
//   (req, username, password, done) => {
//     console.log('in signup')
//     findOrCreateUser = async () => {
//       try {
//         console.log('username', username)
//         // find a user in Mongo with provided username
//         const user = await dbUtils.findUserByUsername(username);

//         // Username does not exist, log error & redirect back
//         if (user){
//           console.log('User already exists');
//           return done(null, false, req.status(400).send('message','User Already Exists'));               
//         }
        
//         let newUser = {};
//         newUser.username = username;
//         newUser.password = createHash(password);
//         newUser.email = req.param('email');
//         newUser.firstName = req.param('firstName');
//         newUser.lastName = req.param('lastName');
        
//         const result = await dbUtils.createUser(newUser)
//         if (result)
//           return done(null, newUser)
    
//       } catch (err) {
//         console.log(err);
//         done(err)
//       }
//     }
      
//     // Delay the execution of findOrCreateUser and execute 
//     // the method in the next tick of the event loop
//     console.log('in signup')
//     process.nextTick(findOrCreateUser);
//   })
// );

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }),
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: __DEV__,
  rootValue: { request: req },
  pretty: __DEV__,
})));

//
//Login Information
//
// app.post('/login', passport.authenticate('login', {
//   successRedirect: '/home',
//   failureRedirect: '/',
//   failureFlash : true 
// }));

// app.post('/login', passport.authenticate('login'));

app.post('/login', requireLogin, async(req, res, next) => {
 
  try {

      const user = req.user
      // User and password both match, return user
      return res.status(200).json({
        token: `JWT ${generateToken(user)}`,
        user: user
      });
    } catch (err) {
      console.log('err', err)
      done(err)
    }
})

app.post('/signup', async (req, res, next) => {

   try {
        console.log('Creating User: Body- ', req.body)
        // find a user in Mongo with provided username
        const user = await dbUtils.findUserByEmail(req.body.email);

        // Username does not exist, log error & redirect back
        if (user){
          console.log('User already exists');
          return done(null, false, req.status(400).send('message','User Already Exists'));               
        }
        
        let newUser = {};
        newUser.password = createHash(req.body.password);
        newUser.email = req.body.email;
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        
        const result = await dbUtils.createUser(newUser)
        if (result)
          return res.status(201).json({
            token: `JWT ${generateToken(newUser)}`,
            user: newUser
          });
    
      } catch (err) {
        console.log(err);
        done(err)
      }

});

app.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});
//
// Server-side data pull
//

app.get('/getSplashData', async (req, res, next) => {
  
  try {
    let d = {};
    d.data = await dbUtils.getSplashData();
    res.status(200).send(d);
  } catch(err) {
    console.log('err', err)
    //Change status code depending on error
    res.status(400).send(err)
  }
  
},
);

app.get('/allUsers', requireAuth, async (req, res, next) => {
  
  console.log('reached allUsers')
  try {
    let d = {};
    d.data = await dbUtils.getAllUsers();
    res.status(200).send(d);
  } catch(err) {
    console.log('err', err)
    //Change status code depending on error
    res.status(400).send(err) 
  } 
})

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
    };

    const route = await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ];
    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */
