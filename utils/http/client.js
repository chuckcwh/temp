import fetch from 'isomorphic-fetch'

export default function(defaults={}){
  let host = defaults.host || '';

  const query = (params)=>{
    var arr = [];
    for(var p in params){
      if (params.hasOwnProperty(p)) {
        if (Array.isArray(params[p])) {
          for (var i = 0; i < params[p].length; i++) {
            arr.push(encodeURIComponent(p) + "[]=" + encodeURIComponent(params[p][i]));
          }
        }
        else arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
      }
    }

    return (arr.length > 0) ? arr.join('&') : '';
  }

  const queryURL = (resource, qs)=>{
    return qs.length ? [resource, qs].join('?') : resource;
  }

  const request = (resource, method, body={}, headers={})=>{
    method = method.toUpperCase();

    let args = {
      method,
      headers: {}
    };

    for(var key in headers.headers){
      args.headers[key] = headers.headers[key];
    }

    for(var key in defaults.headers){
      args.headers[key] = defaults.headers[key];
    }

    if(!args.headers['Content-Type']){
      args.headers['Content-Type'] = 'application/json';
    }

    if(method != 'GET') args.body = typeof(body) == 'object' ? JSON.stringify(body) : body;

    return fetch(host + resource, args);
  }

  const get = (resource, params={}, headers={})=>{
    let qs = query(params);
    return request(queryURL(resource, qs), 'GET', {}, headers);
  }

  const put = (resource, body={}, headers={})=>{
    return request(resource, 'PUT', body, headers);
  }

  const post = (resource, body={}, headers={})=>{
    return request(resource, 'POST', body, headers);
  }

  const del = (resource, params={}, headers={})=>{
    let qs = query(params);
    return request(queryURL(resource, qs), 'DELETE', {}, headers);
  }

  return { request, get, put, post, del };
}