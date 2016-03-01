var AppDispatcher = require('../dispatcher/AppDispatcher');
var BookingConstants = require('../constants/BookingConstants');

var BookingActions = {

  /**
   * @param  {string} services The services
   */
  setServices: function(services) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.QUERY_SET_SERVICES,
      services: services
    });
  },

  /**
   * @param  {string} service The ID of the Service
   */
  setService: function(service) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.QUERY_SET_SERVICE,
      service: service
    });
  },

  /**
   * @param  {string} location The location
   */
  setLocation: function(location) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.QUERY_SET_LOCATION,
      location: location
    });
  },

  /**
   * @param  {string} dates { dateStart, dateEnd }
   */
  setDates: function(dates) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.QUERY_SET_DATES,
      dateStart: dates.dateStart,
      dateEnd: dates.dateEnd
    });
  },

  /**
   * @param  {string} timings Array of 'Morning', 'Afternoon' or 'Evening'
   */
  setTimings: function(timings) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.QUERY_SET_TIMINGS,
      preferredTimes: timings
    });
  },

  /**
   * @param  {string} timings Array of 'Morning', 'Afternoon' or 'Evening'
   */
  setUser: function(user) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.QUERY_SET_USER,
      user: user
    });
  },

  /**
   * @param  {string} timings Array of 'Morning', 'Afternoon' or 'Evening'
   */
  setPatient: function(patient) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.QUERY_SET_PATIENT,
      patient: patient
    });
  },

  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.TODO_CREATE,
      text: text
    });
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */
  updateText: function(id, text) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.TODO_UPDATE_TEXT,
      id: id,
      text: text
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */
  toggleComplete: function(todo) {
    var id = todo.id;
    var actionType = todo.complete ?
        BookingConstants.TODO_UNDO_COMPLETE :
        BookingConstants.TODO_COMPLETE;

    AppDispatcher.dispatch({
      actionType: actionType,
      id: id
    });
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function() {
    AppDispatcher.dispatch({
      actionType: BookingConstants.TODO_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: BookingConstants.TODO_DESTROY,
      id: id
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function() {
    AppDispatcher.dispatch({
      actionType: BookingConstants.TODO_DESTROY_COMPLETED
    });
  }

};

module.exports = BookingActions;
