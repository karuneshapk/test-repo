import { SET_ACTIVE_TAB } from 'apollo-library/constants/actions'

/**
 * Set an active tab of a tab component
 *
 * @param {*} activeTab - the name of an active tab to be set
 * @param {*} componentName
 *
 * @return {Object} the definition of a redux action
 */
export const setActiveTab = (activeTab, componentName) => ({
  type: SET_ACTIVE_TAB,
  payload: {
    activeTab,
    componentName
  }
})
