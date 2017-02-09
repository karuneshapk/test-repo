import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import Alert from 'apollo-library/components/UI/Alert'
import {
  removeNotification,
  removeNotifications,
  deferNotificationRemoval
} from 'apollo-library/actions/notifications'

/**
 * Element for showing notifications
 *
 * @property {Object} notifications - Immutable OrderedMap of notification Maps
 * @property {function} removeNotification - removeNotification action creator
 * @property {function} removeNotifications - removeNotifications action creator
 * @property {function} deferNotificationRemoval - deferNotificationRemoval action creator
 *
 * @module
 */
export class Notifications extends Component {

  static propTypes = {
    notifications: ImmutablePropTypes.orderedMap.isRequired,
    removeNotification: PropTypes.func,
    removeNotifications: PropTypes.func,
    deferNotificationRemoval: PropTypes.func
  }

  /**
   * Can update container
   *
   * @param {Object} nextProps
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    const notificationDuplicates = this.getDuplicateNotifications(nextProps.notifications)

    if (notificationDuplicates.length > 0) {
      this.props.removeNotifications(notificationDuplicates)
      return false
    }

    return true
  }

  /**
   * Return duplicite notifications
   *
   * @param {Immutable.OrderedMap} notifications
   * @return {Array}
   */
  getDuplicateNotifications(notifications) {
    const {
      intl: { formatMessage }
    } = this.props
    const duplicates = []
    const uniqueNotifications = {}

    notifications.valueSeq().forEach(notification => {
      let notificationText = notification.get('text')

      //This is ugly hack how to identify FormattedMessage component and get translated text from it
      if (typeof notificationText == 'object') {
        const notificationMessage = notificationText.props

        if (notificationMessage && notificationMessage.id && notificationMessage.defaultMessage) {
          notificationText = formatMessage(notificationText.props, notificationText.props.values)
        }
      }

      if (uniqueNotifications[notificationText]) {
        duplicates.push(notification.get('idNotification'))
      }

      uniqueNotifications[notificationText] = true
    })

    return duplicates
  }

  /**
   * Container render
   *
   * @return {ReactElement}
   */
  render() {
    const {
      notifications,
      removeNotification,
      deferNotificationRemoval
    } = this.props
    const notificationsArray = []

    notifications.forEach(notification => {
      const key = notification.get('idNotification')

      notificationsArray.push(
        <div className="notification" key={key}>
          <Alert
            idNotification={key}
            isNotification={true}
            className="alert-dismissable"
            text={notification.get('text')}
            deferDismiss={deferNotificationRemoval}
            onDismiss={removeNotification.bind(null, key)}
            type={notification.get('type')}
            dismissAfter={notification.get('dismissAfter')}
          />
        </div>
      )
    })

    return (
      <div id="notifications">
        {notificationsArray}
      </div>
    )
  }

}

export default connect(state => ({
  notifications: state.platform.notifications
}), {
  removeNotification,
  removeNotifications,
  deferNotificationRemoval
})(injectIntl(Notifications))
