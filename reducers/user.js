import * as ActionTypes from '../actions';
import { combineReducers } from 'redux';

const devices = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_DEVICES_EDIT_SUCCESS:
      return Object.assign({}, state, action.response.data);
    default:
      return state;
  }
}

const experiences = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_EXPERIENCES_EDIT_SUCCESS:
      return Object.assign({}, state, action.response.data);
    default:
      return state;
  }
}

const educations = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_EDUCATIONS_EDIT_SUCCESS:
      return Object.assign({}, state, action.response.data);
    default:
      return state;
  }
}

const achievements = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_ACHIEVEMENTS_EDIT_SUCCESS:
      return Object.assign({}, state, action.response.data);
    default:
      return state;
  }
}

const reviews = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_REVIEWS_EDIT_SUCCESS:
      return Object.assign({}, state, action.response.data);
    default:
      return state;
  }
}

const schedules = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_SCHEDULES_EDIT_SUCCESS:
      return action.booker;
    default:
      return state;
  }
}
const user = combineReducers({
  devices,
  experiences,
  educations,
  achievements,
  reviews,
  schedules
})

const extendedUser = (state, action) => ({
  ...state,
  ...user(state, action),
})

export default extendedUser;
