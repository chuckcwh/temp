import { client } from 'http-otro'
import { fetch } from 'isomorphic-fetch'
import Util from '../core/Util'

const API_ROOT = Util.host + '/api/'

// Fetches an API response.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(store, endpoint, method, data, auth) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  let headers;
  if (auth === 'app') {
    headers = { 'Authorization': 'Basic ' + window.btoa(Util.authKey + ':' + Util.authSecret) }
  } else if (auth === 'user') {
    headers = { 'Authorization': 'Basic ' + window.btoa(store.getState().user.data.id + ':' + store.getState().user.data.token) }
  }
  let request = client({
    host: Util.host,
    headers
  })

  return (request[method])('/api/' + endpoint, data)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }

      // return Object.assign({},
      //   normalize(json[root], schema),
      //   { receivedAt: Date.now() }
      // )
      return Object.assign({},
        json,
        { receivedAt: Date.now() }
      )
    })
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
  const { method, auth, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
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

  return callApi(store, endpoint, method, action['data'], auth).then(
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
