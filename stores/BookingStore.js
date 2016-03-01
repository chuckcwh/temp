var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var BookingConstants = require('../constants/BookingConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};
var _services = [];
var _servicesHash = {};
var _query = {};
var _booking = {};

/**
 * Create a BOOKING item.
 * @param  {string} text The content of the BOOKING
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * Update a BOOKING item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}

/**
 * Update all of the BOOKING items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _todos) {
    update(id, updates);
  }
}

/**
 * Delete a BOOKING item.
 * @param  {string} id
 */
function destroy(id) {
  delete _todos[id];
}

/**
 * Delete all the completed BOOKING items.
 */
function destroyCompleted() {
  for (var id in _todos) {
    if (_todos[id].complete) {
      destroy(id);
    }
  }
}

var BookingStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the state.
   * @return {object}
   */
  getState: function() {
    return {
      allServices: _services,
      allServicesHash: _servicesHash,
      query: _query
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
   * Get the query.
   * @return {object}
   */
  getQuery: function() {
    return _query;
  },

  /**
   * Tests whether all the remaining BOOKING items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of BOOKINGs.
   * @return {object}
   */
  getAll: function() {
    return _todos;
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
    case BookingConstants.QUERY_SET_SERVICES:
      _services = action.services;
      BookingStore.emitChange();
      _services.forEach(function(service) {
        _servicesHash[service.id] = service;
      });
      break;

    case BookingConstants.QUERY_SET_SERVICE:
      _query.service = action.service;
      BookingStore.emitChange();
      break;

    case BookingConstants.QUERY_SET_LOCATION:
      _query.location = action.location;
      BookingStore.emitChange();
      break;

    case BookingConstants.QUERY_SET_DATES:
      _query.dateStart = action.dateStart;
      _query.dateEnd = action.dateEnd;
      BookingStore.emitChange();
      break;

    case BookingConstants.QUERY_SET_TIMINGS:
      _query.preferredTimes = action.preferredTimes;
      BookingStore.emitChange();
      break;

    case BookingConstants.QUERY_SET_USER:
      _booking.user = action.user;
      BookingStore.emitChange();
      break;

    case BookingConstants.QUERY_SET_PATIENT:
      _booking.patient = action.patient;
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
        BookingStore.emitChange();
      }
      break;

    case BookingConstants.BOOKING_TOGGLE_COMPLETE_ALL:
      if (BookingStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_UNDO_COMPLETE:
      update(action.id, {complete: false});
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_COMPLETE:
      update(action.id, {complete: true});
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        BookingStore.emitChange();
      }
      break;

    case BookingConstants.BOOKING_DESTROY:
      destroy(action.id);
      BookingStore.emitChange();
      break;

    case BookingConstants.BOOKING_DESTROY_COMPLETED:
      destroyCompleted();
      BookingStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = BookingStore;
