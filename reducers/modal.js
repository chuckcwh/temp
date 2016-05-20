import * as ActionTypes from '../actions';
import { combineReducers } from 'redux';

const alert = (state = { visible: false }, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_ALERT:
      return {
        visible: true,
        message: action.message
      };
    case ActionTypes.HIDE_MODAL_ALERT:
      return {
        visible: false,
        message: null
      };
    default:
      return state;
  }
}

const confirm = (state = false, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_CONFIRM:
      return true;
    case ActionTypes.HIDE_MODAL_CONFIRM:
      return false;
    default:
      return state;
  }
}

const login = (state = false, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_LOGIN:
      return true;
    case ActionTypes.HIDE_MODAL_LOGIN:
      return false;
    default:
      return state;
  }
}

const daypicker = (state = {
  visible: false,
  value: new Date()
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_DAYPICKER:
      return Object.assign({}, state, {
        visible: true,
        value: action.value
      });
    case ActionTypes.HIDE_MODAL_DAYPICKER:
      return Object.assign({}, state, {
        visible: false,
        value: new Date()
      });
    default:
      return state;
  }
}

const verifyBooking = (state = {
  visible: false,
  bookingId: null
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_VERIFYBOOKING:
      return Object.assign({}, state, {
        visible: true,
        bookingId: action.bookingId
      });
    case ActionTypes.HIDE_MODAL_VERIFYBOOKING:
      return Object.assign({}, state, {
        visible: false
      });
    default:
      return state;
  }
}

const resendVerifyBooking = (state = {
  visible: false,
  bookingId: null,
  hp: undefined,
  error: undefined,
  pending: false
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_RESENDVERIFYBOOKING:
      return Object.assign({}, state, {
        visible: true,
        bookingId: action.bookingId
      });
    case ActionTypes.HIDE_MODAL_RESENDVERIFYBOOKING:
      return Object.assign({}, state, {
        visible: false,
        hp: undefined,
        error: undefined,
        pending: false
      });
    default:
      return state;
  }
}

const modal = combineReducers({
  alert,
  confirm,
  login,
  daypicker,
  verifyBooking,
  resendVerifyBooking
})

export default modal;
