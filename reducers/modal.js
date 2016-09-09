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
        message: ''
      };
    default:
      return state;
  }
}

const confirm = (state = {
  visible: false,
  message: '',
  accept: () => {},
  cancel: () => {}
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_CONFIRM:
      return {
        visible: true,
        message: action.message,
        accept: action.accept,
        cancel: action.cancel
      };
    case ActionTypes.HIDE_MODAL_CONFIRM:
      return {
        visible: false,
        message: '',
        accept: () => {},
        cancel: () => {}
      };
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
  source: '',
  value: new Date()
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_DAYPICKER:
      return {
        ...state,
        visible: true,
        source: action.source,
        value: action.value
      };
    case ActionTypes.HIDE_MODAL_DAYPICKER:
      return {
        ...state,
        visible: false,
        source: '',
        value: new Date()
      };
    default:
      return state;
  }
}

const verifyUser = (state = {
  visible: false,
  userId: ''
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_VERIFYUSER:
      return {
        ...state,
        visible: true,
        userId: action.userId
      };
    case ActionTypes.HIDE_MODAL_VERIFYUSER:
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
}

const resendVerifyUser = (state = {
  visible: false,
  userId: '',
  hp: '',
  error: '',
  pending: false
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_RESENDVERIFYUSER:
      return {
        ...state,
        visible: true,
        userId: action.userId
      };
    case ActionTypes.HIDE_MODAL_RESENDVERIFYUSER:
      return {
        ...state,
        visible: false,
        hp: '',
        error: '',
        pending: false
      };
    default:
      return state;
  }
}

const verifyBooking = (state = {
  visible: false,
  bookingId: ''
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_VERIFYBOOKING:
      return {
        ...state,
        visible: true,
        bookingId: action.bookingId
      };
    case ActionTypes.HIDE_MODAL_VERIFYBOOKING:
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
}

const resendVerifyBooking = (state = {
  visible: false,
  bookingId: '',
  hp: '',
  error: '',
  pending: false
}, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_MODAL_RESENDVERIFYBOOKING:
      return {
        ...state,
        visible: true,
        bookingId: action.bookingId
      };
    case ActionTypes.HIDE_MODAL_RESENDVERIFYBOOKING:
      return {
        ...state,
        visible: false,
        hp: '',
        error: '',
        pending: false
      };
    default:
      return state;
  }
}

const modal = combineReducers({
  alert,
  confirm,
  login,
  daypicker,
  verifyUser,
  resendVerifyUser,
  verifyBooking,
  resendVerifyBooking,
})

export default modal;
