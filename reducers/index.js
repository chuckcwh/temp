import * as ActionTypes from '../actions';
import cookie from 'react-cookie';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import merge from 'lodash/merge';
import user from './user';
import modal from './modal';
import order from './order';
import userData from './user';
import { normalize, normalizeMultiple, appendAllServices, parseCategories } from '../core/util';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

const config = (state = {
  isFetching: false,
  didInvalidate: false,
  data: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.CONFIG_REQUEST:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case ActionTypes.CONFIG_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        data: action.response && action.response.data && {
          ...action.response.data,
          bookingStatusesByValue: normalize(action.response.data.bookingStatuses, 'value'),
          countriesByValue: normalize(action.response.data.countries, 'value'),
          gendersByValue: normalize(action.response.data.genders, 'value'),
          languagesByValue: normalize(action.response.data.languages, 'value'),
          racesByValue: normalize(action.response.data.races, 'value'),
          religionsByValue: normalize(action.response.data.religions, 'value'),
          timeSlotsByValue: normalize(action.response.data.timeSlots, 'value'),
          sessionPhasesByValue: normalize(action.response.data.sessionPhases, 'value'),
          sessionStatusesByValue: normalize(action.response.data.sessionStatuses, 'value'),
        },
        lastUpdated: action.response && action.response.receivedAt
      }
    default:
      return state
  }
}

const services = (state = {
  isFetching: false,
  didInvalidate: false,
  data: {},
  ids: [],
  rankedServices: [],
  categories: {},
  categoriesBySlug: {},
  servicesTree: [],
  servicesTreeHash: {},
  servicesUnderCategory: {},
  servicesUnderSlug: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.CATEGORIES_REQUEST:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case ActionTypes.CATEGORIES_SUCCESS:
      let categories = {}, categoriesBySlug = {}
      action.response && action.response.data.forEach((category) => {
        categories[category._id] = category
        if (category.slug) {
          categoriesBySlug[category.slug] = category
        }
      })
      return {
        ...state,
        categories,
        categoriesBySlug,
      }
    case ActionTypes.SERVICES_SUCCESS:
      let servicesHash = {}, ids = [], rankedServices = [], servicesUnderCategory = {}, servicesUnderSlug = {}
      action.response && action.response.data.forEach((service) => {
        service.classesHash = service.classes.reduce((result, serviceClass) => {
          result[serviceClass._id] = serviceClass;
          return result;
        }, {})
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
      return {
        ...state,
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
      }
    default:
      return state
  }
}

const booking = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.BOOKING_REQUEST:
    case ActionTypes.BOOKING_CREATE_REQUEST:
    case ActionTypes.BOOKING_EDIT_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.BOOKING_SUCCESS:
    case ActionTypes.BOOKING_CREATE_SUCCESS:
    case ActionTypes.BOOKING_EDIT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.BOOKING_DESTROY:
      return {
        ...state,
        isFetching: false,
        data: {},
        lastUpdated: undefined
      }
    default:
      return state
  }
}

const session = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSION_CREATE_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.SESSION_CREATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      }
    default:
      return state
  }
}

const sessions = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
  dataByPatient: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.SESSIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: normalize(action.response && action.response.data),
        dataByPatient: normalizeMultiple(action.response && action.response.data, 'patient'),
        lastUpdated: action.response && action.response.receivedAt
      }
    default:
      return state
  }
}

const sessionsByUser = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_REQUEST:
    case ActionTypes.SESSIONS_SUCCESS:
      return {
        ...state,
        [action.data.client || action.data.provider]:
          sessions(state[action.data.client || action.data.provider], action)
      }
    default:
      return state
  }
}

const suggestedSessions = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_SUGGESTED_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.SESSIONS_SUGGESTED_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: normalize(action.response && action.response.data),
        lastUpdated: action.response && action.response.receivedAt
      }
    default:
      return state
  }
}

const patients = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.PATIENTS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.PATIENTS_SUCCESS:
      let hash = {}
      action.response && action.response.data.forEach((patient) => {
        hash[patient._id] = patient
      })
      return {
        ...state,
        isFetching: false,
        data: hash,
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.PATIENT_SUCCESS:
      if (action.response && action.response.data && action.response.data.id && state.data[action.response.data._id]) {
        return {
          ...state,
          isFetching: false,
          data: {
            ...state.data,
            [action.response.data._id]: action.response.data,
          },
          lastUpdated: action.response && action.response.receivedAt
        }
      }
    case ActionTypes.PATIENT_DELETE_SUCCESS:
      const newState = { ...state };
      action.data && action.data.patientId && delete newState[action.data.patientId];
      return newState;
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return {
        ...state,
        data: normalize(action.response.data && action.response.data.patients)
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
    case ActionTypes.PATIENT_DELETE_SUCCESS:
      return {
        ...state,
        [action.data.userId]: patients(state[action.data.userId], action)
      }
    case ActionTypes.USER_SUCCESS:
    case ActionTypes.USER_TOKEN_SUCCESS:
    case ActionTypes.USER_CREATE_SUCCESS:
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.LOGIN_CLIENT_SUCCESS:
    case ActionTypes.USER_EDIT_SUCCESS:
      return {
        ...state,
        [action.response.data._id]: patients(state[action.response.data._id], action)
      }
    default:
      return state
  }
}

const availableSchedules = (state = {
  isFetching: false,
  didInvalidate: true,
  data: []
}, action) => {
  switch (action.type) {
    case ActionTypes.AVAILABLE_SCHEDULES_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.AVAILABLE_SCHEDULES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      }
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
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.STATS_SESSIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.count,
        lastUpdated: action.response && action.response.receivedAt
      }
    default:
      return state;
  }
}

const rankedServices = (state = {
  isFetching: false,
  didInvalidate: false,
  data: []
}, action) => {
  switch (action.type) {
    case ActionTypes.STATS_SERVICES_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.STATS_SERVICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.services,
        lastUpdated: action.response && action.response.receivedAt
      }
    default:
      return state;
  }
}

const rankedSubcategories = (state = {
  isFetching: false,
  didInvalidate: false,
  data: []
}, action) => {
  switch (action.type) {
    case ActionTypes.STATS_SUBCATEGORIES_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.STATS_SUBCATEGORIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.subCategories,
        lastUpdated: action.response && action.response.receivedAt
      }
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

const inlineForm = (state = {}, action) => {
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
      return {};
    default:
      return state;
  }
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = '', action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return ''
  } else if (error) {
    return action.error
  }

  return state
}

const bookingApp = combineReducers({
  user,
  config,
  services,
  booking,
  session,
  sessionsByUser,
  patientsByClient,
  suggestedSessions,
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
      name: (value, previousValue, allValues) => {
        if (allValues.isPatient) {
          return allValues.userName;
        } else return value;
      },
      contact: (value, previousValue, allValues) => {
        if (allValues.isPatient) {
          return allValues.userContact;
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
          return state;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postal && state.postal.value && action.postal && state.postal.value == action.postal) {
            return {
              ...state,
              description: {
                ...state.description,
                value: action.description
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
          return state;
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
          return state;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postal && state.postal.value && action.postal && state.postal.value == action.postal) {
            return {
              ...state,
              description: {
                ...state.description,
                value: action.description
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
          return state;
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
          return state;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postal && state.postal.value && action.postal && state.postal.value == action.postal) {
            return {
              ...state,
              description: {
                ...state.description,
                value: action.description,
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
          return state;
        default:
          return state;
      }
    },
    patientsFormSecond: (state, action) => {
      switch (action.type) {
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postal && state.postal.value && action.postal && state.postal.value == action.postal) {
            return {
              ...state,
              description: {
                ...state.description,
                value: action.description,
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
          return state;
        default:
          return state;
      }
    },
    creditsTopupForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'creditsTopupForm') {
            return {
              ...state,
              transDate: {
                ...state.transDate,
                value: action.value
              }
            }
          }
          return state;
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
          return state;
        case ActionTypes.GEOCODE_SUCCESS:
          if (state.postal && state.postal.value && action.postal && state.postal.value == action.postal) {
            return {
              ...state,
              description: {
                ...state.description,
                value: action.description
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
          return state;
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
          return state;
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
          return state;
        default:
          return state;
      }
    },
    ProfileEditEmploymentFormSub: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          const { main, sub, name } = action.source;
          if (main === 'ProfileEditEmploymentFormSub') {
            return {
              ...state,
              [sub]: {
                ...state[sub],
                [name]: {
                  ...state[sub][name],
                  value: moment(action.value).format('MM/YYYY')
                }
              }
            }
          }
          return state;
        default:
          return state;
      }
    },
    ProfileEditAchievementFormSub: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          const { main, sub } = action.source;
          if (main === 'ProfileEditAchievementFormSub') {
            return {
              ...state,
              [sub]: {
                ...state[sub],
                dateObtained: {
                  ...state[sub].dateObtained,
                  value: moment(action.value).format('MM/YYYY')
                }
              }
            }
          }
          return state;
        default:
          return state;
      }
    },
    promocodeManageAddForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          const { main, name } = action.source;
          if (main === 'promocodeManageAddForm') {
            return {
              ...state,
              [name]: {
                ...state[name],
                value: action.value,
              }
            }
          }
          return state;
        default:
          return state;
      }
    },
  })
});

export default bookingApp;
