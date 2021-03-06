import cookie from 'react-cookie';
import * as ActionTypes from '../actions';
import { combineReducers } from 'redux';
import { normalize, isClient, removeByKey } from '../core/util';

const devices = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return { ...state, ...normalize(action.response.data && action.response.data.devices) };
    case ActionTypes.USER_DEVICES_SUCCESS:
      return { ...state, ...normalize(action.response.data) };
    case ActionTypes.USER_DEVICE_SUCCESS:
    case ActionTypes.USER_DEVICE_CREATE_SUCCESS:
    case ActionTypes.USER_DEVICE_EDIT_SUCCESS:
      return { ...state, [action.response.data._id]: action.response.data };
    default:
      return state;
  }
}

const experiences = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return { ...state, ...normalize(action.response.data && action.response.data.experiences) };
    case ActionTypes.USER_EXPERIENCES_SUCCESS:
      return { ...state, ...normalize(action.response.data) };
    case ActionTypes.USER_EXPERIENCE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_CREATE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_EDIT_SUCCESS:
      return { ...state, [action.response.data._id]: action.response.data };
    case ActionTypes.USER_EXPERIENCE_DELETE_SUCCESS:
      return removeByKey(state, action.response.data._id);
    default:
      return state;
  }
}

const educations = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return { ...state, ...normalize(action.response.data && action.response.data.educations) };
    case ActionTypes.USER_EDUCATIONS_SUCCESS:
      return { ...state, ...normalize(action.response.data) };
    case ActionTypes.USER_EDUCATION_SUCCESS:
    case ActionTypes.USER_EDUCATION_CREATE_SUCCESS:
    case ActionTypes.USER_EDUCATION_EDIT_SUCCESS:
      return { ...state, [action.response.data._id]: action.response.data };
    case ActionTypes.USER_EDUCATION_DELETE_SUCCESS:
      return removeByKey(state, action.response.data._id);
    default:
      return state;
  }
}

const achievements = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return { ...state, ...normalize(action.response.data && action.response.data.achievements) };
    case ActionTypes.USER_ACHIEVEMENTS_SUCCESS:
      return { ...state, ...normalize(action.response.data) };
    case ActionTypes.USER_ACHIEVEMENT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_CREATE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_EDIT_SUCCESS:
      return { ...state, [action.response.data._id]: action.response.data };
    case ActionTypes.USER_ACHIEVEMENT_DELETE_SUCCESS:
      return removeByKey(state, action.response.data._id);
    default:
      return state;
  }
}

const reviews = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return { ...state, ...normalize(action.response.data && action.response.data.reviews) };
    case ActionTypes.USER_REVIEWS_SUCCESS:
      return { ...state, ...normalize(action.response.data) };
    case ActionTypes.USER_REVIEW_SUCCESS:
    case ActionTypes.USER_REVIEW_CREATE_SUCCESS:
    case ActionTypes.USER_REVIEW_EDIT_SUCCESS:
      return { ...state, [action.response.data._id]: action.response.data };
    default:
      return state;
  }
}

const schedules = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return { ...normalize(action.response.data && action.response.data.schedules) };
    case ActionTypes.USER_SCHEDULES_SUCCESS:
    case ActionTypes.USER_SCHEDULES_UPDATE_SUCCESS:
      return { ...normalize(action.response.data) };
    case ActionTypes.USER_SCHEDULE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_CREATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_EDIT_SUCCESS:
      return { ...state, [action.response.data._id]: action.response.data };
    default:
      return state;
  }
}

const schedulesByDateSlot = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return {
        ...(action.response.data && action.response.data.schedules.reduce((result, schedule) => {
          const date = schedule.dateTimeStart.substr(0, 10);
          if (!result[date]) result[date] = {};
          result[date][schedule.timeSlot] = schedule;
          return result;
        }, {}))
      };
    case ActionTypes.USER_SCHEDULES_SUCCESS:
    case ActionTypes.USER_SCHEDULES_UPDATE_SUCCESS:
      return {
        ...(action.response.data.reduce((result, schedule) => {
          const date = schedule.dateTimeStart.substr(0, 10);
          if (!result[date]) result[date] = {};
          result[date][schedule.timeSlot] = schedule;
          return result;
        }, {}))
      };
    case ActionTypes.USER_SCHEDULE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_CREATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_EDIT_SUCCESS:
      return {
        ...state,
        [action.response.data.dateTimeStart.substr(0, 10)]:
          state[action.response.data.dateTimeStart.substr(0, 10)] ?
          {
            ...state[action.response.data.dateTimeStart.substr(0, 10)],
            [action.response.data.timeSlot]: action.response.data,
          } :
          {
            [action.response.data.timeSlot]: action.response.data,
          },
      };
    default:
      return state;
  }
}

const partialUserData = combineReducers({
  devices,
  experiences,
  educations,
  achievements,
  reviews,
  schedules,
  schedulesByDateSlot,
})

const extendedUserData = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.USER_DEVICES_SUCCESS:
    case ActionTypes.USER_DEVICE_SUCCESS:
    case ActionTypes.USER_DEVICE_CREATE_SUCCESS:
    case ActionTypes.USER_DEVICE_EDIT_SUCCESS:
    case ActionTypes.USER_EXPERIENCES_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_CREATE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_EDIT_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_DELETE_SUCCESS:
    case ActionTypes.USER_EDUCATIONS_SUCCESS:
    case ActionTypes.USER_EDUCATION_SUCCESS:
    case ActionTypes.USER_EDUCATION_CREATE_SUCCESS:
    case ActionTypes.USER_EDUCATION_EDIT_SUCCESS:
    case ActionTypes.USER_EDUCATION_DELETE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENTS_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_CREATE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_EDIT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_DELETE_SUCCESS:
    case ActionTypes.USER_REVIEWS_SUCCESS:
    case ActionTypes.USER_REVIEW_SUCCESS:
    case ActionTypes.USER_REVIEW_CREATE_SUCCESS:
    case ActionTypes.USER_REVIEW_EDIT_SUCCESS:
    case ActionTypes.USER_SCHEDULES_SUCCESS:
    case ActionTypes.USER_SCHEDULES_UPDATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_CREATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_EDIT_SUCCESS:
      return { ...state, ...partialUserData(state, action) };
    default:
      return state;
  }
}

const fullUserData = (state = {}, action) => {
  switch(action.type) {
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return { ...state, ...action.response.data, ...partialUserData(state, action) };
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
      return {
        ...state,
        ...(isClient(action.response.data) ? action.response.data : {}),
        ...(isClient(action.response.data) ? partialUserData(state, action) : {})
      };
    default:
      return state;
  }
}

const user = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {
    devices,
    experiences,
    educations,
    achievements,
    reviews,
    schedules
  }
}, action) => {
  switch (action.type) {
    case ActionTypes.USER_REQUEST:
    case ActionTypes.USER_TOKEN_REQUEST:
    case ActionTypes.USER_CREATE_REQUEST:
    case ActionTypes.USER_EDIT_REQUEST:
    case ActionTypes.LOGIN_REQUEST:
    case ActionTypes.LOGIN_CLIENT_REQUEST:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
      if (action.response && action.response.data && action.response.data._id && action.response.token) {
        cookie.save('user_id', action.response.data._id, { path: '/' });
        cookie.save('user_token', action.response.token, { path: '/' });
      }
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        data: fullUserData(state.data, action),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
      if (action.response && action.response.data && action.response.data._id && action.response.token) {
        cookie.save('user_id', action.response.data._id, { path: '/' });
        cookie.save('user_token', action.response.token, { path: '/' });
      }
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        data: fullUserData(state.data, action),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.USER_EDIT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        data: fullUserData(state.data, action),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.USER_DEVICES_SUCCESS:
    case ActionTypes.USER_DEVICE_SUCCESS:
    case ActionTypes.USER_DEVICE_CREATE_SUCCESS:
    case ActionTypes.USER_DEVICE_EDIT_SUCCESS:
    case ActionTypes.USER_EXPERIENCES_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_CREATE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_EDIT_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_DELETE_SUCCESS:
    case ActionTypes.USER_EDUCATIONS_SUCCESS:
    case ActionTypes.USER_EDUCATION_SUCCESS:
    case ActionTypes.USER_EDUCATION_CREATE_SUCCESS:
    case ActionTypes.USER_EDUCATION_EDIT_SUCCESS:
    case ActionTypes.USER_EDUCATION_DELETE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENTS_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_CREATE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_EDIT_SUCCESS:
    case ActionTypes.USER_REVIEWS_SUCCESS:
    case ActionTypes.USER_REVIEW_SUCCESS:
    case ActionTypes.USER_REVIEW_CREATE_SUCCESS:
    case ActionTypes.USER_REVIEW_EDIT_SUCCESS:
    case ActionTypes.USER_SCHEDULES_SUCCESS:
    case ActionTypes.USER_SCHEDULES_UPDATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_CREATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_EDIT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        data: extendedUserData(state.data, action),
        lastUpdated: action.response && action.response.receiveAt
      }
    case ActionTypes.USER_TOKEN_FAILURE:
      cookie.remove('user_id', { path: '/' });
      cookie.remove('user_token', { path: '/' });
      return state
    case ActionTypes.USER_DESTROY:
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        data: {
          devices,
          experiences,
          educations,
          achievements,
          reviews,
          schedules
        },
        lastUpdated: undefined
      }
    default:
      return state
  }
}

export default user;
