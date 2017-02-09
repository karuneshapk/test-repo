import { DROPDOWN_OPEN } from 'apollo-library/constants/actions'

/**
 * Dropdown opened action
 *
 * @param {string} id Dropdown itentifikator
 * @return {Object}
 */
export const dropdownOpened = (id: string) => ({
  type: DROPDOWN_OPEN,
  dropdownId: id
})
