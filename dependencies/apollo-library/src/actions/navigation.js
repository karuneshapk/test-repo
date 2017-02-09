import {
  NAVIGATION_DROPDOWN_OPEN,
  NAVIGATION_DROPDOWN_CLOSE,
  NAVIGATION_DROPDOWN_SET_ACTIVE,
  NAVIGATION_DROPDOWN_SET_TITLE,
  NAVIGATION_MENU_SET_ITEMS,
  NAVIGATION_MENU_SET_ACTIVE,
} from 'apollo-library/constants/actions'

/**
 * Dropdown open action
 *
 * @param {string} id Dropdown itentifikator
 * @return {Object}
 */
export const navigationDropdownOpen = (id: string) => ({
  type: NAVIGATION_DROPDOWN_OPEN,
  dropdownId: id
})

/**
 * Dropdown close action
 *
 * @param {string} id Dropdown itentifikator
 * @return {Object}
 */
export const navigationDropdownClose = (id: string) => ({
  type: NAVIGATION_DROPDOWN_CLOSE,
  dropdownId: id
})

/**
 * Dropdown set active item action
 *
 * @param {string} dropdownId Dropdown itentifikator
 * @param {string} itemId Dropdown active item id
 * @return {Object}
 */
export const navigationDropdownSetActive = (dropdownId: string, itemId: string) => ({
  type: NAVIGATION_DROPDOWN_SET_ACTIVE,
  dropdownId,
  itemId,
})

/**
 * Dropdown set title
 *
 * @param {string} dropdownId Dropdown itentifikator
 * @param {string} title Dropdown title
 * @return {Object}
 */
export const navigationDropdownSetTitle = (dropdownId: string, title: string) => ({
  type: NAVIGATION_DROPDOWN_SET_TITLE,
  dropdownId,
  title,
})

/**
 * Set navigation bar items
 * @param {Array.<Object>} items
 * @return {Object}
 */
export const navigationMenuSetItems = items => ({
  type: NAVIGATION_MENU_SET_ITEMS,
  items,
})

/**
 * Set navigation active item
 * @param {string} item
 * @return {Object}
 */
export const navigationMenuSetActive = item => ({
  type: NAVIGATION_MENU_SET_ACTIVE,
  item,
})
