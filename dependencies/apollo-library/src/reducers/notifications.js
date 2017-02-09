import { Map, OrderedMap } from 'immutable'

import {
  NOTIFICATION_ADD,
  NOTIFICATION_REMOVE,
  NOTIFICATION_REMOVE_BATCH
} from 'apollo-library/constants/actions'
import { generateKey } from 'apollo-library/utils/math'

const initialState = OrderedMap()

/**
 * Redux data transformer for notifications container
 *
 * @param {Immutable.OrderedMap} state - redux subtree store state
 * @param {Object} action - redux action to be processed
 *
 * @return {Immutable.OrderedMap} new (transformed) redux state
 */
export const notificationsReducer = (state = initialState, action) => {

  switch (action.type) {

    // add a notification to store.root.notifications
    case NOTIFICATION_ADD: {
      const idNotification = action.id || generateKey()
      const newNotification = Map(action.notification).merge({ idNotification })
      return state.merge({ [idNotification]: newNotification })
    }

    // remove a notification from store.root.notifications
    case NOTIFICATION_REMOVE: {
      return state.delete(action.idNotification)
    }

    // remove multiple notifications
    case NOTIFICATION_REMOVE_BATCH: {
      const ids = action.notificationIds

      return ids
        ? state.filter(notification => !ids.includes(notification.get('idNotification')))
        : state
    }

  }

  return state
}
