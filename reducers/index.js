import * as ActionTypes from '../actions';
import cookie from 'react-cookie';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import merge from 'lodash/merge';
import user from './user';
import modal from './modal';
import order from './order';
import userData from './user';
import { normalize, normalizeMultiple, removeByKey, appendAllServices, parseCategories } from '../core/util';
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
          applicationStatusesByValue: normalize(action.response.data.applicationStatuses, 'value'),
          bookingStatusesByValue: normalize(action.response.data.bookingStatuses, 'value'),
          countriesByValue: normalize(action.response.data.countries, 'value'),
          gendersByValue: normalize(action.response.data.genders, 'value'),
          languagesByValue: normalize(action.response.data.languages, 'value'),
          neighborhoodsByValue: normalize(action.response.data.neighborhoods, 'value'),
          racesByValue: normalize(action.response.data.races, 'value'),
          religionsByValue: normalize(action.response.data.religions, 'value'),
          timeSlotsByValue: normalize(action.response.data.timeSlots, 'value'),
          sessionStatusesByValue: normalize(action.response.data.sessionStatuses, 'value'),
          transactionModesByValue: normalize(action.response.data.transactionModes, 'value'),
          transactionStatusesByValue: normalize(action.response.data.transactionStatuses, 'value'),
          transactionTypesByValue: normalize(action.response.data.transactionTypes, 'value'),
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
        service.classes = service.classes.reduce((result, serviceClass) => {
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

const promos = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
  dataByCode: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.PROMOS_REQUEST:
    case ActionTypes.PROMO_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.PROMOS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.extend
          ? {
            ...state.data,
            ...normalize(action.response && action.response.data),
          }
          : normalize(action.response && action.response.data),
        dataByCode: action.extend
          ? {
            ...state.data,
            ...normalize(action.response && action.response.data),
          }
          : normalize(action.response && action.response.data, 'code'),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.PROMO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          [action.response.data._id]: action.response.data,
        },
        dataByCode: {
          ...state.data,
          [action.response.data.code]: action.response.data,
        },
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.PROMO_DELETE_SUCCESS:
      return {
        ...state,
        data: removeByKey(state.data, action.data.promoId),
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
    case ActionTypes.LOGIN_BOOKING_REQUEST:
    case ActionTypes.BOOKING_CREATE_REQUEST:
    case ActionTypes.BOOKING_REQUEST:
    case ActionTypes.BOOKING_CREATE_REQUEST:
    case ActionTypes.BOOKING_EDIT_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.LOGIN_BOOKING_SUCCESS:
    case ActionTypes.BOOKING_CREATE_SUCCESS:
      if (action.response && action.response.data && action.response.data._id && action.response.data.isAdhoc && action.response.token) {
        cookie.save('booking_id', action.response.data._id, { path: '/' });
        cookie.save('booking_token', action.response.token, { path: '/' });
      }
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.BOOKING_SUCCESS:
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

const bookings = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
  dataByPatient: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.BOOKINGS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.BOOKINGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.extend
          ? {
            ...state.data,
            ...normalize(action.response && action.response.data),
          }
          : normalize(action.response && action.response.data),
        // dataByPatient: action.extend
        //   ? {
        //     ...state.data,
        //     ...normalizeMultiple(action.response && action.response.data, 'patient'),
        //   }
        //   : normalizeMultiple(action.response && action.response.data, 'patient'),
        lastUpdated: action.response && action.response.receivedAt
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
    case ActionTypes.SESSION_REQUEST:
    case ActionTypes.SESSION_CREATE_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.SESSION_SUCCESS:
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
    case ActionTypes.SESSIONS_SUGGESTED_REQUEST:
    case ActionTypes.BOOKING_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.SESSIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.extend
          ? {
            ...state.data,
            ...normalize(action.response && action.response.data),
          }
          : normalize(action.response && action.response.data),
        dataByPatient: action.extend
          ? {
            ...state.data,
            ...normalizeMultiple(action.response && action.response.data, 'patient'),
          }
          : normalizeMultiple(action.response && action.response.data, 'patient'),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.SESSIONS_SUGGESTED_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: normalize(action.response && action.response.data),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.SESSION_CANCEL_SUCCESS:
    case ActionTypes.SESSION_VISIT_SUCCESS:
    case ActionTypes.SESSION_SUGGESTED_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          [action.data.sessionId]: action.response && action.response.data
        },
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.APPLICATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          ...normalize(action.response && action.response.data && action.response.data.map(application => application.session)),
        },
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.APPLICATION_CREATE_SUCCESS:
    case ActionTypes.APPLICATION_EDIT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          [action.data.session]: action.response && action.response.data && action.response.data.session,
        },
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.BOOKING_SUCCESS:
    case ActionTypes.LOGIN_BOOKING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: normalize(action.response && action.response.data && action.response.data.sessions),
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
        [action.data.client]:
          sessions(state[action.data.client], action)
      }
    case ActionTypes.APPLICATIONS_SUCCESS:
    case ActionTypes.APPLICATION_CREATE_SUCCESS:
    case ActionTypes.APPLICATION_EDIT_SUCCESS:
      return {
        ...state,
        [action.data.provider]:
          sessions(state[action.data.provider], action)
      }
    default:
      return state
  }
}

const sessionsSuggestedToProvider = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SESSIONS_SUGGESTED_REQUEST:
    case ActionTypes.SESSIONS_SUGGESTED_SUCCESS:
      return {
        ...state,
        [action.data.providerId]:
          sessions(state[action.data.providerId], action)
      }
    default:
      return state
  }
}

const documentation =  (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.SESSION_DOCUMENTATION_GET_REQUEST:
    case ActionTypes.SESSION_DOCUMENTATION_CREATE_REQUEST:
    case ActionTypes.SESSION_DOCUMENTATION_EDIT_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.SESSION_DOCUMENTATION_GET_SUCCESS:
    case ActionTypes.SESSION_DOCUMENTATION_CREATE_SUCCESS:
    case ActionTypes.SESSION_DOCUMENTATION_EDIT_SUCCESS:
      const docData = action.response.data;
      return {
        ...state,
        isFetching: false,
        data: docData ? {
          ...docData,
          bateForms: docData.bateForms.length ? normalize(docData.bateForms) : {}}
          : {bateForms: {}},
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.UPDATE_DOC_FORMS:
      return {
        ...state,
        data: action.formData,
      }
    default:
      return state
  }
}

const applications = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.APPLICATIONS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.APPLICATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: normalize(action.response && action.response.data),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.APPLICATION_SUCCESS:
    case ActionTypes.APPLICATION_CREATE_SUCCESS:
    case ActionTypes.APPLICATION_EDIT_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.response.data._id]: action.response && action.response.data
        }
      }
    default:
      return state
  }
}

const applicationsByProvider = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.APPLICATIONS_REQUEST:
    case ActionTypes.APPLICATIONS_SUCCESS:
    case ActionTypes.APPLICATION_SUCCESS:
    case ActionTypes.APPLICATION_CREATE_SUCCESS:
    case ActionTypes.APPLICATION_EDIT_SUCCESS:
      return {
        ...state,
        [action.data.provider]:
          applications(state[action.data.provider], action)
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
    case ActionTypes.PATIENT_EDIT_SUCCESS:
      if (action.response && action.response.data && action.response.data._id && state.data[action.response.data._id]) {
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
      return {
        ...state,
        data: removeByKey(state.data, action.data.patientId),
        lastUpdated: action.response && action.response.receivedAt
      };
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
    case ActionTypes.PATIENT_EDIT_SUCCESS:
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

const users = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.USERS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.extend
          ? {
            ...state.data,
            ...normalize(action.response && action.response.data),
          }
          : normalize(action.response && action.response.data),
        total: action.response.total,
        lastUpdated: action.response && action.response.receivedAt
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

const transactions = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.TRANSACTIONS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.extend
          ? {
            ...state.data,
            ...normalize(action.response && action.response.data),
          }
          : normalize(action.response && action.response.data),
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.SESSIONS_PAY_PAYPAL_EXECUTE_SUCCESS:
      return state
    default:
      return state
  }
}

const transactionsByUser = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.TRANSACTIONS_REQUEST:
    case ActionTypes.TRANSACTIONS_SUCCESS:
      return {
        ...state,
        [action.data.user]:
          transactions(state[action.data.user], action)
      }
    default:
      return state
  }
}

const transaction = (state = {
  isFetching: false,
  didInvalidate: true,
  data: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.TRANSACTION_REQUEST:
    case ActionTypes.TRANSACTION_CREATE_REQUEST:
    case ActionTypes.TRANSACTION_EDIT_REQUEST:
    case ActionTypes.SESSIONS_PAY_PAYPAL_EXECUTE_REQUEST:
    case ActionTypes.SESSIONS_PAY_BANK_REQUEST:
    case ActionTypes.SESSIONS_PAY_CARD_REQUEST:
    case ActionTypes.SESSIONS_PAY_CREDITS_REQUEST:
    case ActionTypes.USER_CREDITS_TOPUP_PAYPAL_EXECUTE_REQUEST:
    case ActionTypes.USER_CREDITS_TOPUP_BANK_REQUEST:
    case ActionTypes.USER_CREDITS_TOPUP_CARD_REQUEST:
    case ActionTypes.USER_CREDITS_TOPUP_CREDITS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.TRANSACTION_SUCCESS:
    case ActionTypes.TRANSACTION_CREATE_SUCCESS:
    case ActionTypes.TRANSACTION_EDIT_SUCCESS:
    case ActionTypes.SESSIONS_PAY_PAYPAL_EXECUTE_SUCCESS:
    case ActionTypes.SESSIONS_PAY_BANK_SUCCESS:
    case ActionTypes.SESSIONS_PAY_CARD_SUCCESS:
    case ActionTypes.SESSIONS_PAY_CREDITS_SUCCESS:
    case ActionTypes.USER_CREDITS_TOPUP_PAYPAL_EXECUTE_SUCCESS:
    case ActionTypes.USER_CREDITS_TOPUP_BANK_SUCCESS:
    case ActionTypes.USER_CREDITS_TOPUP_CARD_SUCCESS:
    case ActionTypes.USER_CREDITS_TOPUP_CREDITS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.data,
        lastUpdated: action.response && action.response.receivedAt
      }
    case ActionTypes.TRANSACTION_DESTROY:
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
  users,
  config,
  services,
  bookings,
  booking,
  promos,
  session,
  sessions,
  sessionsByUser,
  sessionsSuggestedToProvider,
  documentation,
  applications,
  applicationsByProvider,
  patientsByClient,
  availableSchedules,
  // paypal,
  transactions,
  transactionsByUser,
  transaction,
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
    },
    bookingPatientForm: {
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
    bookingPatientForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'bookingPatientForm') {
            return {
              ...state,
              patientDob: {
                ...state.patientDob,
                value: action.value
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
    adminPromocodesForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          const { main, name } = action.source;
          if (main === 'adminPromocodesForm') {
            return {
              ...state,
              [name]: {
                ...state[name],
                value: action.value,
              }
            }
          }
          return state;
        case ActionTypes.PROMO_SUCCESS:
          const { data } = action.response;
          return {
            ...state,
            _id: { ...state._id, value: data._id },
            code: { ...state.code, value: data.code },
            name: { ...state.name, value: data.name },
            isActive: { ...state.isActive, value: data.isActive },
            dateTimeStart: { ...state.dateTimeStart, value: moment(data.dateTimeStart).format('YYYY-MM-DD') },
            dateTimeEnd: { ...state.dateTimeEnd, value: moment(data.dateTimeEnd).format('YYYY-MM-DD') },
            discountRate: { ...state.discountRate, value: data.discountRate },
            discountType: { ...state.discountType, value: data.discountType },
            regions: { ...state.regions, value: data.regions },
            services: { ...state.services, value: data.services && data.services.length ? data.services.map(item => `${item.id}:${item.classId}`) : "" },
            description: { ...state.description, value: data.description },
          };
        default:
          return state;
      }
    },
    adminBookingsForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'adminBookingsForm') {
            return {
              ...state,
              patientDOB: {
                ...state.patientDOB,
                value: action.value
              }
            }
          }
          return state;
        default:
          return state;
      }
    },
    adminCasesForm: (state, action) => {
      switch (action.type) {
        case ActionTypes.HIDE_MODAL_DAYPICKER:
          if (action.source === 'adminCasesForm') {
            return {
              ...state,
              patientDOB: {
                ...state.patientDOB,
                value: action.value
              }
            }
          }
          return state;
        default:
          return state;
      }
    }
    // adminCategoriesForm: (state, action) => {
    //   switch (action.type) {
    //     case ActionTypes.CATEGORY_SUCCESS:
    //       const { data } = action.response;
    //       return {
    //         ...state,
    //         _id: { ...state._id, value: data._id },
    //         name: { ...state.name, value: data.name },
    //         cType: { ...state.cType, value: data.cType },
    //         // avatar: { ...state.avatar, value: data.avatar },
    //         slug: { ...state.slug, value: data.slug },
    //         order: { ...state.order, value: data.order },
    //         description: { ...state.description, value: data.description },
    //       }
    //     default:
    //       return state;
    //   }
    // }
  })
});

export default bookingApp;
