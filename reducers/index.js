import * as ActionTypes from '../actions';
import { combineReducers } from 'redux';
import merge from 'lodash/merge';
import modal from './modal';
import order from './order';

const router = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SET_ROUTER:
      return action.router;
    default:
      return state;
  }
}

const allServices = (state = {
  isFetching: false,
  didInvalidate: false,
  items: null,
  ids: null
}, action) => {
  switch (action.type) {
    case ActionTypes.SERVICES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.SERVICES_SUCCESS:
      let hash = {}, ids = []
      action.response && action.response.services.forEach((service) => {
        hash[service.id] = service
        ids.push(service.id)
      })
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: hash,
        ids: ids,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const booking = (state = {
  isFetching: false,
  didInvalidate: true,
  items: null
}, action) => {
  switch (action.type) {
    case ActionTypes.BOOKING_REQUEST:
    case ActionTypes.BOOKING_CREATE_REQUEST:
    case ActionTypes.BOOKING_EDIT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.BOOKING_SUCCESS:
    case ActionTypes.BOOKING_CREATE_SUCCESS:
    case ActionTypes.BOOKING_EDIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.response && action.response.booking,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.BOOKING_DESTROY:
      return Object.assign({}, state, {
        isFetching: false,
        items: null,
        lastUpdated: undefined
      })
    default:
      return state
  }
}

const caze = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.CASE_CREATE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.CASE_CREATE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.case,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const user = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.USER_REQUEST:
    case ActionTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.response && action.response.user,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.USER_DESTROY:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true,
        data: null,
        lastUpdated: undefined
      })
    default:
      return state
  }
}

const patients = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null,
  ids: null
}, action) => {
  switch (action.type) {
    case ActionTypes.PATIENTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.PATIENTS_SUCCESS:
      let hash = {}, ids = []
      action.response && action.response.patients.forEach((patient) => {
        hash[patient.id] = patient
        ids.push(patient.id)
      })
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: hash,
        ids: ids,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const sessions = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.SESSIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.response.timeSlots,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

// const paypal = (state = {
//   isFetching: false,
//   didInvalidate: true,
//   data: null
// }, action) => {
//   switch (action.type) {
//     case ActionTypes.TRANSACTION_PAYPAL_CREATE_REQUEST:
//     case ActionTypes.TRANSACTION_PAYPAL_EXECUTE_REQUEST:
//       return Object.assign({}, state, {
//         isFetching: true
//       })
//     case ActionTypes.TRANSACTION_PAYPAL_CREATE_SUCCESS:
//       return Object.assign({}, state, {
//         isFetching: false,
//         data: {
//           url: action.response && action.response.url,
//           paymentId: action.response && action.response.payment_id
//         },
//         lastUpdated: action.response && action.response.receivedAt
//       })
//     case ActionTypes.TRANSACTION_PAYPAL_EXECUTE_SUCCESS:
//       return Object.assign({}, state, {
//         isFetching: false,
//         data: {
//           items: action.response && action.response.items,
//           ppid: action.response && action.response.ppid
//         },
//         lastUpdated: action.response && action.response.receivedAt
//       })
//     default:
//       return state;
//   }
// }

const totalSessionsCount = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.STATS_SESSIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.STATS_SESSIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.count,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state;
  }
}

const lastPage = (state = '', action) => {
  switch (action.type) {
    case ActionTypes.SET_LAST_PAGE:
      return action.lastPage;
    default:
      return state;
  }
}

const postStatus = (state = 'confirmation', action) => {
  switch (action.type) {
    case ActionTypes.SET_POST_STATUS:
      return action.postStatus;
    default:
      return state;
  }
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

const bookingApp = combineReducers({
  router,
  allServices,
  booking,
  caze,
  user,
  patients,
  sessions,
  // paypal,
  totalSessionsCount,
  lastPage,
  postStatus,
  order,
  modal,
  errorMessage
});

export default bookingApp;
