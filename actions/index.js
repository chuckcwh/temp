import { CALL_API } from '../middleware/api'
import moment from 'moment';

export const CONFIG_REQUEST = 'CONFIG_REQUEST'
export const CONFIG_SUCCESS = 'CONFIG_SUCCESS'
export const CONFIG_FAILURE = 'CONFIG_FAILURE'

export const CATEGORIES_REQUEST = 'CATEGORIES_REQUEST'
export const CATEGORIES_SUCCESS = 'CATEGORIES_SUCCESS'
export const CATEGORIES_FAILURE = 'CATEGORIES_FAILURE'

export const SERVICES_REQUEST = 'SERVICES_REQUEST'
export const SERVICES_SUCCESS = 'SERVICES_SUCCESS'
export const SERVICES_FAILURE = 'SERVICES_FAILURE'

export const LANGUAGES_REQUEST = 'LANGUAGES_REQUEST'
export const LANGUAGES_SUCCESS = 'LANGUAGES_SUCCESS'
export const LANGUAGES_FAILURE = 'LANGUAGES_FAILURE'

export const BOOKING_REQUEST = 'BOOKING_REQUEST'
export const BOOKING_SUCCESS = 'BOOKING_SUCCESS'
export const BOOKING_FAILURE = 'BOOKING_FAILURE'
export const BOOKING_DESTROY = 'BOOKING_DESTROY'

export const BOOKING_CREATE_REQUEST = 'BOOKING_CREATE_REQUEST'
export const BOOKING_CREATE_SUCCESS = 'BOOKING_CREATE_SUCCESS'
export const BOOKING_CREATE_FAILURE = 'BOOKING_CREATE_FAILURE'

export const BOOKING_EDIT_REQUEST = 'BOOKING_EDIT_REQUEST'
export const BOOKING_EDIT_SUCCESS = 'BOOKING_EDIT_SUCCESS'
export const BOOKING_EDIT_FAILURE = 'BOOKING_EDIT_FAILURE'

export const BOOKING_SESSION_CANCEL_REQUEST = 'BOOKING_SESSION_CANCEL_REQUEST'
export const BOOKING_SESSION_CANCEL_SUCCESS = 'BOOKING_SESSION_CANCEL_SUCCESS'
export const BOOKING_SESSION_CANCEL_FAILURE = 'BOOKING_SESSION_CANCEL_FAILURE'

export const SESSIONS_REQUEST = 'SESSIONS_REQUEST'
export const SESSIONS_SUCCESS = 'SESSIONS_SUCCESS'
export const SESSIONS_FAILURE = 'SESSIONS_FAILURE'

export const SESSION_CREATE_REQUEST = 'SESSION_CREATE_REQUEST'
export const SESSION_CREATE_SUCCESS = 'SESSION_CREATE_SUCCESS'
export const SESSION_CREATE_FAILURE = 'SESSION_CREATE_FAILURE'

export const USER_CREATE_REQUEST = 'USER_CREATE_REQUEST'
export const USER_CREATE_SUCCESS = 'USER_CREATE_SUCCESS'
export const USER_CREATE_FAILURE = 'USER_CREATE_FAILURE'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'
export const USER_DESTROY = 'USER_DESTROY'

export const USER_TOKEN_REQUEST = 'USER_TOKEN_REQUEST'
export const USER_TOKEN_SUCCESS = 'USER_TOKEN_SUCCESS'
export const USER_TOKEN_FAILURE = 'USER_TOKEN_FAILURE'

export const USER_EDIT_REQUEST = 'USER_EDIT_REQUEST'
export const USER_EDIT_SUCCESS = 'USER_EDIT_SUCCESS'
export const USER_EDIT_FAILURE = 'USER_EDIT_FAILURE'

export const USER_PATIENTS_REQUEST = 'USER_PATIENTS_REQUEST'
export const USER_PATIENTS_SUCCESS = 'USER_PATIENTS_SUCCESS'
export const USER_PATIENTS_FAILURE = 'USER_PATIENTS_FAILURE'

export const USER_PATIENT_REQUEST = 'USER_PATIENT_REQUEST'
export const USER_PATIENT_SUCCESS = 'USER_PATIENT_SUCCESS'
export const USER_PATIENT_FAILURE = 'USER_PATIENT_FAILURE'

export const USER_PATIENT_CREATE_REQUEST = 'USER_PATIENT_CREATE_REQUEST'
export const USER_PATIENT_CREATE_SUCCESS = 'USER_PATIENT_CREATE_SUCCESS'
export const USER_PATIENT_CREATE_FAILURE = 'USER_PATIENT_CREATE_FAILURE'

export const USER_PATIENT_EDIT_REQUEST = 'USER_PATIENT_EDIT_REQUEST'
export const USER_PATIENT_EDIT_SUCCESS = 'USER_PATIENT_EDIT_SUCCESS'
export const USER_PATIENT_EDIT_FAILURE = 'USER_PATIENT_EDIT_FAILURE'

export const USER_DEVICE_EDIT_REQUEST = 'USER_DEVICE_EDIT_REQUEST'
export const USER_DEVICE_EDIT_SUCCESS = 'USER_DEVICE_EDIT_SUCCESS'
export const USER_DEVICE_EDIT_FAILURE = 'USER_DEVICE_EDIT_FAILURE'

export const USER_EXPERIENCE_EDIT_REQUEST = 'USER_EXPERIENCE_EDIT_REQUEST'
export const USER_EXPERIENCE_EDIT_SUCCESS = 'USER_EXPERIENCE_EDIT_SUCCESS'
export const USER_EXPERIENCE_EDIT_FAILURE = 'USER_EXPERIENCE_EDIT_FAILURE'

export const USER_EDUCATION_EDIT_REQUEST = 'USER_EDUCATION_EDIT_REQUEST'
export const USER_EDUCATION_EDIT_SUCCESS = 'USER_EDUCATION_EDIT_SUCCESS'
export const USER_EDUCATION_EDIT_FAILURE = 'USER_EDUCATION_EDIT_FAILURE'

export const USER_ACHIEVEMENT_EDIT_REQUEST = 'USER_ACHIEVEMENT_EDIT_REQUEST'
export const USER_ACHIEVEMENT_EDIT_SUCCESS = 'USER_ACHIEVEMENT_EDIT_SUCCESS'
export const USER_ACHIEVEMENT_EDIT_FAILURE = 'USER_ACHIEVEMENT_EDIT_FAILURE'

export const USER_REVIEW_EDIT_REQUEST = 'USER_REVIEW_EDIT_REQUEST'
export const USER_REVIEW_EDIT_SUCCESS = 'USER_REVIEW_EDIT_SUCCESS'
export const USER_REVIEW_EDIT_FAILURE = 'USER_REVIEW_EDIT_FAILURE'

export const USER_SCHEDULE_EDIT_REQUEST = 'USER_SCHEDULE_EDIT_REQUEST'
export const USER_SCHEDULE_EDIT_SUCCESS = 'USER_SCHEDULE_EDIT_SUCCESS'
export const USER_SCHEDULE_EDIT_FAILURE = 'USER_SCHEDULE_EDIT_FAILURE'

export const FORGOT_PASSWORD_EMAIL_REQUEST = 'FORGOT_PASSWORD_EMAIL_REQUEST'
export const FORGOT_PASSWORD_EMAIL_SUCCESS = 'FORGOT_PASSWORD_EMAIL_SUCCESS'
export const FORGOT_PASSWORD_EMAIL_FAILURE = 'FORGOT_PASSWORD_EMAIL_FAILURE'

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST'
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE'

export const CLIENT_EDIT_REQUEST = 'CLIENT_EDIT_REQUEST'
export const CLIENT_EDIT_SUCCESS = 'CLIENT_EDIT_SUCCESS'
export const CLIENT_EDIT_FAILURE = 'CLIENT_EDIT_FAILURE'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const LOGIN_CLIENT_REQUEST = 'LOGIN_CLIENT_REQUEST'
export const LOGIN_CLIENT_SUCCESS = 'LOGIN_CLIENT_SUCCESS'
export const LOGIN_CLIENT_FAILURE = 'LOGIN_CLIENT_FAILURE'

export const EMAIL_EDIT_REQUEST = 'EMAIL_EDIT_REQUEST'
export const EMAIL_EDIT_SUCCESS = 'EMAIL_EDIT_SUCCESS'
export const EMAIL_EDIT_FAILURE = 'EMAIL_EDIT_FAILURE'

export const MOBILE_EDIT_REQUEST = 'MOBILE_EDIT_REQUEST'
export const MOBILE_EDIT_SUCCESS = 'MOBILE_EDIT_SUCCESS'
export const MOBILE_EDIT_FAILURE = 'MOBILE_EDIT_FAILURE'

export const MOBILE_VERIFY_REQUEST = 'MOBILE_VERIFY_REQUEST'
export const MOBILE_VERIFY_SUCCESS = 'MOBILE_VERIFY_SUCCESS'
export const MOBILE_VERIFY_FAILURE = 'MOBILE_VERIFY_FAILURE'

export const AVAILABLE_SCHEDULES_REQUEST = 'AVAILABLE_SCHEDULES_REQUEST'
export const AVAILABLE_SCHEDULES_SUCCESS = 'AVAILABLE_SCHEDULES_SUCCESS'
export const AVAILABLE_SCHEDULES_FAILURE = 'AVAILABLE_SCHEDULES_FAILURE'

export const PROMO_REQUEST = 'PROMO_REQUEST'
export const PROMO_SUCCESS = 'PROMO_SUCCESS'
export const PROMO_FAILURE = 'PROMO_FAILURE'

export const TRANSACTION_PAYPAL_CREATE_REQUEST = 'TRANSACTION_PAYPAL_CREATE_REQUEST'
export const TRANSACTION_PAYPAL_CREATE_SUCCESS = 'TRANSACTION_PAYPAL_CREATE_SUCCESS'
export const TRANSACTION_PAYPAL_CREATE_FAILURE = 'TRANSACTION_PAYPAL_CREATE_FAILURE'

export const TRANSACTION_PAYPAL_EXECUTE_REQUEST = 'TRANSACTION_PAYPAL_EXECUTE_REQUEST'
export const TRANSACTION_PAYPAL_EXECUTE_SUCCESS = 'TRANSACTION_PAYPAL_EXECUTE_SUCCESS'
export const TRANSACTION_PAYPAL_EXECUTE_FAILURE = 'TRANSACTION_PAYPAL_EXECUTE_FAILURE'

export const TRANSACTION_BANK_CREATE_REQUEST = 'TRANSACTION_BANK_CREATE_REQUEST'
export const TRANSACTION_BANK_CREATE_SUCCESS = 'TRANSACTION_BANK_CREATE_SUCCESS'
export const TRANSACTION_BANK_CREATE_FAILURE = 'TRANSACTION_BANK_CREATE_FAILURE'

export const VERIFY_BOOKING_PIN_REQUEST = 'VERIFY_BOOKING_PIN_REQUEST'
export const VERIFY_BOOKING_PIN_SUCCESS = 'VERIFY_BOOKING_PIN_SUCCESS'
export const VERIFY_BOOKING_PIN_FAILURE = 'VERIFY_BOOKING_PIN_FAILURE'

export const RESEND_VERIFY_BOOKING_PIN_REQUEST = 'RESEND_VERIFY_BOOKING_PIN_REQUEST'
export const RESEND_VERIFY_BOOKING_PIN_SUCCESS = 'RESEND_VERIFY_BOOKING_PIN_SUCCESS'
export const RESEND_VERIFY_BOOKING_PIN_FAILURE = 'RESEND_VERIFY_BOOKING_PIN_FAILURE'

export const STATS_SESSIONS_REQUEST = 'STATS_SESSIONS_REQUEST'
export const STATS_SESSIONS_SUCCESS = 'STATS_SESSIONS_SUCCESS'
export const STATS_SESSIONS_FAILURE = 'STATS_SESSIONS_FAILURE'

export const STATS_SERVICES_REQUEST = 'STATS_SERVICES_REQUEST'
export const STATS_SERVICES_SUCCESS = 'STATS_SERVICES_SUCCESS'
export const STATS_SERVICES_FAILURE = 'STATS_SERVICES_FAILURE'

export const STATS_SUBCATEGORIES_REQUEST = 'STATS_SUBCATEGORIES_REQUEST'
export const STATS_SUBCATEGORIES_SUCCESS = 'STATS_SUBCATEGORIES_SUCCESS'
export const STATS_SUBCATEGORIES_FAILURE = 'STATS_SUBCATEGORIES_FAILURE'

function fetchAction(route) {
  return {
    getConfig: {
      types: [ CONFIG_REQUEST, CONFIG_SUCCESS, CONFIG_FAILURE ],
      endpoint: '/config',
      method: 'get',
      auth: 'app',
      entity: 'config'
    },
    getCategories: {
      types: [ CATEGORIES_REQUEST, CATEGORIES_SUCCESS, CATEGORIES_FAILURE ],
      endpoint: '/categories',
      method: 'get',
      entity: 'services'
    },
    getServices: {
      types: [ SERVICES_REQUEST, SERVICES_SUCCESS, SERVICES_FAILURE ],
      endpoint: '/services',
      method: 'get',
      auth: 'app',
      entity: 'services'
    },
    getLanguages: {
      types: [ LANGUAGES_REQUEST, LANGUAGES_SUCCESS, LANGUAGES_FAILURE ],
      endpoint: '/getLanguages',
      method: 'get',
      auth: 'app',
      entity: 'languages'
    },
    getBooking: {
      types: [ BOOKING_REQUEST, BOOKING_SUCCESS, BOOKING_FAILURE ],
      endpoint: '/bookings/:bookingId',
      method: 'get',
      auth: 'app',
      entity: 'booking'
    },
    createBooking: {
      types: [ BOOKING_CREATE_REQUEST, BOOKING_CREATE_SUCCESS, BOOKING_CREATE_FAILURE ],
      endpoint: '/bookings',
      method: 'post',
    },
    editBooking: {
      types: [ BOOKING_EDIT_REQUEST, BOOKING_EDIT_SUCCESS, BOOKING_EDIT_FAILURE ],
      endpoint: '/bookings/:_id',
      method: 'post',
    },
    cancelBookingSession: {
      types: [ BOOKING_SESSION_CANCEL_REQUEST, BOOKING_SESSION_CANCEL_SUCCESS, BOOKING_SESSION_CANCEL_FAILURE ],
      endpoint: '/cancelCaseSession',
      method: 'post',
      auth: 'app'
    },
    getSessions: {
      types: [ SESSIONS_REQUEST, SESSIONS_SUCCESS, SESSIONS_FAILURE ],
      endpoint: '/sessions',
      method: 'get',
      entity: 'sessions'
    },
    createSession: {
      types: [ SESSION_CREATE_REQUEST, SESSION_CREATE_SUCCESS, SESSION_CREATE_FAILURE ],
      endpoint: '/sessions',
      method: 'post'
    },
    login: {
      types: [ LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE ],
      endpoint: '/auth/local',
      method: 'post',
    },
    loginClient: {
      types: [ LOGIN_CLIENT_REQUEST, LOGIN_CLIENT_SUCCESS, LOGIN_CLIENT_FAILURE ],
      endpoint: '/auth/local',
      method: 'post',
    },
    createUser: {
      types: [ USER_CREATE_REQUEST, USER_CREATE_SUCCESS, USER_CREATE_FAILURE ],
      endpoint: '/users',
      method: 'post',
    },
    getUser: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: '/users/:userId',
      method: 'get',
      entity: 'user'
    },
    getUserWithToken: {
      types: [ USER_TOKEN_REQUEST, USER_TOKEN_SUCCESS, USER_TOKEN_FAILURE ],
      endpoint: '/users/:id',
      method: 'get',
      auth: 'userParams',
      entity: 'user'
    },
    forgotPassword: {
      types: [ FORGOT_PASSWORD_EMAIL_REQUEST, FORGOT_PASSWORD_EMAIL_SUCCESS, FORGOT_PASSWORD_EMAIL_FAILURE ],
      endpoint: '/users/sendForgotPasswordEmail',
      method: 'put'
    },
    resetPassword: {
      types: [ RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE ],
      endpoint: '/users/resetPassword',
      method: 'put'
    },
    editUser: {
      types: [ USER_EDIT_REQUEST, USER_EDIT_SUCCESS, USER_EDIT_FAILURE ],
      endpoint: '/users/:userId',
      method: 'put'
    },
    getUserPatients: {
      types: [ USER_PATIENTS_REQUEST, USER_PATIENTS_SUCCESS, USER_PATIENTS_FAILURE ],
      endpoint: '/users/:userId/patients',
      method: 'get',
      entity: 'patients'
    },
    getUserPatient: {
      types: [ USER_PATIENT_REQUEST, USER_PATIENT_SUCCESS, USER_PATIENT_FAILURE ],
      endpoint: '/users/:userId/patients/:patientId',
      method: 'get',
      entity: 'patient'
    },
    createUserPatient: {
      types: [ USER_PATIENT_CREATE_REQUEST, USER_PATIENT_CREATE_SUCCESS, USER_PATIENT_CREATE_FAILURE ],
      endpoint: '/users/:userId/patients',
      method: 'post',
    },
    editUserPatient: {
      types: [ USER_PATIENT_EDIT_REQUEST, USER_PATIENT_EDIT_SUCCESS, USER_PATIENT_EDIT_FAILURE ],
      endpoint: '/users/:userId/patients/:patientId',
      method: 'put'
    },
    editUserDevice: {
      types: [ USER_DEVICE_EDIT_REQUEST, USER_DEVICE_EDIT_SUCCESS, USER_DEVICE_EDIT_FAILURE ],
      endpoint: '/users/:userId/devices/:deviceId',
      method: 'put'
    },
    editUserExperience: {
      types: [ USER_EXPERIENCE_EDIT_REQUEST, USER_EXPERIENCE_EDIT_SUCCESS, USER_EXPERIENCE_EDIT_FAILURE ],
      endpoint: '/users/:userId/experiences/:experienceId',
      method: 'put'
    },
    editUserEducation: {
      types: [ USER_EDUCATION_EDIT_REQUEST, USER_EDUCATION_EDIT_SUCCESS, USER_EDUCATION_EDIT_FAILURE ],
      endpoint: '/users/:userId/educations/:educationId',
      method: 'put'
    },
    editUserAchievement: {
      types: [ USER_ACHIEVEMENT_EDIT_REQUEST, USER_ACHIEVEMENT_EDIT_SUCCESS, USER_ACHIEVEMENT_EDIT_FAILURE ],
      endpoint: '/users/:userId/achievements/:achievementId',
      method: 'put'
    },
    editUserReview: {
      types: [ USER_REVIEW_EDIT_REQUEST, USER_REVIEW_EDIT_SUCCESS, USER_REVIEW_EDIT_FAILURE ],
      endpoint: '/users/:userId/reviews/:reviewId',
      method: 'put'
    },
    editUserSchedule: {
      types: [ USER_SCHEDULE_EDIT_REQUEST, USER_SCHEDULE_EDIT_SUCCESS, USER_SCHEDULE_EDIT_FAILURE ],
      endpoint: '/users/:userId/schedules/:scheduleId',
      method: 'put'
    },
    editEmail: {
      types: [ EMAIL_EDIT_REQUEST, EMAIL_EDIT_SUCCESS, EMAIL_EDIT_FAILURE ],
      endpoint: '/changeEmail',
      method: 'post',
      auth: 'user'
    },
    editMobile: {
      types: [ MOBILE_EDIT_REQUEST, MOBILE_EDIT_SUCCESS, MOBILE_EDIT_FAILURE ],
      endpoint: '/changeMobileNumber',
      method: 'post',
      auth: 'user'
    },
    getAvailableSchedules: {
      types: [ AVAILABLE_SCHEDULES_REQUEST, AVAILABLE_SCHEDULES_SUCCESS, AVAILABLE_SCHEDULES_FAILURE ],
      endpoint: '/users/schedules/available',
      method: 'get',
      entity: 'availableSchedules'
    },
    getPromo: {
      types: [ PROMO_REQUEST, PROMO_SUCCESS, PROMO_FAILURE ],
      endpoint: '/checkPromocode',
      method: 'get',
      auth: 'app'
    },
    createPaypalTransaction: {
      types: [ TRANSACTION_PAYPAL_CREATE_REQUEST, TRANSACTION_PAYPAL_CREATE_SUCCESS, TRANSACTION_PAYPAL_CREATE_FAILURE ],
      endpoint: '/makePaypalWebPayment',
      method: 'post',
      auth: 'app'
    },
    executePaypalTransaction: {
      types: [ TRANSACTION_PAYPAL_EXECUTE_REQUEST, TRANSACTION_PAYPAL_EXECUTE_SUCCESS, TRANSACTION_PAYPAL_EXECUTE_FAILURE ],
      endpoint: '/verifyPaypalTransaction',
      method: 'post',
      auth: 'app'
    },
    createBankTransferTransaction: {
      types: [ TRANSACTION_BANK_CREATE_REQUEST, TRANSACTION_BANK_CREATE_SUCCESS, TRANSACTION_BANK_CREATE_FAILURE ],
      endpoint: '/verifyBankTransaction',
      method: 'post',
      auth: 'app'
    },
    verifyBookingPin: {
      types: [ VERIFY_BOOKING_PIN_REQUEST, VERIFY_BOOKING_PIN_SUCCESS, VERIFY_BOOKING_PIN_FAILURE ],
      endpoint: '/bookings/verifyPin',
      method: 'put',
    },
    resendVerifyBookingPin: {
      types: [ RESEND_VERIFY_BOOKING_PIN_REQUEST, RESEND_VERIFY_BOOKING_PIN_SUCCESS, RESEND_VERIFY_BOOKING_PIN_FAILURE ],
      endpoint: '/resendBookingPin',
      method: 'post',
      auth: 'app'
    },
    getTotalSessionsCount: {
      types: [ STATS_SESSIONS_REQUEST, STATS_SESSIONS_SUCCESS, STATS_SESSIONS_FAILURE ],
      endpoint: '/getTotalSessionsCount',
      method: 'get',
      auth: 'app',
      entity: 'totalSessionsCount'
    },
    getRankedServices: {
      types: [ STATS_SERVICES_REQUEST, STATS_SERVICES_SUCCESS, STATS_SERVICES_FAILURE ],
      endpoint: '/getRankedServices',
      method: 'get',
      auth: 'app',
      entity: 'rankedServices'
    },
    getRankedSubcategories: {
      types: [ STATS_SUBCATEGORIES_REQUEST, STATS_SUBCATEGORIES_SUCCESS, STATS_SUBCATEGORIES_FAILURE ],
      endpoint: '/getRankedSubCategory',
      method: 'get',
      auth: 'app',
      entity: 'rankedSubcategories'
    },
    // getAvailableSessions:{
    //   types: [ AVAILABLE_SESSIONS_REQUEST, AVAILABLE_SESSIONS_SUCCESS, AVAILABLE_SESSIONS_FAILURE ],
    //   endpoint: '/getAvailableCases',
    //   method: 'get',
    //   auth: 'user',
    //   entity: 'availableSessions'
    // }
  }[route]
}

function shouldFetch(state, action) {
  const obj = action.entity && state[action.entity]
  if (!(obj && obj.data)) {
    return true
  }
  if (obj.isFetching) {
    return false
  }
  return obj.didInvalidate
}

function checkToFetch(route, data, dispatch, getState) {
  if (shouldFetch(getState(), fetchAction(route))) {
    if (data) {
      return dispatch({
        data,
        [CALL_API]: fetchAction(route)
      })
    } else {
      return dispatch({
        [CALL_API]: fetchAction(route)
      })
    }
  } else return new Promise((resolve) => resolve());
}

function fetch(route, data) {
  return (dispatch, getState) =>
    checkToFetch(route, data, dispatch, getState);
}

export function fetchConfig() {
  return fetch('getConfig');
}

export function fetchServices() {
  return (dispatch, getState) => {
    return checkToFetch('getCategories', null, dispatch, getState)
      .then(result => {
        if (result && result.type === CATEGORIES_SUCCESS) {
          return checkToFetch('getServices', null, dispatch, getState);
        }
        return new Promise((resolve) => resolve());
      });
  }
}

export function fetchLanguages() {
  return fetch('getLanguages');
}

export function getBooking(params) {
  return fetch('getBooking', params);
}

export function createBooking(params) {
  return fetch('createBooking', params);
}

export function createBookingWithOptions({ services, order, user }) {
  let data;
  if (user) {
    data = {
      sessions: order.sessions.map(session => ({
        serviceId: order && order.service,
        classId: order && order.service && order.serviceClass && services[order.service].classes[order.serviceClass]._id,
        address: {
          description: order && order.location && order.location.description,
          unit: order && order.location && order.location.unit,
          postal: order && order.location && order.location.postal,
          lat: order && order.location && order.location.lat,
          lng: order && order.location && order.location.lng,
          region: order && order.location && order.location.region,
          neighborhood: order && order.location && order.location.neighborhood,
        },
        loc: {
          coordinates: [order && order.location && order.location.lng, order && order.location && order.location.lat]
        },
        patient: order && order.patient,
        date: moment(session.date).format('YYYY-MM-DD'),
        timeSlot: session.time,
        additionalInfo: order && order.booker && order.booker.additionalInfo,
      })),
    };
    if (order && order.promoCode && order.promoCode.code) {
      data.promoCode = order.promoCode.code;
    }
  } else {
    data = {
      sessions: order.sessions.map(session => ({
        serviceId: order && order.service,
        classId: order && order.service && order.serviceClass && services[order.service].classes[order.serviceClass]._id,
        address: {
          description: order && order.location && order.location.description,
          unit: order && order.location && order.location.unit,
          postal: order && order.location && order.location.postal,
          lat: order && order.location && order.location.lat,
          lng: order && order.location && order.location.lng,
          region: order && order.location && order.location.region,
          neighborhood: order && order.location && order.location.neighborhood,
        },
        loc: {
          coordinates: [order && order.location && order.location.lng, order && order.location && order.location.lat]
        },
        date: moment(session.date).format('YYYY-MM-DD'),
        timeSlot: session.time,
        additionalInfo: order && order.booker && order.booker.additionalInfo,
      })),
      adhocClient: {
        email: order && order.booker && order.booker.clientEmail,
        contact: order && order.booker && order.booker.clientContact,
        name: order && order.booker && order.booker.clientName,
      },
      adhocPatient: {
        name: order && order.booker && order.booker.patientName,
        contact: order && order.booker && order.booker.patientContact,
        gender: order && order.booker && order.booker.patientGender,
        dob: order && order.booker && order.booker.patientDob,
      },
    };
    if (order && order.promoCode && order.promoCode.code) {
      data.promoCode = order.promoCode.code;
    }
  }
  return createBooking(data);
}

export function editBooking(params) {
  return fetch('editBooking', params);
}

export function getCases(params) {
  return fetch('getCases', params);
}

export function getAvailableSchedules(params) {
  return fetch('getAvailableSchedules', params);
}

export function cancelBookingSession(params, booking) {
  return fetch('cancelBookingSession', params);
}

export function login(params) {
  return fetch('login', params);
}

export function loginClient(params) {
  return fetch('loginClient', params);
}

export function createUser(params) {
  return fetch('createUser', params);
}

export function getUser(params) {
  return fetch('getUser', params);
}

export function editUser(params) {
  return fetch('editUser', params);
}

export function getUserPatients(params) {
  return fetch('getUserPatients', params);
}

export function getUserPatient(params) {
  return fetch('getUserPatient', params);
}

export function createUserPatient(params) {
  return fetch('createUserPatient', params);
}

export function editUserPatient(params) {
  return fetch('editUserPatient', params);
}

export function editUserDevice(params) {
  return fetch('editUserDevice', params);
}

export function editUserExperience(params) {
  return fetch('editUserExperience', params);
}

export function editUserEducation(params) {
  return fetch('editUserEducation', params);
}

export function editUserAchievement(params) {
  return fetch('editUserAchievement', params);
}

export function editUserReview(params) {
  return fetch('editUserReview', params);
}

export function editUserSchedule(params) {
  return fetch('editUserSchedule', params);
}

export function getUserWithToken(params) {
  return fetch('getUserWithToken', params);
}

export function forgotPassword(params) {
  return fetch('forgotPassword', params);
}

export function resetPassword(params) {
  return fetch('resetPassword', params);
}

export function destroyUser() {
  return {
    type: USER_DESTROY
  }
}

export function editEmail(params) {
  return fetch('editEmail', params);
}

export function editMobile(params) {
  return fetch('editMobile', params);
}

export function verifyMobile(params) {
  return fetch('verifyMobile', params);
}

export function getSessions(params) {
  return fetch('getSessions', params);
}

export function getPromo(params) {
  return fetch('getPromo', params);
}

export function createPaypalTransaction(params) {
  return fetch('createPaypalTransaction', params);
}

export function executePaypalTransaction(params) {
  return fetch('executePaypalTransaction', params);
}

export function createBankTransferTransaction(params) {
  return fetch('createBankTransferTransaction', params);
}

export function verifyBookingPin(params) {
  return fetch('verifyBookingPin', params);
}

export function resendVerifyBookingPin(params) {
  return fetch('resendVerifyBookingPin', params);
}

export function getTotalSessionsCount() {
  return fetch('getTotalSessionsCount');
}

export function getRankedServices() {
  return fetch('getRankedServices');
}

export function getRankedSubcategories() {
  return fetch('getRankedSubcategories');
}

export function clearBooking() {
  return { type: BOOKING_DESTROY }
}

export const GEOCODE_REQUEST = 'GEOCODE_REQUEST'
export const GEOCODE_SUCCESS = 'GEOCODE_SUCCESS'
export const GEOCODE_FAILURE = 'GEOCODE_FAILURE'

function requestGeocode(postal) {
  return {
    type: GEOCODE_REQUEST,
    postal
  }
}

function receiveGeocode(postal, geocode) {
  return {
    type: GEOCODE_SUCCESS,
    postal: postal,
    description: geocode.description,
    lng: geocode.lng,
    lat: geocode.lat,
    region: geocode.neighborhood,
    neighborhood: geocode.neighborhood,
    receivedAt: Date.now()
  }
}

function failedReceiveGeocode(postal) {
  return {
    type: GEOCODE_FAILURE,
    postal,
    receivedAt: Date.now()
  }
}

function geocode(postal) {
  return new Promise((resolve, reject) => {
    try {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( {
        'address': postal,
        'region': 'SG'
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var position = results[0].geometry.location;
          geocoder.geocode({
            latLng: position
          }, function(responses) {
            if (responses && responses.length > 0) {
              let res = {
                description: responses[0].formatted_address,
                lat: responses[0].geometry.location.lat(),
                lng: responses[0].geometry.location.lng(),
              };
              responses[0].address_components.forEach((component) => {
                if (component.types.indexOf('neighborhood') >= 0) {
                  res.neighborhood = component.long_name;
                }
              });
              resolve(res);
            } else {
              console.error('Invalid postal code.');
              reject('Invalid postal code.');
            }
          });
        } else {
          console.error('Invalid postal code.');
          reject('Invalid postal code.');
        }
      });
    } catch(e) {
      console.error('Unable to find your address.');
      reject('Unable to find your address.');
    }
  });
}

export function fetchAddress(postal) {
  return dispatch => {
    dispatch(requestGeocode(postal))
    return geocode(postal)
      .then(result => dispatch(receiveGeocode(postal, result)),
        () => dispatch(failedReceiveGeocode(postal)))
  }
}

export const SET_LAST_PAGE = 'SET_LAST_PAGE'

export const setLastPage = (lastPage) => {
  return { type: SET_LAST_PAGE, lastPage }
}

export const SET_POST_STATUS = 'SET_POST_STATUS'

export const setPostStatus = (postStatus) => {
  return { type: SET_POST_STATUS, postStatus }
}

export const ORDER_SET_SERVICE = 'ORDER_SET_SERVICE'

export const setOrderService = (service) => {
  return { type: ORDER_SET_SERVICE, service }
}

export const ORDER_SET_SERVICE_CLASS = 'ORDER_SET_SERVICE_CLASS'

export const setOrderServiceClass = (serviceClass) => {
  return { type: ORDER_SET_SERVICE_CLASS, serviceClass }
}

export const ORDER_SET_LOCATION = 'ORDER_SET_LOCATION'

export const setOrderLocation = (location) => {
  return { type: ORDER_SET_LOCATION, location }
}

export const ORDER_SET_DATES = 'ORDER_SET_DATES'

export const setOrderDates = (dates) => {
  return { type: ORDER_SET_DATES, dates }
}

export const ORDER_SET_TIMESLOTS = 'ORDER_SET_TIMESLOTS'

export const setOrderTimeslots = (timeslots) => {
  return { type: ORDER_SET_TIMESLOTS, timeslots }
}

export const ORDER_SET_SESSIONS = 'ORDER_SET_SESSIONS'

export const setOrderSessions = (sessions) => {
  return { type: ORDER_SET_SESSIONS, sessions }
}

export const ORDER_SET_SUM = 'ORDER_SET_SUM'

export const setOrderSum = (sum) => {
  return { type: ORDER_SET_SUM, sum }
}

export const ORDER_SET_PROMO = 'ORDER_SET_PROMO'

export const setOrderPromoCode = (promoCode) => {
  return { type: ORDER_SET_PROMO, promoCode }
}

export const ORDER_SET_BOOKER = 'ORDER_SET_BOOKER'

export const setOrderBooker = (booker) => {
  return { type: ORDER_SET_BOOKER, booker }
}

export const ORDER_SET_PATIENT = 'ORDER_SET_PATIENT'

export const setOrderPatient = (patient) => {
  return { type: ORDER_SET_PATIENT, patient }
}

export const ORDER_DESTROY = 'ORDER_DESTROY'

export const destroyOrder = () => {
  return { type: ORDER_DESTROY }
}

export const SHOW_MODAL_ALERT = 'SHOW_MODAL_ALERT'
export const HIDE_MODAL_ALERT = 'HIDE_MODAL_ALERT'
export const SHOW_MODAL_CONFIRM = 'SHOW_MODAL_CONFIRM'
export const HIDE_MODAL_CONFIRM = 'HIDE_MODAL_CONFIRM'
export const SHOW_MODAL_LOGIN = 'SHOW_MODAL_LOGIN'
export const HIDE_MODAL_LOGIN = 'HIDE_MODAL_LOGIN'
export const SHOW_MODAL_DAYPICKER = 'SHOW_MODAL_DAYPICKER'
export const HIDE_MODAL_DAYPICKER = 'HIDE_MODAL_DAYPICKER'
export const SHOW_MODAL_VERIFYBOOKING = 'SHOW_MODAL_VERIFYBOOKING'
export const HIDE_MODAL_VERIFYBOOKING = 'HIDE_MODAL_VERIFYBOOKING'
export const SHOW_MODAL_RESENDVERIFYBOOKING = 'SHOW_MODAL_RESENDVERIFYBOOKING'
export const HIDE_MODAL_RESENDVERIFYBOOKING = 'HIDE_MODAL_RESENDVERIFYBOOKING'
export const SHOW_INLINE_FORM = 'SHOW_INLINE_FORM'
export const HIDE_INLINE_FORM = 'HIDE_INLINE_FORM'

export function showAlertPopup(message) {
  return {
    type: SHOW_MODAL_ALERT,
    message: message
  }
}

export function hideAlertPopup() {
  return {
    type: HIDE_MODAL_ALERT
  }
}

export function showConfirmPopup(message, accept, cancel) {
  return {
    type: SHOW_MODAL_CONFIRM,
    message: message,
    accept: accept,
    cancel: cancel
  }
}

export function hideConfirmPopup() {
  return {
    type: HIDE_MODAL_CONFIRM
  }
}

export function showLoginPopup() {
  return {
    type: SHOW_MODAL_LOGIN
  }
}

export function hideLoginPopup() {
  return {
    type: HIDE_MODAL_LOGIN
  }
}

export function showDayPickerPopup(value, source) {
  return {
    type: SHOW_MODAL_DAYPICKER,
    source: source,
    value: value
  }
}

export function hideDayPickerPopup(value, source) {
  return {
    type: HIDE_MODAL_DAYPICKER,
    source: source,
    value: value
  }
}

export function showVerifyBookingPopup(bookingId) {
  return {
    type: SHOW_MODAL_VERIFYBOOKING,
    bookingId: bookingId
  }
}

export function hideVerifyBookingPopup() {
  return {
    type: HIDE_MODAL_VERIFYBOOKING
  }
}

export function showResendVerifyBookingPopup(bookingId) {
  return {
    type: SHOW_MODAL_RESENDVERIFYBOOKING,
    bookingId: bookingId
  }
}

export function hideResendVerifyBookingPopup() {
  return {
    type: HIDE_MODAL_RESENDVERIFYBOOKING
  }
}

export function showInlineForm(params) {
  return {
    type: SHOW_INLINE_FORM,
    name: params.name,
    inputs: params.inputs,
    ok: params.ok,
    cancel: params.cancel,
    validate: params.validate
  }
}

export function hideInlineForm() {
  return {
    type: HIDE_INLINE_FORM
  }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
