import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'

import authenticationMessages from 'apollo-library/messages/authentication'
import { isDefined } from 'apollo-library/utils/common'
import { composeClassName } from 'apollo-library/utils/components'

const calculateSecondsDelta = (b, a) =>
  Math.max(0, moment.duration(moment.unix(a).diff(moment.unix(b))).seconds())

/**
 * Countdown component
 *
 * @property {number=} disableUntil - unix timestamp if is set to now show
 *  finish messages inmidietly
 * @property {{message: Object, values: Object}=} waitMessage - message is intl
 *   object can have value seconds
 * @property {!{message: Object, values: Object}} finishMessage - message is
 *   intl object can have value seconds
 */
export class NextSMSCountdown extends Component {

  static propTypes = {
    waitMessage: PropTypes.shape({
      message: PropTypes.object,
      values: PropTypes.object
    }),
    finishMessage: PropTypes.shape({
      message: PropTypes.object,
      values: PropTypes.object
    }).isRequired,
    disableUntil: PropTypes.number //unix timestamp
  }

  static defaultProps = {
    waitMessage: {
      message: authenticationMessages.nextSMSCountdownWaitText,
      values: {}
    }
  }

  /**
   * @constructor
   * @extends {Component}
   */
  constructor() {
    super(...arguments)

    this.ticker = undefined
    this.state = {
      until: undefined,
      now: moment().unix(),
      seconds: 0
    }
  }

  /**
   * After mount component initialize timer
   */
  componentWillMount() {
    if (isDefined(this.props.disableUntil)) {
      this.installTicker(this.props.disableUntil)
    }
  }

  /**
   * When change seconds property. Reset timer
   *
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.disableUntil !== nextProps.disableUntil) {
      this.uninstallTicker()
      if (isDefined(nextProps.disableUntil)) {
        this.installTicker(nextProps.disableUntil)
      }
    }
  }

  /**
   * Before remove component remove timer
   */
  componentWillUnmount() {
    this.uninstallTicker()
  }

  /**
   * Initialize interval for count down
   *
   * @param {number} until - unix timestamp
   */
  installTicker(until) {
    const now = moment().unix()
    const seconds = calculateSecondsDelta(now, until)

    if (seconds > 0) {
      this.setState({ until, seconds, now }, () => {
        this.ticker = setInterval(() => {
          const now = moment().unix()
          const seconds = calculateSecondsDelta(now, this.state.until)

          if (seconds === 0) {
            this.uninstallTicker()
          }

          this.setState({ seconds, now })
        }, 1000)
      })
    }
  }

  /**
   * Remove interval
   */
  uninstallTicker() {
    if (isDefined(this.ticker)) {
      clearInterval(this.ticker)
    }
  }

  /**
   * Renders locked state
   *
   * @return {ReactNode}
   */
  renderLocked() {
    const {
      waitMessage
    } = this.props

    const waitClasses = composeClassName(
      'countdown-wait',
      this.props.className
    )

    return (
      <span className={waitClasses}>
        <FormattedMessage {...waitMessage.message}
          values={{
            ...(waitMessage.values || {}),
            seconds: this.state.seconds
          }}
        />
      </span>
    )
  }

  /**
   * Renders unlocked state
   *
   * @return {ReactNode}
   */
  renderUnlocked() {
    const {
      finishMessage
    } = this.props

    if (!finishMessage) {
      return null
    }

    const finishClasses = composeClassName(
      'countdown-finish',
      this.props.className
    )

    return (
      <span className={finishClasses}>
        <FormattedMessage {...finishMessage.message}
          values={{
            ...(finishMessage.values || {}),
            seconds: this.state.seconds
          }}
        />
      </span>
    )
  }

  /**
   * Renders either locked button with countdown or enabled button
   *
   * @return {ReactNode}
   */
  render() {
    const {
      props: { disableUntil },
      state: { seconds }
    } = this

    return (
      <div className="countdown">
        {((disableUntil !== void 0) && (+(seconds || 0) > 0))
          ? this.renderLocked()
          : this.renderUnlocked()
        }
      </div>
    )
  }

}

export default NextSMSCountdown
