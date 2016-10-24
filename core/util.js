import cookie from 'react-cookie';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import uniqueId from 'lodash/uniqueId';
import history from './history';

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

export const host = ((typeof window !== 'undefined' &&
  window.location.hostname.indexOf('www.ebeecare.com') > -1) ?
    'https://api.ebeecare.com' :
    'https://devapi.ebeecare.com');

export const backend = ((typeof window !== 'undefined' &&
  window.location.hostname.indexOf('www.ebeecare.com') > -1) ?
    'https://app.ebeecare.com' :
    'https://dev.ebeecare.com');

export const partners = ((typeof window !== 'undefined' &&
  window.location.hostname.indexOf('www.ebeecare.com') > -1) ?
    'https://www.ebeepartners.com' :
    'http://ebeepartners-testing.firebaseapp.com');

export const blog = 'https://blog.ebeecare.com';

export function getUniqueId() {
  return uniqueId('ebc');
}

export function getUriQueryParam(key) {
  const location = history.getCurrentLocation();
  return location
    && location.query
    && location.query[key];
}

export function getDownloadUrl(privateUrl) {
  return `${host}/api/s3/redirectObjectUrl?fileName=${encodeURIComponent(privateUrl)}&access_token=${cookie.load('user_token') || cookie.load('booking_token')}`;
}

export function isProduction() {
  return (typeof window !== 'undefined' &&
    window.location.hostname.indexOf('www.ebeecare.com') > -1);
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

export function calcRate(session, promo, sid, scid) {
  if (promo && promo.discountRate && promo.discountType) {
    // verify promo is applicable to session
    const sessionDateMoment = moment(session.date);
    const isPromoApplicable =
      ((promo.services && promo.services.length) ? promo.services.some(elem => elem.id === sid && elem.classId === scid) : true) &&
      (promo.dateTimeStart ? sessionDateMoment >= moment(promo.dateTimeStart) : true) &&
      (promo.dateTimeEnd ? sessionDateMoment <= moment(promo.dateTimeEnd) : true) &&
      ((promo.voidDates && promo.voidDates.length) ? !promo.voidDates.some(date => sessionDateMoment.isSame(moment(date), 'day')) : true);
    if (isPromoApplicable) {
      if (promo.discountType === '%') {
        return parseFloat(session.price) * (100 - parseFloat(promo.discountRate)) / 100;
      } else {
        return parseFloat(session.price) - parseFloat(promo.discountRate);
      }
    }
    return parseFloat(session.price);
  }
  return parseFloat(session.price);
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

export function formatSessionAlias(alias) {
  const nChars = 6;
  const strAlias = '' + alias;
  let result = strAlias;
  for (let i = 0; i < (nChars - strAlias.length); i++) {
    result = '0' + result;
  }
  return result;
}

export function normalize(array, id = '_id') {
  if (!array || !Array.isArray(array)) return;
  return array.reduce((result, elem) => {
    result[elem[id]] = elem;
    return result;
  }, {})
}

export function normalizeMultiple(array, id = '_id') {
  if (!array || !Array.isArray(array)) return;
  return array.reduce((result, elem) => {
    if (!result[elem[id]]) result[elem[id]] = [];
    result[elem[id]].push(elem);
    return result;
  }, {})
}

export function removeByKey(myObj, deleteKey) {
  return Object.keys(myObj)
    .filter(key => key !== deleteKey)
    .reduce((result, current) => {
      result[current] = myObj[current];
      return result;
  }, {})
}

export function configToName(config, map, value) {
  return config && config[map] && config[map][value] && config[map][value].name;
}

/**
 * User utility functions
 */

export function getCookieUserId() {
  return cookie.load('user_id');
}

export function isAdmin(user) {
  return user && user.role === 'admin';
}

export function isClient(user) {
  return user && user.role === 'client';
}

export function isProvider(user) {
  return user && user.role === 'provider';
}

export function isActivatedProvider(user) {
  return user && user.role === 'provider' && user.pinVerified && user.providerStatus.hasPassedInterview;
}

export function getUserName(user) {
  return user && user.name;
}

export function getUserCurrentCredits(user) {
  return user && user.credits && (!isNaN(user.credits.current) && parseFloat(user.credits.current).toFixed(2)) || '-';
}

const u = {
  host,

  backend,
  partners,
  blog,

  getUniqueId,
  getUriQueryParam,

  isProduction,

  isNavigationAllowed,
  isNextLastPage,
  isBookingPage,

  ALL_SERVICES,

  parseCategories,
  appendAllServices,

  calcRate,

  isInt,
  isFloat,
  isId,
  formatSessionAlias,

  normalize,
  normalizeMultiple,
  removeByKey,
  configToName,

  getCookieUserId,
  isAdmin,
  isClient,
  isProvider,
  getUserName,
  getUserCurrentCredits,
};

export default u;
