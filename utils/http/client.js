import fetch from 'isomorphic-fetch';

export default function (defaults = {}) {
  const host = defaults.host || '';

  const query = (params) => {
    const arr = [];
    Object.keys(params).forEach((p) => {
      if (Array.isArray(params[p])) {
        arr.push(`${encodeURIComponent(p)}=${encodeURIComponent(JSON.stringify(params[p]))}`);
      } else arr.push(`${encodeURIComponent(p)}=${encodeURIComponent(params[p])}`);
    });
    return (arr.length > 0) ? arr.join('&') : '';
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
    request(queryURL(resource, query(params)), 'GET', {}, headers);

  const put = (resource, body = {}, headers = {}) =>
    request(resource, 'PUT', body, headers);

  const post = (resource, body = {}, headers = {}) =>
    request(resource, 'POST', body, headers);

  const delete = (resource, params = {}, headers = {}) =>
    request(queryURL(resource, query(params)), 'DELETE', {}, headers);

  return { request, get, put, post, del };
}
