import moment from 'moment';

export const PAGE_ORDERS = [
  '',
  'booking1',
  'booking2',
  'booking3a',
  'booking3b',
  'booking3c',
  'booking4',
  'booking5',
  'booking-confirmation',
  'booking-payment'
];

export const ALL_SERVICES = 'All Services';

export const SERVICES_CATEGORY_ORDER = [
  ALL_SERVICES,
  'Social Care',
  'Nursing Care',
  'Medical',
  'TCM',
  'Mother Care'
];

export function isProduction() {
  return (typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1);
}

export function isLoggedInBackend() {
  if (isProduction() && getCookies()['sessionid']) {
    return true;
  } else if (!isProduction() && getCookies()['ebeecare_session_dev']) {
    return true;
  } else return false;
}

export function isNavigationAllowed(path, lastPage) {
  if (path.charAt(0) === '/') {
    path = path.substring(1);
  }
  if (path === 'booking5' && lastPage === 'booking3c') return true;
  return (PAGE_ORDERS.indexOf(lastPage) + 1) >= PAGE_ORDERS.indexOf(path);
}

export function isNextLastPage(path, lastPage) {
  return PAGE_ORDERS.indexOf(lastPage) + 1 === PAGE_ORDERS.indexOf(path);
}

export function getCookies() {
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

export function filterServices(services, filter) {
  return Object.values(services).filter(function(service) {
    if (filter === ALL_SERVICES) return true;
    return service.category === filter;
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
}

export function subFilterServices(services) {
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

export function calcRate(session, promo, sid) {
  if (promo && promo.discountedRate) {
    // verify promo is applicable to session
    var isPromoApplicable =
      promo.services.some(elem => elem === sid) &&
      promo.dates.some(elem =>
        elem.type === 'Scheduled' &&
        elem.status === 'Active' &&
        moment(session.date) >= moment(elem.dateTimeStart.substr(0, 10)) &&
        moment(session.date) <= moment(elem.dateTimeEnd.substr(0, 10))
      ) &&
      !promo.dates.some(elem =>
        elem.type === 'Void' &&
        elem.status === 'Active' &&
        moment(session.date).isSame(moment(elem.dateTimeStart.substr(0, 10)))
      );
    if (isPromoApplicable) {
      return parseFloat(session.price) * (100 - parseFloat(promo.discountedRate)) / 100;
    } else {
      return parseFloat(session.price);
    }
  } else {
    return parseFloat(session.price);
  }
}

const util = {
  host: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://api.ebeecare.com' : 'http://dev.ebeecare.com'),
  authKey: 'secret',
  authSecret: 'secret0nlyWeilsonKnowsShhh852~',

  backend: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://app.ebeecare.com' : 'http://dev.ebeecare.com'),
  partners: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://www.ebeepartners.com' : 'http://staging.ebeepartners.com'),

  isProduction: isProduction,

  isLoggedInBackend: isLoggedInBackend,
  isNavigationAllowed: isNavigationAllowed,
  isNextLastPage: isNextLastPage,

  getCookies: getCookies,

  ALL_SERVICES: ALL_SERVICES,
  SERVICES_CATEGORY_ORDER: SERVICES_CATEGORY_ORDER,
  filterServices: filterServices,
  subFilterServices: subFilterServices,

  calcRate: calcRate
};

export default util;
