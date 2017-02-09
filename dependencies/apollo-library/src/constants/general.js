import moment from 'moment'

// - - - - - - - - - - validation - - - - - - - - - -  //

export const LONG_STRING_MIN = '3'
export const LONG_STRING_MAX = '100'
export const SHORT_STRING_MAX = '10'
export const MIN_BIRTH_DATE = '1900-01-01'
export const EMAIL_MIN_LENGTH = 3
export const EMAIL_MAX_LENGTH = 254

// - - - - - - - - - - date - - - - - - - - - -  //

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_FORMAT_SHORT_MONTH = 'YYYY-M-DD'
export const DATE_FORMAT_SHORT_DAY = 'YYYY-MM-D'
export const DATE_FORMAT_SHORT_MONTH_DAY = 'YYYY-M-D'
export const SERVER_DATE_FORMAT = [moment.ISO_8601, 'YYYY-MM-DDTHH:mm:ss.SSSZ']
export const DATE_COMPONENT_FORMAT = 'DD-MM-YYYY'
export const DATE_FORMAT_DD_MMM_YYYY = 'DD MMM YYYY'
export const TIME_FORMAT_hh_mm_A = 'hh:mm A'

export const DATE_FORMATS_KEY = 'dateFormats'
export const DATE_FORMAT_SHORT_KEY = 'shortDate'
export const DATE_FORMAT_LONG_KEY = 'longDate'

export const ADULT_AGE = 18
export const LIFE_EXPECTANCY = 150

// - - - - - - - - - - reactions - - - - - - - - - -  //

export const HUMAN_REACTION_TIMEUOT = 500 // ms
