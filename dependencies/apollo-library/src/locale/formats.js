/*
 *
 * formats - custom formats for localization values, adding to or overriding the built-in ones
 *    date, time and number (see http://formatjs.io/guides/message-syntax/ for details)
 *
 */
export default {

  date: {
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    numeric: { day: 'numeric', month: 'numeric', year: 'numeric' },
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    monthShort: { month: 'short', year: 'numeric' },
    weekdayShort: { weekday: 'short', month: 'numeric', year: '2-digit' }
  },

  time: {
    hhmm: { hour: 'numeric', minute: 'numeric' }
  },

  number: {
    percent: { style: 'percent', minimumFractionDigits: '2' }
  }

}
