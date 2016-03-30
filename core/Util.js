const util = {
  host: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://api.ebeecare.com' : 'http://dev.ebeecare.com'),
  authKey: 'secret',
  authSecret: 'secret0nlyWeilsonKnowsShhh852~',

  getCookies: () => {
    if (typeof document !== 'undefined' && document && document.cookie) {
      var pairs = document.cookie.split(';');
      var cookies = {};
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        if (pair[0]) pair[0] = pair[0].trim();
        cookies[pair[0]] = unescape(pair[1]);
      }
      return cookies;
    } else {
      return {};
    }
  }
};

export default util;