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
  'booking-payment',
];

export const ALL_SERVICES = 'All Services';

export const SERVICES_CATEGORY_ORDER = [
  ALL_SERVICES,
  'Social Care',
  'Nursing Care',
  'Medical',
  'TCM',
  'Mother Care',
];

export function getCookies() {
  let pairs;
  const cookies = {};
  if (typeof document !== 'undefined' && document && document.cookie) {
    pairs = document.cookie.split(';');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      if (pair[0]) pair[0] = pair[0].trim();
      cookies[pair[0]] = unescape(pair[1]);
    }
    return cookies;
  }
  return {};
}

export function isProduction() {
  return (typeof window !== 'undefined' &&
    window.location.hostname.indexOf('www.ebeecare.com') > -1);
}

export function isLoggedInBackend() {
  if (isProduction() && getCookies().sessionid) {
    return true;
  } else if (!isProduction() && getCookies().ebeecare_session_dev) {
    return true;
  }
  return false;
}

export function isNavigationAllowed(path, lastPage) {
  const newPath = (path.charAt(0) === '/') ? path.substring(1) : path;
  if (newPath === 'booking5' && lastPage === 'booking3c') return true;
  return (PAGE_ORDERS.indexOf(lastPage) + 1) >= PAGE_ORDERS.indexOf(newPath);
}

export function isNextLastPage(path, lastPage) {
  return PAGE_ORDERS.indexOf(lastPage) + 1 === PAGE_ORDERS.indexOf(path);
}

export function isBookingPage(path) {
  return path.match(/^\/booking[0-9][abc]?/);
}

function parseCategoriesLevel(services, index) {
  const terms = ['category', 'subType', 'service'];
  let name = terms[index];
  const order = `${name}Order`;
  const id = `${name}Id`;
  const slug = `${name}Slug`;
  if (index === 2) {
    name = 'name';
    return sortBy(services, [order, name]);
  }
  const hash = {};
  services.forEach((service) => {
    if (!hash[service[name]]) {
      hash[service[name]] = [];
    }
    hash[service[name]].push(service);
  });
  const output = Object.keys(hash).map((i) => ({
    id: hash[i][0][id],
    name: i,
    slug: hash[i][0][slug],
    order: hash[i][0][order],
    children: parseCategoriesLevel(hash[i], index + 1),
  }));
  return sortBy(output, ['order', 'name']);
}

/*
Output

[{
  name: CATEGORY_1,
  children: [{
    name: SUB_CATEGORY_1,
    children: [{
      id: SERVICE_ID_1,
      ...service
    }]
  }]
}]
 */
export function parseCategories(services) {
  if (!services) return [];
  return parseCategoriesLevel(Object.values(services), 0);
}

export function appendAllServices(tree) {
  const t = {
    name: ALL_SERVICES,
    children: Object.values(tree).reduce((result, node) => result.concat(node.children), []),
  };
  tree.unshift(t);

  return tree;
}

export function calcRate(session, promo, sid) {
  if (promo && promo.discountedRate) {
    // verify promo is applicable to session
    const isPromoApplicable =
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
    }
    return parseFloat(session.price);
  }
  return parseFloat(session.price);
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
      break;
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

export function isInt(val) {
  const intRegex = /^-?\d+$/;
  if (!intRegex.test(val)) return false;
  const intVal = parseInt(val, 10);
  return parseFloat(val) == intVal && !isNaN(intVal);
}

export function isFloat(val) {
  const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
  if (!floatRegex.test(val)) return false;
  val = parseFloat(val);
  if (isNaN(val)) return false;
  return true;
}

export function isId(val) {
  const idRegex = /^[0-9abcdef]{24}$/;
  if (!idRegex.test(val)) return false;
  return true; 
}

/**
 * User utility functions
 */

export function isAdmin(user) {
  return user && user.role === 'admin';
}

export function isClient(user) {
  return user && user.role === 'client';
}

export function isProvider(user) {
  return user && user.role === 'provider';
}

export function getUserName(user) {
  return user && user.name;
}

export function getUserCurrentCredits(user) {
  return user && user.credit && (!isNaN(user.credit.current) && parseFloat(user.credit.current).toFixed(2)) || '-';
}

const u = {
  host: ((typeof window !== 'undefined' &&
    window.location.hostname.indexOf('www.ebeecare.com') > -1) ?
      'https://api.ebeecare.com' :
      'https://devapi.ebeecare.com'),
  authKey: 'secret',
  authSecret: 'secret0nlyWeilsonKnowsShhh852~',

  backend: ((typeof window !== 'undefined' &&
    window.location.hostname.indexOf('www.ebeecare.com') > -1) ?
      'https://app.ebeecare.com' :
      'https://dev.ebeecare.com'),
  partners: ((typeof window !== 'undefined' &&
    window.location.hostname.indexOf('www.ebeecare.com') > -1) ?
      'https://www.ebeepartners.com' :
      'http://staging.ebeepartners.com'),
  blog: 'https://blog.ebeecare.com',

  getCookies,

  isProduction,

  isLoggedInBackend,
  isNavigationAllowed,
  isNextLastPage,
  isBookingPage,

  ALL_SERVICES,
  SERVICES_CATEGORY_ORDER,

  parseCategories,
  appendAllServices,

  calcRate,
  getServiceIconClass,

  isInt,
  isFloat,
  isId,

  isAdmin,
  isClient,
  isProvider,
  getUserName,
  getUserCurrentCredits,
};

export default u;
