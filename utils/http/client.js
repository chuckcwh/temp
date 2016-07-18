import fetch from 'isomorphic-fetch';

export default function (defaults = {}) {
  const host = defaults.host || '';

  const query = (params) => {
    const arr = Object.keys(params).reduce((a, p) => {
      if (params.hasOwnProperty(p)) {
        if (Array.isArray(params[p])) {
          for (let i = 0; i < params[p].length; i++) {
            a.push(`${encodeURIComponent(p)}[]=${encodeURIComponent(params[p][i])}`);
          }
        } else a.push(`${encodeURIComponent(p)}=${encodeURIComponent(params[p])}`);
      }
      return a;
    }, []);
    return (arr.length > 0) ? arr.join('&') : '';
  };

  const queryURL = (resource, qs) => (qs.length ? [resource, qs].join('?') : resource);

  const request = (resource, method, body = {}, headers = {}) => {
    const uMethod = method.toUpperCase();

    const args = {
      uMethod,
      headers: {},
    };

    args.headers = Object.assign(args.headers, headers.headers, defaults.headers);

    // for (const key in headers.headers) {
    //   args.headers[key] = headers.headers[key];
    // }

    // for (const key in defaults.headers) {
    //   args.headers[key] = defaults.headers[key];
    // }

    if (!args.headers['Content-Type']) {
      args.headers['Content-Type'] = 'application/json';
    }

    if (uMethod !== 'GET') args.body = typeof(body) === 'object' ? JSON.stringify(body) : body;

    return fetch(host + resource, args);
  };

  const get = (resource, params = {}, headers = {}) => {
    const qs = query(params);
    return request(queryURL(resource, qs), 'GET', {}, headers);
  };

  const put = (resource, body = {}, headers = {}) => request(resource, 'PUT', body, headers);

  const post = (resource, body = {}, headers = {}) => request(resource, 'POST', body, headers);

  const del = (resource, params = {}, headers = {}) =>
    request(queryURL(resource, query(params)), 'DELETE', {}, headers);

  return { request, get, put, post, del };
}
