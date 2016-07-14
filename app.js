import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import Location from './core/Location';
import Layout from './components/Layout';
import { setRouter } from './actions';
import api from './middleware/api';
import configureStore from './store/configureStore'

const store = configureStore();

const routes = {}; // Auto-generated on build. See tools/lib/routes-loader.js

const route = async (location, callback) => {
  const path = location.pathname;
  const handler = (path && path.indexOf('/booking') > -1) ? routes['/booking'] : (routes[path] || routes['/404']);
  const component = await handler();
  await callback(<Provider store={store}><Layout location={location} path={path}>{React.createElement(component, { location: location, path: path })}</Layout></Provider>);
};

function run() {
  const container = document.getElementById('app');
  Location.listen(location => {
    store.dispatch(setRouter({ location }));
    route(location, async (component) => ReactDOM.render(component, container, () => {
      // Scroll to the top
      window.scrollTo(0, 0);

      // Track the page view event via Google Analytics
      window.ga('send', 'pageview');
    }));
  });
}

if (canUseDOM) {
  // Run the application when both DOM is ready and page content is loaded
  if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run, false);
  }
}

export default { route, routes };
