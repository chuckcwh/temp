import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { Provider } from 'react-redux';
import cookie from 'react-cookie';

import configureStore from './core/configureStore';
import router from './core/router';
import history from './core/history';

import { fetchConfig, getUserWithToken } from './actions';

import Layout from './components/Layout';

const store = configureStore();

store.dispatch(fetchConfig());

// Start loading user if user id & token is present
const userId = cookie.load('user_id');
const userToken = cookie.load('user_token');
if (userId && userToken) {
  store.dispatch(getUserWithToken({
    id: userId,
    token: userToken,
  }));
}

let routes = require('./routes.json'); // Loaded with utils/routes-loader.js
const container = document.getElementById('container');

function renderComponent(location, component) {
  ReactDOM.render(
    <Provider store={store}><Layout>{component}</Layout></Provider>,
    container, () => {
      if (typeof window !== 'undefined') {
        // Track the page view event via Google Analytics
        if (window.ga) {
          window.ga('set', 'page', location.pathname);
          window.ga('send', 'pageview');
        }

        // Scroll to the top
        window.scrollTo(0, 0);
      }
    });
}

// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location) {
  router.resolve(routes, location)
    .then((component) => renderComponent(location, component))
    .catch(error => router.resolve(routes, { ...location, error }).then(renderComponent));
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
history.listen(render);
render(history.getCurrentLocation());

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes.json', () => {
    routes = require('./routes.json'); // eslint-disable-line global-require
    render(history.getCurrentLocation());
  });
}
