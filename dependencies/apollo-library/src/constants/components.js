
// - - - - - - - - - - form - - - - - - - - - -  //

export const VALIDATE_ON_MOUNT = 'mount'
export const VALIDATE_ON_FOCUS = 'focus'
export const VALIDATE_ON_CHANGE = 'change'
export const VALIDATE_ON_BLUR = 'blur'
export const VALIDATE_ON_SUBMIT = 'submit'

// - - - - - - - base input enums - - - - - - -  //

export const ADDON_TYPES = {
  BUTTON: 'btn',
  ADDON: 'addon'
}

export const LABEL_POSITION = {
  BEFORE: 'beforeInput',
  AFTER: 'afterInput'
}

export const HELP_BLOCK_POSITION = {
  AFTER_LABEL: 'before',
  AFTER_INPUT: 'afterInput',
  VALIDATION: 'validation'
}

export const COUNTDOWN_POSITION = {
  BEFORE_INPUT: 'beforeInput',
  AFTER_INPUT: 'afterInput'
}

// - - - - - - - - - - common - - - - - - - - - -  //

/** @see {@url http://getbootstrap.com/css/#helper-classes-colors} */
export const CONTEXTUAL_COLORS = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
  DEFAULT: 'default',
  LINK: 'link',
  PRIMARY: 'primary'
}

export const TOOLTIP_PLACEMENT = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
}

export const MESSAGE_TYPE = {
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
}

// - - - - - - - - - - grid - - - - - - - - - -  //

export const GRID_CLASS_PREFIXES = {
  lg: 'col-lg-',
  md: 'col-md-',
  sm: 'col-sm-',
  xs: 'col-xs-'
}

export const GRID_OFFSET_PREFIXES = {
  lgOffset: 'col-lg-offset-',
  lgPull: 'col-lg-pull-',
  lgPush: 'col-lg-push-',
  mdOffset: 'col-md-offset-',
  mdPull: 'col-md-pull-',
  mdPush: 'col-md-push-',
  smOffset: 'col-sm-offset-',
  smPull: 'col-sm-pull-',
  smPush: 'col-sm-push-',
  xsOffset: 'col-xs-pull-',
  xsPull: 'col-xs-pull-',
  xsPush: 'col-xs-push-'
}
export const CLASS_PREFIXES = {
  ...GRID_CLASS_PREFIXES,
  ...GRID_OFFSET_PREFIXES
}

// - - - - - - - - - - money - - - - - - - - - - //
export const MONEY_SYMBOL_GLYPHICON = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP'
}

export const MONEY_DEFAULT_SYMBOL = 'GBP'
export const MONEY_DEFAULT_FRACTION = 2
export const MONEY_DEFAULT_DECIMAL_POINT = '.'

export const MONEY_SYMBOL_POSITION = {
  PRE: 'PRE',
  POST: 'POST',
}

export const MONEY_CURRENCY_SYMBOL_POSITION = {
  USD: MONEY_SYMBOL_POSITION.PRE,
  EUR: MONEY_SYMBOL_POSITION.PRE,
  GBP: MONEY_SYMBOL_POSITION.PRE,
  CZK: MONEY_SYMBOL_POSITION.POST,
}

export const CURRENCY_SYMPOLS = {
  'USD': '$', // US Dollar
  'EUR': '€', // Euro
  'CRC': '₡', // Costa Rican Colón
  'GBP': '£', // British Pound Sterling
  'ILS': '₪', // Israeli New Sheqel
  'INR': '₹', // Indian Rupee
  'JPY': '¥', // Japanese Yen
  'KRW': '₩', // South Korean Won
  'NGN': '₦', // Nigerian Naira
  'PHP': '₱', // Philippine Peso
  'PLN': 'zł', // Polish Zloty
  'PYG': '₲', // Paraguayan Guarani
  'THB': '฿', // Thai Baht
  'UAH': '₴', // Ukrainian Hryvnia
  'VND': '₫', // Vietnamese Dong
  'CZK': 'Kč' // Czech crown
}

export const FORMATTED_DATE_DEFAULT_TIME_FORMAT = 'LTS'
export const FORMATTED_DATE_DEFAULT_DATE_FORMAT = 'L'
