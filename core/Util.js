const ALL_SERVICES = 'All Services';

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
    return cookies;
  } else {
    return {};
  }
}

function filterServices(services, filter) {
  return services.filter(function(service) {
    if (filter === ALL_SERVICES) return true;
    return service.category === filter;
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
}

function subFilterServices(services) {
  var hash = {}, arr = [];
  services.forEach(service => {
    if (hash[service.subType]) {
      hash[service.subType].push(service);
    } else {
      hash[service.subType] = [service];
    }
  });
  for (var subType in hash) {
    arr.push(hash[subType]);
  }
  return arr;
}

const util = {
  host: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://api.ebeecare.com' : 'http://dev.ebeecare.com'),
  authKey: 'secret',
  authSecret: 'secret0nlyWeilsonKnowsShhh852~',

  backend: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://app.ebeecare.com' : 'http://dev.ebeecare.com'),
  partners: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://www.ebeecare.com' : 'http://staging.ebeepartners.com'),

  isProduction: isProduction,

  isLoggedInBackend: isLoggedInBackend,

  getCookies: getCookies,

  ALL_SERVICES: ALL_SERVICES,
  filterServices: filterServices,
  subFilterServices: subFilterServices
};

export default util;