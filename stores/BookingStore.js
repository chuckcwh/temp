var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var BookingConstants = require('../constants/BookingConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _user;
var _patient;
var _services;
var _servicesHash;
var _booking = {};
var _case = {};
var _last = '';
var _postStatus = 'confirmation';

var orders = [
  '',
  'booking1',
  'booking2',
  'booking3a',
  'booking3b',
  'booking3c',
  'booking-confirmation',
  'booking-payment'
];

var BookingStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the state.
   * @return {object}
   */
  getState: function() {
    return {
      allServices: _services,
      allServicesHash: _servicesHash,
      booking: _booking,
      postStatus: _postStatus,
      user: _user,
      case: _case,
      patient: _patient
    };
  },

  /**
   * Get the services.
   * @return {object}
   */
  getServices: function() {
    return _services;
  },

  /**
   * Get the services hash.
   * @return {object}
   */
  getServicesHash: function() {
    return _servicesHash;
  },

  /**
   * Get the booking.
   * @return {object}
   */
  getBooking: function() {
    return _booking;
  },

  /**
   * Get the last booking page.
   * @return {string}
   */
  getLastBookingPage: function() {
    return _last;
  },

  /**
   * Get whether navigation is allowed.
   * @return {object}
   */
  isNavigationAllowed: function(path) {
    if (path.charAt(0) === '/') {
      path = path.substring(1);
    }
    return (orders.indexOf(_last) + 1) >= orders.indexOf(path);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case BookingConstants.BOOKING_SET_SERVICES:
      _services = action.services;
      BookingStore.emitChange();
      _servicesHash = {};
      _services.forEach(function(service) {
        _servicesHash[service.id] = service;
      });
      break;

    case BookingConstants.BOOKING_SET_SERVICE:
      _booking.service = action.service;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_LOCATION:
      _booking.location = action.location;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_DATES:
      _booking.dates = action.dates;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_TIMESLOTS:
      _booking.timeslots = action.timeslots;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_BOOKER:
      _booking.booker = action.booker;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_SESSIONS:
      _booking.sessions = action.sessions;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_SUM:
      _booking.sum = action.sum;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_PROMO:
      _booking.promoCode = action.promoCode;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_BOOKING:
      _booking = action.booking;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_USER:
      _user = action.user;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_PATIENT:
      _patient = action.patient;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_LAST:
      _last = action.last;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_DESTROY:
      _booking = {};
      _case = {};
      _last = '';
      _patient = null;
      _postStatus = 'confirmation'
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_SET_POST_STATUS:
      _postStatus = action.postStatus;
      BookingStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = BookingStore;
