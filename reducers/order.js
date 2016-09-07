import * as ActionTypes from '../actions';
import { combineReducers } from 'redux';

const service = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_SERVICE:
      return action.service;
    default:
      return state;
  }
}

const serviceClass = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_SERVICE_CLASS:
      return action.serviceClass;
    default:
      return state;
  }
}

const location = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_LOCATION:
      return action.location;
    default:
      return state;
  }
}

const dates = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_DATES:
      return action.dates;
    default:
      return state;
  }
}

const timeslots = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_TIMESLOTS:
      return action.timeslots;
    default:
      return state;
  }
}

const booker = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_BOOKER:
      return action.booker;
    default:
      return state;
  }
}

const sessions = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_SESSIONS:
      return action.sessions;
    default:
      return state;
  }
}

const sum = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_SUM:
      return action.sum;
    default:
      return state;
  }
}

const promoCode = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_PROMO:
      return action.promoCode;
    default:
      return state;
  }
}

const patient = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_SET_PATIENT:
      return action.patient;
    default:
      return state;
  }
}

const order = combineReducers({
  service,
  serviceClass,
  location,
  dates,
  timeslots,
  booker,
  sessions,
  sum,
  promoCode,
  patient
})

const destroyableOrder = (state, action) => {
  switch (action.type) {
    case ActionTypes.ORDER_DESTROY:
      return order(undefined, { type: undefined });
    default:
      return order(state, action);
  }
}

export default destroyableOrder;
