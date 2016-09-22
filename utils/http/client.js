import fetch from 'isomorphic-fetch';

export default function (defaults = {}) {
  const host = defaults.host || '';

  const serialize = (obj, prefix) => {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  };

  const queryURL = (resource, qs) => (qs.length ? [resource, qs].join('?') : resource);

  const request = (resource, methodStr, body = {}, headers = {}) => {
    const method = methodStr.toUpperCase();

    const args = {
      method,
      headers: Object.assign({
        'Content-Type': 'application/json',
      }, headers.headers, defaults.headers),
    };

    if (method !== 'GET') args.body = typeof(body) === 'object' ? JSON.stringify(body) : body;

    return fetch(host + resource, args);
  };

  const get = (resource, params = {}, headers = {}) =>
    request(queryURL(resource, serialize(params)), 'GET', {}, headers);

  const put = (resource, body = {}, headers = {}) =>
    request(resource, 'PUT', body, headers);

  const post = (resource, body = {}, headers = {}) =>
    request(resource, 'POST', body, headers);

  const del = (resource, params = {}, headers = {}) =>
    request(queryURL(resource, serialize(params)), 'DELETE', {}, headers);

  return { request, get, put, post, del };
}
