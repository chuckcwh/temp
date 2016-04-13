var AppDispatcher = require('../dispatcher/AppDispatcher');
var BookingConstants = require('../constants/BookingConstants');

var BookingActions = {

  /**
   * @param  {string} services The services
   */
  setServices: function(services) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_SERVICES,
      services: services
    });
  },

  /**
   * @param  {string} service The ID of the Service
   */
  setService: function(service) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_SERVICE,
      service: service
    });
  },

  /**
   * @param  {string} location The location
   */
  setLocation: function(location) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_LOCATION,
      location: location
    });
  },

  /**
   * @param  {string} dates List of date objects
   */
  setDates: function(dates) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_DATES,
      dates: dates
    });
  },

  /**
   * @param  {string} timings Array of 'Morning', 'Afternoon' or 'Evening'
   */
  setTimeslots: function(timeslots) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_TIMESLOTS,
      timeslots: timeslots
    });
  },

  /**
   * @param  {string} sessions The booked sessions
   */
  setSessions: function(sessions) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_SESSIONS,
      sessions: sessions
    });
  },

  /**
   * @param  {string} sum The total sum
   */
  setSum: function(sum) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_SUM,
      sum: sum
    });
  },

  /**
   * @param  {string} booker The booker object containing contact and patient details
   */
  setBooker: function(booker) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_BOOKER,
      booker: booker
    });
  },

  /**
   * @param  {string} booking The completed booking
   */
  setBooking: function(booking) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_BOOKING,
      booking: booking
    });
  },

  /**
   * @param  {string} user The logged-in user
   */
  setUser: function(user) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_USER,
      user: user
    });
  },

  /**
   * @param  {string} patient The patient
   */
  setPatient: function(patient) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_PATIENT,
      patient: patient
    });
  },

  /**
   * @param  {string} last The last page
   */
  setLast: function(last) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_LAST,
      last: last
    });
  },

  /**
   * Destroy booking
   */
  destroyBooking: function() {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_DESTROY
    });
  },

  /**
   * @param  {string} last The last page
   */
  setPostStatus: function(postStatus) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.BOOKING_SET_POST_STATUS,
      postStatus: postStatus
    });
  }

};

module.exports = BookingActions;
