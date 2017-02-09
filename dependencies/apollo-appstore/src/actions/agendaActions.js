import { AS_AGENDA_SET, AS_AGENDA_SET_KEY } from 'apollo-appstore/constants/actions'

/**
 * Add or set item under given agenda with given value
 *
 * @param {string} agenda - agenda enum
 * @param {string} key - item name
 * @param {*} value - item value
 *
 * @returns {Object} redux action
 */
export const setAgendaKey = (agenda, key, value) => ({
  type: AS_AGENDA_SET_KEY,
  agenda,
  key,
  value
})

/**
 * Add or set item under given agenda with given value
 *
 * @param {string} agenda - agenda enum
 * @param {Object} payload - data
 *
 * @returns {Object} redux action
 */
export const setAgenda = (agenda, payload) => ({
  type: AS_AGENDA_SET,
  agenda,
  payload
})
