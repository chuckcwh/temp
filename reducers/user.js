import cookie from 'react-cookie';
import * as ActionTypes from '../actions';
import { combineReducers } from 'redux';
import { isClient } from '../core/util';

const devices = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_DEVICES_SUCCESS:
      return Object.assign({}, state, action.response.data.reduce((result, elem) => {
        result[elem._id] = elem;
        return result;
      }, {}));
    case ActionTypes.USER_DEVICE_SUCCESS:
    case ActionTypes.USER_DEVICE_CREATE_SUCCESS:
    case ActionTypes.USER_DEVICE_EDIT_SUCCESS:
      return Object.assign({}, state,
        { [action.response.data._id]: action.response.data }
      );
    default:
      return state;
  }
}

const experiences = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_EXPERIENCES_SUCCESS:
      return Object.assign({}, state, action.response.data.reduce((result, elem) => {
        result[elem._id] = elem;
        return result;
      }, {}));
    case ActionTypes.USER_EXPERIENCE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_CREATE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_EDIT_SUCCESS:
      return Object.assign({}, state,
        { [action.response.data._id]: action.response.data }
      );
    default:
      return state;
  }
}

const educations = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_EDUCATIONS_SUCCESS:
      return Object.assign({}, state, action.response.data.reduce((result, elem) => {
        result[elem._id] = elem;
        return result;
      }, {}));
    case ActionTypes.USER_EDUCATION_SUCCESS:
    case ActionTypes.USER_EDUCATION_CREATE_SUCCESS:
    case ActionTypes.USER_EDUCATION_EDIT_SUCCESS:
      return Object.assign({}, state,
        { [action.response.data._id]: action.response.data }
      );
    default:
      return state;
  }
}

const achievements = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_ACHIEVEMENTS_SUCCESS:
      return Object.assign({}, state, action.response.data.reduce((result, elem) => {
        result[elem._id] = elem;
        return result;
      }, {}));
    case ActionTypes.USER_ACHIEVEMENT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_CREATE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_EDIT_SUCCESS:
      return Object.assign({}, state,
        { [action.response.data._id]: action.response.data }
      );
    default:
      return state;
  }
}

const reviews = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_REVIEWS_SUCCESS:
      return Object.assign({}, state, action.response.data.reduce((result, elem) => {
        result[elem._id] = elem;
        return result;
      }, {}));
    case ActionTypes.USER_REVIEW_SUCCESS:
    case ActionTypes.USER_REVIEW_CREATE_SUCCESS:
    case ActionTypes.USER_REVIEW_EDIT_SUCCESS:
      return Object.assign({}, state,
        { [action.response.data._id]: action.response.data }
      );
    default:
      return state;
  }
}

const schedules = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.USER_SCHEDULES_SUCCESS:
      return Object.assign({}, state, action.response.data.reduce((result, elem) => {
        result[elem._id] = elem;
        return result;
      }, {}));
    case ActionTypes.USER_SCHEDULE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_CREATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_EDIT_SUCCESS:
      return Object.assign({}, state,
        { [action.response.data._id]: action.response.data }
      );
    default:
      return state;
  }
}
const userData = combineReducers({
  devices,
  experiences,
  educations,
  achievements,
  reviews,
  schedules
})

const extendedUserData = (state, action) => {
  switch (action.type) {
    case ActionTypes.USER_DEVICES_SUCCESS:
    case ActionTypes.USER_DEVICE_SUCCESS:
    case ActionTypes.USER_DEVICE_CREATE_SUCCESS:
    case ActionTypes.USER_DEVICE_EDIT_SUCCESS:
    case ActionTypes.USER_EXPERIENCES_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_CREATE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_EDIT_SUCCESS:
    case ActionTypes.USER_EDUCATIONS_SUCCESS:
    case ActionTypes.USER_EDUCATION_SUCCESS:
    case ActionTypes.USER_EDUCATION_CREATE_SUCCESS:
    case ActionTypes.USER_EDUCATION_EDIT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENTS_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_CREATE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_EDIT_SUCCESS:
    case ActionTypes.USER_REVIEWS_SUCCESS:
    case ActionTypes.USER_REVIEW_SUCCESS:
    case ActionTypes.USER_REVIEW_CREATE_SUCCESS:
    case ActionTypes.USER_REVIEW_EDIT_SUCCESS:
    case ActionTypes.USER_SCHEDULES_SUCCESS:
    case ActionTypes.USER_SCHEDULE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_CREATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_EDIT_SUCCESS:
      return Object.assign({}, state, userData(state, action));
    default:
      return state;
  }
}

const user = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.USER_REQUEST:
    case ActionTypes.USER_TOKEN_REQUEST:
    case ActionTypes.USER_CREATE_REQUEST:
    case ActionTypes.USER_EDIT_REQUEST:
    case ActionTypes.USER_EDUCATION_EDIT_REQUEST:
    case ActionTypes.LOGIN_REQUEST:
    case ActionTypes.LOGIN_CLIENT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
      if (action.response && action.response.data && action.response.data._id && action.response.token) {
        cookie.save('user_id', action.response.data._id, { path: '/' });
        cookie.save('user_token', action.response.token, { path: '/' });
      }
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.USER_EDIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.USER_DEVICES_SUCCESS:
    case ActionTypes.USER_DEVICE_SUCCESS:
    case ActionTypes.USER_DEVICE_CREATE_SUCCESS:
    case ActionTypes.USER_DEVICE_EDIT_SUCCESS:
    case ActionTypes.USER_EXPERIENCES_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_CREATE_SUCCESS:
    case ActionTypes.USER_EXPERIENCE_EDIT_SUCCESS:
    case ActionTypes.USER_EDUCATIONS_SUCCESS:
    case ActionTypes.USER_EDUCATION_SUCCESS:
    case ActionTypes.USER_EDUCATION_CREATE_SUCCESS:
    case ActionTypes.USER_EDUCATION_EDIT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENTS_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_CREATE_SUCCESS:
    case ActionTypes.USER_ACHIEVEMENT_EDIT_SUCCESS:
    case ActionTypes.USER_REVIEWS_SUCCESS:
    case ActionTypes.USER_REVIEW_SUCCESS:
    case ActionTypes.USER_REVIEW_CREATE_SUCCESS:
    case ActionTypes.USER_REVIEW_EDIT_SUCCESS:
    case ActionTypes.USER_SCHEDULES_SUCCESS:
    case ActionTypes.USER_SCHEDULE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_CREATE_SUCCESS:
    case ActionTypes.USER_SCHEDULE_EDIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: extendedUserData(state, action),
        lastUpdated: action.response && action.response.receiveAt
      })
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
      if (action.response && action.response.data && action.response.data._id && action.response.token) {
        cookie.save('user_id', action.response.data._id, { path: '/' });
        cookie.save('user_token', action.response.token, { path: '/' });
      }
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true,
        data: (action.response && action.response.data && isClient(action.response.data)) ? action.response.data : null,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.USER_TOKEN_FAILURE:
      cookie.remove('user_id', { path: '/' });
      cookie.remove('user_token', { path: '/' });
      return state
    case ActionTypes.USER_DESTROY:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true,
        data: null,
        lastUpdated: undefined
      })
    default:
      return state
  }
}

export default user;
