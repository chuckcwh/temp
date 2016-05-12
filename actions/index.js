/**
 * @param  {string} router The router
 */
export const setRouter = (router) => {
  return {
    type: 'SET_ROUTER',
    router: router
  }
}

/**
 * @param  {string} services The services
 */
export const setServices = (services) => {
  return {
    type: 'SET_SERVICES',
    services: services
  }
}

/**
 * @param  {string} last The last page
 */
export const setLastPage = (lastPage) => {
  return {
    type: 'SET_LAST_PAGE',
    lastPage: lastPage
  }
}

/**
 * @param  {string} booking The completed booking
 */
export const setBooking = (booking) => {
  return {
    type: 'SET_BOOKING',
    booking: booking
  }
}

/**
 * @param  {string} user The logged-in user
 */
export const setUser = (user) => {
  return {
    type: 'SET_USER',
    user: user
  }
}

/**
 * @param  {string} last The last page
 */
export const setPostStatus = (postStatus) => {
  return {
    type: 'SET_POST_STATUS',
    postStatus: postStatus
  }
}

/**
 * @param  {string} service The ID of the Service
 */
export const setOrderService = (service) => {
  return {
    type: 'ORDER_SET_SERVICE',
    service: service
  }
}

/**
 * @param  {string} location The location
 */
export const setOrderLocation = (location) => {
  return {
    type: 'ORDER_SET_LOCATION',
    location: location
  }
}

/**
 * @param  {string} dates List of date objects
 */
export const setOrderDates = (dates) => {
  return {
    type: 'ORDER_SET_DATES',
    dates: dates
  }
}

/**
 * @param  {string} timings Array of 'Morning', 'Afternoon' or 'Evening'
 */
export const setOrderTimeslots = (timeslots) => {
  return {
    type: 'ORDER_SET_TIMESLOTS',
    timeslots: timeslots
  }
}

/**
 * @param  {string} sessions The booked sessions
 */
export const setOrderSessions = (sessions) => {
  return {
    type: 'ORDER_SET_SESSIONS',
    sessions: sessions
  }
}

/**
 * @param  {string} sum The total sum
 */
export const setOrderSum = (sum) => {
  return {
    type: 'ORDER_SET_SUM',
    sum: sum
  }
}

/**
 * @param  {string} promoCode The promo code
 */
export const setOrderPromoCode = (promoCode) => {
  return {
    type: 'ORDER_SET_PROMO',
    promoCode: promoCode
  }
}

/**
 * @param  {string} booker The booker object containing contact and patient details
 */
export const setOrderBooker = (booker) => {
  return {
    type: 'ORDER_SET_BOOKER',
    booker: booker
  }
}

/**
 * @param  {string} patient The patient
 */
export const setOrderPatient = (patient) => {
  return {
    type: 'ORDER_SET_PATIENT',
    patient: patient
  }
}

/**
 * Destroy order
 */
export const destroyOrder = () => {
  return {
    type: 'ORDER_DESTROY'
  }
}
