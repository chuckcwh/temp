import { Schema, arrayOf, normalize } from 'normalizr'
import 'isomorphic-fetch'
import Util from '../core/Util'

const API_ROOT = Util.host + '/api/'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(store, endpoint, schema, root, auth) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  let params = undefined;
  if (auth === 'app') {
    params = {
      headers: { 'Authorization': 'Basic ' + window.btoa(Util.authKey + ':' + Util.authSecret) }
    };
  } else if (auth === 'user') {
    params = {
      headers: { 'Authorization': 'Basic ' + window.btoa(store.user.id + ':' + store.user.token) }
    };
  }

  return fetch(fullUrl, params)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }

      return Object.assign({},
        normalize(json[root], schema),
        { receivedAt: Date.now() }
      )
    })
}

const serviceSchema = new Schema('services')

// Schemas for Github API responses.
export const Schemas = {
  SERVICE: serviceSchema,
  SERVICE_ARRAY: arrayOf(serviceSchema)
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { schema, root, auth, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(store, endpoint, schema, root, auth).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
