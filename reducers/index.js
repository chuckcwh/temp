import * as ActionTypes from '../actions';
import cookie from 'react-cookie';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import merge from 'lodash/merge';
import modal from './modal';
import order from './order';
import util from '../core/util';
import sortBy from 'lodash/sortBy';

const user = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.USER_REQUEST:
    case ActionTypes.USER_TOKEN_REQUEST:
    case ActionTypes.USER_CREATE_REQUEST:
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
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true,
        data: (action.response && action.response.user && action.response.user.type === 'Client') ? action.response.user : null,
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

const config = (state = {
  isFetching: false,
  didInvalidate: false,
  data: null,
}, action) => {
  switch (action.type) {
    case ActionTypes.CONFIG_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.CONFIG_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const allServices = (state = {
  isFetching: false,
  didInvalidate: false,
  data: null,
  ids: null,
  servicesTree: null,
  servicesTreeHash: null,
  subTypesHash: null,
  subTypesHashBySlug: null,
}, action) => {
  switch (action.type) {
    case ActionTypes.SERVICES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.SERVICES_SUCCESS:
      let servicesHash = {}, ids = [], subTypesHash = {}, subTypesHashBySlug = {}
      action.response && action.response.services.forEach((service) => {
        servicesHash[service.id] = service
        ids.push(service.id)
        const subtypeId = parseInt(service['subTypeId'])
        if (subtypeId) {
          if (!subTypesHash[subtypeId]) subTypesHash[subtypeId] = []
          subTypesHash[subtypeId].push(service);
        }
        const subtypeSlug = service['subTypeSlug']
        if (subtypeSlug) {
          if (!subTypesHashBySlug[subtypeSlug]) subTypesHashBySlug[subtypeSlug] = []
          subTypesHashBySlug[subtypeSlug].push(service);
        }
      })
      Object.keys(subTypesHash).map((subTypeKey) => {
        subTypesHash[subTypeKey] = sortBy(subTypesHash[subTypeKey], ['subTypeOrder', 'name'])
      })
      Object.keys(subTypesHashBySlug).map((subTypeKey) => {
        subTypesHashBySlug[subTypeKey] = sortBy(subTypesHashBySlug[subTypeKey], ['subTypeOrder', 'name'])
      })
      const servicesTree = util.appendAllServices(util.parseCategories(servicesHash))
      const serviceTreeHash = servicesTree.reduce((result, category) => {
        result[category.name] = category;
        return result;
      }, {});
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: servicesHash,
        ids: ids,
        servicesTree: servicesTree,
        servicesTreeHash: serviceTreeHash,
        subTypesHash: subTypesHash,
        subTypesHashBySlug: subTypesHashBySlug,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const languages = (state = {
  isFetching: false,
  didInvalidate: false,
  data: null,
  ids: null
}, action) => {
  switch (action.type) {
    case ActionTypes.LANGUAGES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.LANGUAGES_SUCCESS:
      let hash = {}, ids = []
      action.response && action.response.languages.forEach((language) => {
        hash[language.id] = language
        ids.push(language.id)
      })
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: hash,
        ids: ids,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const booking = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.BOOKING_REQUEST:
    case ActionTypes.BOOKING_CREATE_REQUEST:
    case ActionTypes.BOOKING_EDIT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.BOOKING_SUCCESS:
    case ActionTypes.BOOKING_CREATE_SUCCESS:
    case ActionTypes.BOOKING_EDIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.booking,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.BOOKING_DESTROY:
      return Object.assign({}, state, {
        isFetching: false,
        data: null,
        lastUpdated: undefined
      })
    default:
      return state
  }
}

const caze = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.CASE_CREATE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.CASE_CREATE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.case,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const cazes = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null,
  ids: null
}, action) => {
  switch (action.type) {
    case ActionTypes.CASES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.CASES_SUCCESS:
      let hash = {}, ids = []
      action.response && action.response.cases.forEach((caze) => {
        hash[caze.id] = caze
        ids.push(caze.id)
      })
      return Object.assign({}, state, {
        isFetching: false,
        data: hash,
        ids: ids,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const cazesByClient = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.CASES_REQUEST:
    case ActionTypes.CASES_SUCCESS:
      return Object.assign({}, state, {
        [action.data.cid]: cazes(state[action.data.cid], action)
      })
    default:
      return state
  }
}

const cazesAvailToNurse = (state ={}, action) => {
  switch (action.type) {
    case ActionTypes.CASES_REQUEST:
    case ActionTypes.CASES_SUCCESS:
      return Object.assign({}, state, {
        [action.data.nid]: cazes(state[action.data.nid], action)
      })
    default:
      return state
  }
}

const patients = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null,
  ids: null
}, action) => {
  switch (action.type) {
    case ActionTypes.PATIENTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.PATIENTS_SUCCESS:
      let hash = {}, ids = []
      action.response && action.response.patients.forEach((patient) => {
        hash[patient.id] = patient
        ids.push(patient.id)
      })
      return Object.assign({}, state, {
        isFetching: false,
        data: hash,
        ids: ids,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.PATIENT_SUCCESS:
      if (action.response && action.response.patient && action.response.patient.id && state.data[action.response.patient.id]) {
        let newState = Object.assign({}, state)
        newState.data[action.response.patient.id] = action.response.patient
        return newState
      }
    default:
      return state
  }
}

const patientsByClient = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.PATIENTS_REQUEST:
    case ActionTypes.PATIENTS_SUCCESS:
    case ActionTypes.PATIENT_SUCCESS:
      return Object.assign({}, state, {
        [action.data.cid]: patients(state[action.data.cid], action)
      })
    default:
      return state
  }
}

const sessions = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.SESSIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.timeSlots,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

// const paypal = (state = {
//   isFetching: false,
//   didInvalidate: true,
//   data: null
// }, action) => {
//   switch (action.type) {
//     case ActionTypes.TRANSACTION_PAYPAL_CREATE_REQUEST:
//     case ActionTypes.TRANSACTION_PAYPAL_EXECUTE_REQUEST:
//       return Object.assign({}, state, {
//         isFetching: true
//       })
//     case ActionTypes.TRANSACTION_PAYPAL_CREATE_SUCCESS:
//       return Object.assign({}, state, {
//         isFetching: false,
//         data: {
//           url: action.response && action.response.url,
//           paymentId: action.response && action.response.payment_id
//         },
//         lastUpdated: action.response && action.response.receivedAt
//       })
//     case ActionTypes.TRANSACTION_PAYPAL_EXECUTE_SUCCESS:
//       return Object.assign({}, state, {
//         isFetching: false,
//         data: {
//           items: action.response && action.response.items,
//           ppid: action.response && action.response.ppid
//         },
//         lastUpdated: action.response && action.response.receivedAt
//       })
//     default:
//       return state;
//   }
// }

const totalSessionsCount = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.STATS_SESSIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.STATS_SESSIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.count,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state;
  }
}

const rankedServices = (state = {
  isFetching: false,
  didInvalidate: false,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.STATS_SERVICES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.STATS_SERVICES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.services,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state;
  }
}

const rankedSubcategories = (state = {
  isFetching: false,
  didInvalidate: false,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.STATS_SUBCATEGORIES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.STATS_SUBCATEGORIES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.subCategories,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state;
  }
}

const lastPage = (state = '', action) => {
  switch (action.type) {
    case ActionTypes.SET_LAST_PAGE:
      return action.lastPage;
    default:
      return state;
  }
}

const postStatus = (state = 'confirmation', action) => {
  switch (action.type) {
    case ActionTypes.SET_POST_STATUS:
      return action.postStatus;
    default:
      return state;
  }
}

const inlineForm = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_INLINE_FORM:
      return {
        name: action.name,
        inputs: action.inputs,
        ok: action.ok,
        cancel: action.cancel,
        validate: action.validate
      }
    case ActionTypes.HIDE_INLINE_FORM:
      return null;
    default:
      return state;
  }
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

const bookingApp = combineReducers({
  user,
  config,
  allServices,
  languages,
  booking,
  caze,
  cazesByClient,
  cazesAvailToNurse,
  patientsByClient,
  sessions,
  // paypal,
  totalSessionsCount,
  rankedServices,
  rankedSubcategories,
  lastPage,
  postStatus,
  order,
  modal,
  inlineForm,
  errorMessage,
  form: form.normalize({
    bookingLocationForm: {
      patient_firstName: (value, previousValue, allValues) => {
        if (allValues.isPatient) {
          return allValues.client_firstName;
        } else return value;
      },
      patient_lastName: (value, previousValue, allValues) => {
        if (allValues.isPatient) {
          return allValues.client_lastName;
        } else return value;
      }
    },
    bookingLocationUserPatientForm: {
      fullName: (value, previousValue, allValues) => {
        if (allValues.isPatient) {
          return allValues.userName;
        } else return value;
      }
    }
  }).plugin({
    bookingLocationForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'bookingLocationForm') {
            return {
              ...state,
              patient_dob: {
                ...state.patient_dob,
                value: action.value
              }
            }
          }
          break;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postalCode && state.postalCode.value && action.postalCode && state.postalCode.value == action.postalCode) {
            return {
              ...state,
              address: {
                ...state.address,
                value: action.address
              }
            }
          }
          break;
        default:
          return state;
      }
    },
    bookingLocationUserPatientForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'bookingLocationUserPatientForm') {
            return {
              ...state,
              dob: {
                ...state.dob,
                value: action.value
              }
            }
          }
          break;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postalCode && state.postalCode.value && action.postalCode && state.postalCode.value == action.postalCode) {
            return {
              ...state,
              address: {
                ...state.address,
                value: action.address
              }
            }
          }
          break;
        default:
          return state;
      }
    },
    patientsForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'patientsForm') {
            return {
              ...state,
              dob: {
                ...state.dob,
                value: action.value
              }
            }
          }
          break;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postalCode && state.postalCode.value && action.postalCode && state.postalCode.value == action.postalCode) {
            return {
              ...state,
              address: {
                ...state.address,
                value: action.address,
              },
              region: {
                ...state.region,
                value: action.region,
              },
            }
          }
          break;
        default:
          return state;
      }
    },
    inlineForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'inlineForm') {
            return {
              ...state,
              dob: {
                ...state.dob,
                value: action.value
              }
            }
          }
          break;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postalCode && state.postalCode.value && action.postalCode && state.postalCode.value == action.postalCode) {
            return {
              ...state,
              address: {
                ...state.address,
                value: action.address
              }
            }
          }
          break;
        default:
          return state;
      }
    },
    profileClientEditBasicForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'profileClientEditBasicForm') {
            return {
              ...state,
              dob: {
                ...state.dob,
                value: action.value
              }
            }
          }
          break;
        default:
          return state;
      }
    },
  })
});

export default bookingApp;
