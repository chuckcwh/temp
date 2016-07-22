import moment from 'moment';
import sortBy from 'lodash/sortBy';

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

//
// Output
// 
// [{
//   name: CATEGORY_1,
//   children: [{
//     name: SUB_CATEGORY_1,
//     children: [{
//       id: SERVICE_ID_1,
//       ...service
//     }]
//   }]
// }]
export function parseCategories(services) {
  if (!services) return [];
  return parseCategoriesLevel(Object.values(services), 0);
}

function parseCategoriesLevel(services, index) {
  const terms = ['category', 'subType', 'service'];
  let name = terms[index], order = name + 'Order';
  if (name === 'service') name = 'name';
  let hash = {};
  if (index === 2) {
    services = sortBy(services, [order, name]);
    return services;
  }
  services.forEach((service, i) => {
    if (!hash[service[name]]) {
      hash[service[name]] = [];
    }
    hash[service[name]].push(service);
  });
  let output = [];
  for (var i in hash) {
    output.push({ name: i, order: hash[i][0][order], children: parseCategoriesLevel(hash[i], index+1) });
  }
  output = sortBy(output, ['order', 'name'])
  return output;
}

export function appendAllServices(tree) {
  let t = {
    name: ALL_SERVICES,
    children: []
  }
  for (var i in tree) {
    t.children = t.children.concat(tree[i].children);
  }
  tree.unshift(t);

  return tree;
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

export function getServiceIconClass(serviceId) {
  let subcatClass;
  switch (serviceId) {
    case 10:
      subcatClass = 'breast';
      break;
    case 11:
      subcatClass = 'headheart';
      break;
    case 12:
      subcatClass = 'physiotherapy';
      break
    case 13:
      subcatClass = 'elderly';
      break;
    case 14:
      subcatClass = 'needle';
      break;
    case 15:
      subcatClass = 'drip';
      break;
    case 16:
      subcatClass = 'nutrition';
      break;
    case 17:
      subcatClass = 'syringe';
      break;
    case 18:
      subcatClass = 'urinary';
      break;
    case 19:
      subcatClass = 'stomach';
      break;
    case 20:
      subcatClass = 'diabetic';
      break;
    case 21:
      subcatClass = 'bandage';
      break;
    case 22:
      subcatClass = 'lung';
      break;
    case 23:
      subcatClass = 'report';
      break;
    case 24:
      subcatClass = 'headdots';
      break;
    case 27:
      subcatClass = 'housecall';
      break;
    case 29:
      subcatClass = 'stethoscope';
      break;
    case 30:
      subcatClass = 'headheart';
      break;
    case 31:
      subcatClass = 'heart';
      break;
    case 32:
      subcatClass = 'baby';
      break;
    case 33:
      subcatClass = 'homeheart';
      break;
    case 34:
      subcatClass = 'breast';
      break;
    default:
      subcatClass = 'ebeecare';
  }
  return subcatClass;
}

export function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

const u = {
  host: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://api.ebeecare.com' : 'https://dev.ebeecare.com'),
  authKey: 'secret',
  authSecret: 'secret0nlyWeilsonKnowsShhh852~',

  backend: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://app.ebeecare.com' : 'https://dev.ebeecare.com'),
  partners: ((typeof window !== 'undefined' && window.location.hostname.indexOf('www.ebeecare.com') > -1) ? 'https://www.ebeepartners.com' : 'http://staging.ebeepartners.com'),
  blog: 'https://blog.ebeecare.com',

  isProduction: isProduction,

  isLoggedInBackend: isLoggedInBackend,
  isNavigationAllowed: isNavigationAllowed,
  isNextLastPage: isNextLastPage,

  getCookies: getCookies,

  ALL_SERVICES: ALL_SERVICES,
  SERVICES_CATEGORY_ORDER: SERVICES_CATEGORY_ORDER,

  parseCategories: parseCategories,
  appendAllServices: appendAllServices,

  calcRate: calcRate,
  getServiceIconClass: getServiceIconClass,

  isInt: isInt,
};

export default u;