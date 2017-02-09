import {
  NOTIFICATION_ADD,
  NOTIFICATION_REMOVE,
  NOTIFICATION_REMOVE_BATCH
} from 'apollo-library/constants/actions'

/**
 * Add notification to notifications queue
 *
 * @param {Object|ReactNode|function} notification - instance notification
 * @param {?string} id
 *
 * @return {Object} redux action
 */
export const addNotification = (notification, id) => ({
  type: NOTIFICATION_ADD,
  notification,
  id,
})

/**
 * Remove notification from notifications queue
 *
 * @param {string} idNotification - uuid of notification
 *
 * @return {Object} redux action
 */
export const removeNotification = idNotification => ({
  type: NOTIFICATION_REMOVE,
  idNotification
})

/**
 * Remove notifications from notifications queue
 *
 * @param {Array<string>} notificationIds - uuids of notifications
 *
 * @return {Object} redux action
 */
export const removeNotifications = notificationIds => ({
  type: NOTIFICATION_REMOVE_BATCH,
  notificationIds
})

/**
 * Dismiss notification after dismissAfter milliseconds if conditions are met
 *
 * @param {string} idNotification - uuid of notification
 * @param {string} type - notification type
 * @param {number} dismissAfter - delay in ms
 *
 * @return {Object} redux action
 *
 */
export const deferNotificationRemoval = (idNotification, type, dismissAfter) =>
  (type !== 'danger' && dismissAfter > 0)
    ? dispatch => {
      window.setTimeout(() => { dispatch(removeNotification(idNotification)) }, dismissAfter)
    }
    : { type: 'default' }
