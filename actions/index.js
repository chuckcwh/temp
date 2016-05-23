import { CALL_API } from '../middleware/api'

export const SERVICES_REQUEST = 'SERVICES_REQUEST'
export const SERVICES_SUCCESS = 'SERVICES_SUCCESS'
export const SERVICES_FAILURE = 'SERVICES_FAILURE'

export const BOOKING_REQUEST = 'BOOKING_REQUEST'
export const BOOKING_SUCCESS = 'BOOKING_SUCCESS'
export const BOOKING_FAILURE = 'BOOKING_FAILURE'
export const BOOKING_DESTROY = 'BOOKING_DESTROY'

export const BOOKING_CREATE_REQUEST = 'BOOKING_CREATE_REQUEST'
export const BOOKING_CREATE_SUCCESS = 'BOOKING_CREATE_SUCCESS'
export const BOOKING_CREATE_FAILURE = 'BOOKING_CREATE_FAILURE'

export const BOOKING_EDIT_REQUEST = 'BOOKING_EDIT_REQUEST'
export const BOOKING_EDIT_SUCCESS = 'BOOKING_EDIT_SUCCESS'
export const BOOKING_EDIT_FAILURE = 'BOOKING_EDIT_FAILURE'

export const CASE_CREATE_REQUEST = 'CASE_CREATE_REQUEST'
export const CASE_CREATE_SUCCESS = 'CASE_CREATE_SUCCESS'
export const CASE_CREATE_FAILURE = 'CASE_CREATE_FAILURE'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'
export const USER_DESTROY = 'USER_DESTROY'

export const PATIENTS_REQUEST = 'PATIENTS_REQUEST'
export const PATIENTS_SUCCESS = 'PATIENTS_SUCCESS'
export const PATIENTS_FAILURE = 'PATIENTS_FAILURE'

export const PATIENT_CREATE_REQUEST = 'PATIENT_CREATE_REQUEST'
export const PATIENT_CREATE_SUCCESS = 'PATIENT_CREATE_SUCCESS'
export const PATIENT_CREATE_FAILURE = 'PATIENT_CREATE_FAILURE'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const SESSIONS_REQUEST = 'SESSIONS_REQUEST'
export const SESSIONS_SUCCESS = 'SESSIONS_SUCCESS'
export const SESSIONS_FAILURE = 'SESSIONS_FAILURE'

export const PROMO_REQUEST = 'PROMO_REQUEST'
export const PROMO_SUCCESS = 'PROMO_SUCCESS'
export const PROMO_FAILURE = 'PROMO_FAILURE'

export const TRANSACTION_PAYPAL_CREATE_REQUEST = 'TRANSACTION_PAYPAL_CREATE_REQUEST'
export const TRANSACTION_PAYPAL_CREATE_SUCCESS = 'TRANSACTION_PAYPAL_CREATE_SUCCESS'
export const TRANSACTION_PAYPAL_CREATE_FAILURE = 'TRANSACTION_PAYPAL_CREATE_FAILURE'

export const TRANSACTION_PAYPAL_EXECUTE_REQUEST = 'TRANSACTION_PAYPAL_EXECUTE_REQUEST'
export const TRANSACTION_PAYPAL_EXECUTE_SUCCESS = 'TRANSACTION_PAYPAL_EXECUTE_SUCCESS'
export const TRANSACTION_PAYPAL_EXECUTE_FAILURE = 'TRANSACTION_PAYPAL_EXECUTE_FAILURE'

export const TRANSACTION_BANK_CREATE_REQUEST = 'TRANSACTION_BANK_CREATE_REQUEST'
export const TRANSACTION_BANK_CREATE_SUCCESS = 'TRANSACTION_BANK_CREATE_SUCCESS'
export const TRANSACTION_BANK_CREATE_FAILURE = 'TRANSACTION_BANK_CREATE_FAILURE'

export const VERIFY_BOOKING_PIN_REQUEST = 'VERIFY_BOOKING_PIN_REQUEST'
export const VERIFY_BOOKING_PIN_SUCCESS = 'VERIFY_BOOKING_PIN_SUCCESS'
export const VERIFY_BOOKING_PIN_FAILURE = 'VERIFY_BOOKING_PIN_FAILURE'

export const RESEND_VERIFY_BOOKING_PIN_REQUEST = 'RESEND_VERIFY_BOOKING_PIN_REQUEST'
export const RESEND_VERIFY_BOOKING_PIN_SUCCESS = 'RESEND_VERIFY_BOOKING_PIN_SUCCESS'
export const RESEND_VERIFY_BOOKING_PIN_FAILURE = 'RESEND_VERIFY_BOOKING_PIN_FAILURE'

export const STATS_SESSIONS_REQUEST = 'STATS_SESSIONS_REQUEST'
export const STATS_SESSIONS_SUCCESS = 'STATS_SESSIONS_SUCCESS'
export const STATS_SESSIONS_FAILURE = 'STATS_SESSIONS_FAILURE'

function fetchAction(route) {
  return {
    getServices: {
      types: [ SERVICES_REQUEST, SERVICES_SUCCESS, SERVICES_FAILURE ],
      endpoint: 'getServices',
      method: 'get',
      auth: 'app'
    },
    getBooking: {
      types: [ BOOKING_REQUEST, BOOKING_SUCCESS, BOOKING_FAILURE ],
      endpoint: 'getBooking',
      method: 'get',
      auth: 'app'
    },
    createBooking: {
      types: [ BOOKING_CREATE_REQUEST, BOOKING_CREATE_SUCCESS, BOOKING_CREATE_FAILURE ],
      endpoint: 'createBooking',
      method: 'post',
      auth: 'app'
    },
    editBooking: {
      types: [ BOOKING_EDIT_REQUEST, BOOKING_EDIT_SUCCESS, BOOKING_EDIT_FAILURE ],
      endpoint: 'editBooking',
      method: 'post',
      auth: 'app'
    },
    createCase: {
      types: [ CASE_CREATE_REQUEST, CASE_CREATE_SUCCESS, CASE_CREATE_FAILURE ],
      endpoint: 'createCase',
      method: 'post',
      auth: 'user'
    },
    login: {
      types: [ LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE ],
      endpoint: 'mlogin',
      method: 'post',
      auth: 'app'
    },
    getUser: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: 'getUser',
      method: 'get',
      auth: 'user'
    },
    getPatients: {
      types: [ PATIENTS_REQUEST, PATIENTS_SUCCESS, PATIENTS_FAILURE ],
      endpoint: 'getPatients',
      method: 'get',
      auth: 'user'
    },
    createPatient: {
      types: [ PATIENT_CREATE_REQUEST, PATIENT_CREATE_SUCCESS, PATIENT_CREATE_FAILURE ],
      endpoint: 'createPatient',
      method: 'post',
      auth: 'user'
    },
    getSessions: {
      types: [ SESSIONS_REQUEST, SESSIONS_SUCCESS, SESSIONS_FAILURE ],
      endpoint: 'getAvailableSchedule',
      method: 'get',
      auth: 'app'
    },
    getPromo: {
      types: [ PROMO_REQUEST, PROMO_SUCCESS, PROMO_FAILURE ],
      endpoint: 'checkPromocode',
      method: 'get',
      auth: 'app'
    },
    createPaypalTransaction: {
      types: [ TRANSACTION_PAYPAL_CREATE_REQUEST, TRANSACTION_PAYPAL_CREATE_SUCCESS, TRANSACTION_PAYPAL_CREATE_FAILURE ],
      endpoint: 'makePaypalWebPayment',
      method: 'post',
      auth: 'app'
    },
    executePaypalTransaction: {
      types: [ TRANSACTION_PAYPAL_EXECUTE_REQUEST, TRANSACTION_PAYPAL_EXECUTE_SUCCESS, TRANSACTION_PAYPAL_EXECUTE_FAILURE ],
      endpoint: 'verifyPaypalTransaction',
      method: 'post',
      auth: 'app'
    },
    createBankTransferTransaction: {
      types: [ TRANSACTION_BANK_CREATE_REQUEST, TRANSACTION_BANK_CREATE_SUCCESS, TRANSACTION_BANK_CREATE_FAILURE ],
      endpoint: 'verifyBankTransaction',
      method: 'post',
      auth: 'app'
    },
    verifyBookingPin: {
      types: [ VERIFY_BOOKING_PIN_REQUEST, VERIFY_BOOKING_PIN_SUCCESS, VERIFY_BOOKING_PIN_FAILURE ],
      endpoint: 'verifyBookingPin',
      method: 'post',
      auth: 'app'
    },
    resendVerifyBookingPin: {
      types: [ RESEND_VERIFY_BOOKING_PIN_REQUEST, RESEND_VERIFY_BOOKING_PIN_SUCCESS, RESEND_VERIFY_BOOKING_PIN_FAILURE ],
      endpoint: 'resendBookingPin',
      method: 'post',
      auth: 'app'
    },
    getTotalSessionsCount: {
      types: [ STATS_SESSIONS_REQUEST, STATS_SESSIONS_SUCCESS, STATS_SESSIONS_FAILURE ],
      endpoint: 'getTotalSessionsCount',
      method: 'get',
      auth: 'app'
    }
  }[route]
}

function shouldFetch(state, entity) {
  const obj = state[entity]
  if (!obj || !(obj.items)) {
    return true
  }
  if (obj.isFetching) {
    return false
  }
  return obj.didInvalidate
}

function fetch(route, data) {
  return (dispatch, getState) => {
    if (shouldFetch(getState(), route)) {
      if (data) {
        return dispatch({
          data,
          [CALL_API]: fetchAction(route)
        })
      } else {
        return dispatch({
          [CALL_API]: fetchAction(route)
        })
      }
    }
  }
}

export function fetchServices() {
  return fetch('getServices');
}

export function getBooking(params) {
  return fetch('getBooking', params);
}

export function createBooking(params) {
  return fetch('createBooking', params);
}

export function editBooking(params) {
  return fetch('editBooking', params);
}

export function createCase(params) {
  return fetch('createCase', params);
}

export function login(params) {
  return fetch('login', params);
}

export function getUser() {
  return fetch('getUser');
}

export function destroyUser() {
  return {
    type: USER_DESTROY
  }
}

export function getPatients(params) {
  return fetch('getPatients', params);
}

export function createPatient(params) {
  return fetch('createPatient', params);
}

export function getSessions(params) {
  return fetch('getSessions', params);
}

export function getPromo(params) {
  return fetch('getPromo', params);
}

export function createPaypalTransaction(params) {
  return fetch('createPaypalTransaction', params);
}

export function executePaypalTransaction(params) {
  return fetch('executePaypalTransaction', params);
}

export function createBankTransferTransaction(params) {
  return fetch('createBankTransferTransaction', params);
}

export function verifyBookingPin(params) {
  return fetch('verifyBookingPin', params);
}

export function resendVerifyBookingPin(params) {
  return fetch('resendVerifyBookingPin', params);
}

export function getTotalSessionsCount() {
  return fetch('getTotalSessionsCount')
}

export function clearBooking() {
  return { type: BOOKING_DESTROY }
}

export const SET_ROUTER = 'SET_ROUTER'

export const setRouter = (router) => {
  return { type: SET_ROUTER, router }
}

export const SET_LAST_PAGE = 'SET_LAST_PAGE'

export const setLastPage = (lastPage) => {
  return { type: SET_LAST_PAGE, lastPage }
}

export const SET_POST_STATUS = 'SET_POST_STATUS'

export const setPostStatus = (postStatus) => {
  return { type: SET_POST_STATUS, postStatus }
}

export const ORDER_SET_SERVICE = 'ORDER_SET_SERVICE'

export const setOrderService = (service) => {
  return { type: ORDER_SET_SERVICE, service }
}

export const ORDER_SET_LOCATION = 'ORDER_SET_LOCATION'

export const setOrderLocation = (location) => {
  return { type: ORDER_SET_LOCATION, location }
}

export const ORDER_SET_DATES = 'ORDER_SET_DATES'

export const setOrderDates = (dates) => {
  return { type: ORDER_SET_DATES, dates }
}

export const ORDER_SET_TIMESLOTS = 'ORDER_SET_TIMESLOTS'

export const setOrderTimeslots = (timeslots) => {
  return { type: ORDER_SET_TIMESLOTS, timeslots }
}

export const ORDER_SET_SESSIONS = 'ORDER_SET_SESSIONS'

export const setOrderSessions = (sessions) => {
  return { type: ORDER_SET_SESSIONS, sessions }
}

export const ORDER_SET_SUM = 'ORDER_SET_SUM'

export const setOrderSum = (sum) => {
  return { type: ORDER_SET_SUM, sum }
}

export const ORDER_SET_PROMO = 'ORDER_SET_PROMO'

export const setOrderPromoCode = (promoCode) => {
  return { type: ORDER_SET_PROMO, promoCode }
}

export const ORDER_SET_BOOKER = 'ORDER_SET_BOOKER'

export const setOrderBooker = (booker) => {
  return { type: ORDER_SET_BOOKER, booker }
}

export const ORDER_SET_PATIENT = 'ORDER_SET_PATIENT'

export const setOrderPatient = (patient) => {
  return { type: ORDER_SET_PATIENT, patient }
}

export const ORDER_DESTROY = 'ORDER_DESTROY'

export const destroyOrder = () => {
  return { type: ORDER_DESTROY }
}

export const SHOW_MODAL_ALERT = 'SHOW_MODAL_ALERT'
export const HIDE_MODAL_ALERT = 'HIDE_MODAL_ALERT'
export const SHOW_MODAL_CONFIRM = 'SHOW_MODAL_CONFIRM'
export const HIDE_MODAL_CONFIRM = 'HIDE_MODAL_CONFIRM'
export const SHOW_MODAL_LOGIN = 'SHOW_MODAL_LOGIN'
export const HIDE_MODAL_LOGIN = 'HIDE_MODAL_LOGIN'
export const SHOW_MODAL_DAYPICKER = 'SHOW_MODAL_DAYPICKER'
export const HIDE_MODAL_DAYPICKER = 'HIDE_MODAL_DAYPICKER'
export const SHOW_MODAL_VERIFYBOOKING = 'SHOW_MODAL_VERIFYBOOKING'
export const HIDE_MODAL_VERIFYBOOKING = 'HIDE_MODAL_VERIFYBOOKING'
export const SHOW_MODAL_RESENDVERIFYBOOKING = 'SHOW_MODAL_RESENDVERIFYBOOKING'
export const HIDE_MODAL_RESENDVERIFYBOOKING = 'HIDE_MODAL_RESENDVERIFYBOOKING'

export function showAlertPopup(message) {
  return {
    type: SHOW_MODAL_ALERT,
    message: message
  }
}

export function hideAlertPopup() {
  return {
    type: HIDE_MODAL_ALERT
  }
}

export function showConfirmPopup(message) {
  return {
    type: SHOW_MODAL_CONFIRM
  }
}

export function hideConfirmPopup() {
  return {
    type: HIDE_MODAL_CONFIRM
  }
}

export function showLoginPopup() {
  return {
    type: SHOW_MODAL_LOGIN
  }
}

export function hideLoginPopup() {
  return {
    type: HIDE_MODAL_LOGIN
  }
}

export function showDayPickerPopup(value) {
  return {
    type: SHOW_MODAL_DAYPICKER,
    value: value
  }
}

export function hideDayPickerPopup() {
  return {
    type: HIDE_MODAL_DAYPICKER
  }
}

export function showVerifyBookingPopup(bookingId) {
  return {
    type: SHOW_MODAL_VERIFYBOOKING,
    bookingId: bookingId
  }
}

export function hideVerifyBookingPopup() {
  return {
    type: HIDE_MODAL_VERIFYBOOKING
  }
}

export function showResendVerifyBookingPopup(bookingId) {
  return {
    type: SHOW_MODAL_RESENDVERIFYBOOKING,
    bookingId: bookingId
  }
}

export function hideResendVerifyBookingPopup() {
  return {
    type: HIDE_MODAL_RESENDVERIFYBOOKING
  }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  }
}