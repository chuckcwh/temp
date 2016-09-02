import * as ActionTypes from '../actions';
import cookie from 'react-cookie';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import merge from 'lodash/merge';
import modal from './modal';
import order from './order';
import { appendAllServices, parseCategories, isClient } from '../core/util';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

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
    case ActionTypes.USER_EDUCATION_EDIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receiveAt
      })
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
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
        data: action.response && Object.assign({}, action.response.data, {
          timeSlotsByValues: action.response.data.timeSlots.reduce((result, timeSlot) => {
            result[timeSlot.value] = timeSlot;
            return result;
          }, {}),
        }),
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const services = (state = {
  isFetching: false,
  didInvalidate: false,
  data: null,
  ids: null,
  rankedServices: null,
  categories: null,
  categoriesBySlug: null,
  servicesTree: null,
  servicesTreeHash: null,
  servicesUnderCategory: null,
  servicesUnderSlug: null,
}, action) => {
  switch (action.type) {
    case ActionTypes.CATEGORIES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case ActionTypes.CATEGORIES_SUCCESS:
      let categories = {}, categoriesBySlug = {}
      action.response && action.response.data.forEach((category) => {
        categories[category._id] = category
        if (category.slug) {
          categoriesBySlug[category.slug] = category
        }
      })
      return Object.assign({}, state, {
        categories,
        categoriesBySlug,
      })
    case ActionTypes.SERVICES_SUCCESS:
      let servicesHash = {}, ids = [], rankedServices = [], servicesUnderCategory = {}, servicesUnderSlug = {}
      action.response && action.response.data.forEach((service) => {
        servicesHash[service._id] = service
        ids.push(service._id)
        service.categories.forEach(categoryId => {
          if (!servicesUnderCategory[categoryId]) servicesUnderCategory[categoryId] = []
          servicesUnderCategory[categoryId].push(service);
        })
        const serviceCategorySlug = state.categories[service.parentCategory].slug;
        if (serviceCategorySlug) {
          if (!servicesUnderSlug[serviceCategorySlug]) servicesUnderSlug[serviceCategorySlug] = []
          servicesUnderSlug[serviceCategorySlug].push(service);
        }
      })
      rankedServices = action.response && action.response.data.sort((a, b) => b.popularity - a.popularity);
      Object.keys(servicesUnderCategory).map((categoryId) => {
        servicesUnderCategory[categoryId] = sortBy(servicesUnderCategory[categoryId], ['order', 'name'])
      })
      Object.keys(servicesUnderSlug).map((slug) => {
        servicesUnderSlug[slug] = sortBy(servicesUnderSlug[slug], ['order', 'name'])
      })
      // const servicesTree = appendAllServices(parseCategories(servicesHash))
      // const serviceTreeHash = servicesTree.reduce((result, category) => {
      //   result[category.name] = category;
      //   return result;
      // }, {});
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: servicesHash,
        ids,
        rankedServices,
        // servicesTree: servicesTree,
        // servicesTreeHash: serviceTreeHash,
        servicesUnderCategory,
        servicesUnderSlug,
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
        data: action.response && action.response.data,
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

const session = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSION_CREATE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.SESSION_CREATE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      })
    default:
      return state
  }
}

const sessions = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null,
  ids: null
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.SESSIONS_SUCCESS:
      let hash = {}, ids = []
      action.response && action.response.data.forEach((session) => {
        hash[session.id] = session
        ids.push(session.id)
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

const sessionsByClient = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_REQUEST:
    case ActionTypes.SESSIONS_SUCCESS:
      return Object.assign({}, state, {
        [action.data.client]: sessions(state[action.data.client], action)
      })
    default:
      return state
  }
}

const sessionsAvailToNurse = (state ={}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_REQUEST:
    case ActionTypes.SESSIONS_SUCCESS:
      return Object.assign({}, state, {
        [action.data.provider]: sessions(state[action.data.provider], action)
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
      action.response && action.response.data.forEach((patient) => {
        hash[patient._id] = patient
        ids.push(patient._id)
      })
      return Object.assign({}, state, {
        isFetching: false,
        data: hash,
        ids: ids,
        lastUpdated: action.response && action.response.receivedAt
      })
    case ActionTypes.PATIENT_SUCCESS:
      if (action.response && action.response.data && action.response.data.id && state.data[action.response.data.id]) {
        let newState = Object.assign({}, state)
        newState.data[action.response.data.id] = action.response.data
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
        [action.data.userId]: patients(state[action.data.userId], action)
      })
    default:
      return state
  }
}

const availableSchedules = (state = {
  isFetching: false,
  didInvalidate: true,
  data: null
}, action) => {
  switch (action.type) {
    case ActionTypes.AVAILABLE_SCHEDULES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.AVAILABLE_SCHEDULES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.data,
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
  services,
  languages,
  booking,
  session,
  sessionsByClient,
  sessionsAvailToNurse,
  patientsByClient,
  availableSchedules,
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
      patientName: (value, previousValue, allValues) => {
        if (allValues.isPatient) {
          return allValues.clientName;
        } else return value;
      },
      patientContact: (value, previousValue, allValues) => {
        if (allValues.isPatient) {
          return allValues.clientContact;
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
              patientDob: {
                ...state.patientDob,
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
              },
              lat: {
                ...state.lat,
                value: action.lat
              },
              lng: {
                ...state.lng,
                value: action.lng
              },
              region: {
                ...state.region,
                value: action.region
              },
              neighborhood: {
                ...state.neighborhood,
                value: action.neighborhood
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
              },
              lat: {
                ...state.lat,
                value: action.lat
              },
              lng: {
                ...state.lng,
                value: action.lng
              },
              region: {
                ...state.region,
                value: action.region
              },
              neighborhood: {
                ...state.neighborhood,
                value: action.neighborhood
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
              lat: {
                ...state.lat,
                value: action.lat
              },
              lng: {
                ...state.lng,
                value: action.lng
              },
              region: {
                ...state.region,
                value: action.region
              },
              neighborhood: {
                ...state.neighborhood,
                value: action.neighborhood
              }
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
              },
              lat: {
                ...state.lat,
                value: action.lat
              },
              lng: {
                ...state.lng,
                value: action.lng
              },
              region: {
                ...state.region,
                value: action.region
              },
              neighborhood: {
                ...state.neighborhood,
                value: action.neighborhood
              }
            }
          }
          break;
        default:
          return state;
      }
    },
    profileEditBasicForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'profileEditBasicForm') {
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
    ProfileEditEducationFormSub: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          const { main, sub } = action.source;
          if (main === 'ProfileEditEducationFormSub') {
            return {
              ...state,
              [sub]: {
                ...state[sub],
                gradDate: {
                  ...state[sub].gradDate,
                  value: moment(action.value).format('MM/YYYY')
                }
              }
            }
          }
          break;
        default:
          return state;
      }
    }
  })
});

export default bookingApp;
