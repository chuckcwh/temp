const util = {
  host: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://api.ebeecare.com' : 'https://dev.ebeecare.com'),
  authKey: 'secret',
  authSecret: 'secret0nlyWeilsonKnowsShhh852~'
};

export default util;