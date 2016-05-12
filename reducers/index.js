import { combineReducers } from 'redux';
import merge from 'lodash/merge';
import order from './order';

const router = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ROUTER':
      return action.router;
    default:
      return state;
  }
}

const allServices = (state = null, action) => {
  switch (action.type) {
    case 'SET_SERVICES':
      var allServicesHash = {};
      action.services.forEach(function(service) {
        allServicesHash[service.id] = service;
      });
      return allServicesHash;
    default:
      return state;
  }
}

const user = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    default:
      return state;
  }
}

const lastPage = (state = '', action) => {
  switch (action.type) {
    case 'SET_LAST_PAGE':
      return action.lastPage;
    default:
      return state;
  }
}

const booking = (state = null, action) => {
  switch (action.type) {
    case 'SET_BOOKING':
      return action.booking;
    default:
      return state;
  }
}

const postStatus = (state = 'confirmation', action) => {
  switch (action.type) {
    case 'SET_POST_STATUS':
      return action.postStatus;
    default:
      return state;
  }
}

// export default function bookingApp(state = {}, action) {
//   return {
//     router: router(state.router, action),
//     allServices: allServices(state.allServices, action),
//     user: user(state.user, action),
//     booking: booking(state.booking, action),
//     postStatus: postStatus(state.postStatus, action),
//     order: order(state.order, action)
//   }
// }

const bookingApp = combineReducers({
  router,
  allServices,
  user,
  lastPage,
  booking,
  postStatus,
  order
});

export default bookingApp;
