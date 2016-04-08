function isProduction() {
  return (typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1);
}

function isLoggedInBackend() {
  if (isProduction() && getCookies()['sessionid']) {
    return true;
  } else if (!isProduction() && getCookies()['ebeecare_session_dev']) {
    return true;
  } else return false;
}

function getCookies() {
  if (typeof document !== 'undefined' && document && document.cookie) {
    var pairs = document.cookie.split(';');
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      if (pair[0]) pair[0] = pair[0].trim();
      cookies[pair[0]] = unescape(pair[1]);
    }
    console.log(cookies);
    return cookies;
  } else {
    return {};
  }
}

const util = {
  host: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://api.ebeecare.com' : 'http://dev.ebeecare.com'),
  authKey: 'secret',
  authSecret: 'secret0nlyWeilsonKnowsShhh852~',

  backend: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://app.ebeecare.com' : 'http://dev.ebeecare.com'),
  partners: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeepartners.com') > -1) ? 'https://www.ebeecare.com' : 'http://staging.ebeepartners.com'),

  isProduction: isProduction,

  isLoggedInBackend: isLoggedInBackend,

  getCookies: getCookies
};

export default util;