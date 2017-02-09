import React, { Component, PropTypes } from 'react'
import moment from 'moment-timezone'

import { isDefined } from 'apollo-library/utils/common'

import {
  FORMATTED_DATE_DEFAULT_TIME_FORMAT,
  FORMATTED_DATE_DEFAULT_DATE_FORMAT,
} from 'apollo-library/constants/components'

import { SERVER_DATE_FORMAT } from 'apollo-library/constants/general'

/**
 * Element for formating date and time.
 *
 * @property {string} tagName
 * @property {string} value - input date
 * @property {string} valueFormat - format of input date if different then ISO
 * @property {string} format - format
 * @property {string} dateFormat - format for time
 * @property {string} timeFormat - format for time
 * @property {boolean} time - show time
 * @property {boolean} date - show date
 * @property {string} tz - time zone
 * @property {boolean} relative - show relative date
 * @property {boolean} calendar - show calendar output
 *
 * @module
 */
export class FormattedDate extends Component {

  static propTypes = {
    tagName: PropTypes.string,
    format: PropTypes.string,
    dateFormat: PropTypes.string,
    valueFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.array]),
    timeFormat: PropTypes.string,
    tz: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.bool,
    time: PropTypes.bool,
    relative: PropTypes.bool,
    calendar: PropTypes.bool
  }

  static defaultProps = {
    tagName: 'span',
    dateFormat: FORMATTED_DATE_DEFAULT_DATE_FORMAT,
    valueFormat: SERVER_DATE_FORMAT,
    date: true,
    time: false,
    relative: false,
    calendar: false,
  }

  /**
   * Returns formatting for date and time
   * @returns {string}
   */
  getDateTimeFormat() {
    const {
      format,
      dateFormat,
      timeFormat,
      time,
      date,
    } = this.props

    if (isDefined(format)) {
      return format
    }

    const showDateFormat = date && dateFormat
    const showTimeFormat = timeFormat || (time && FORMATTED_DATE_DEFAULT_TIME_FORMAT)

    if (showDateFormat && showTimeFormat) {
      return `${showDateFormat} ${showTimeFormat}`
    }

    if (showDateFormat) {
      return showDateFormat
    }

    if (showTimeFormat) {
      return showTimeFormat
    }

    return ''
  }

  /**
   * Renders tag with given content
   * @param {string} content
   * @returns {ReactElement}
   */
  renderTag(content) {
    const {
      tagName: Tag,
      className,
    } = this.props

    return (
      <Tag className={className}>
        {content}
      </Tag>
    )
  }

  /**
   * Component render
   *
   * @return {ReactNode}
   */
  render() {
    const {
      relative,
      calendar,
      tz,
      value,
      valueFormat,
    } = this.props

    const momentDate = moment(value, valueFormat)

    if (tz) {
      momentDate.tz(tz)
    }

    if (relative) {
      return this.renderTag(momentDate.fromNow())
    }

    if (calendar) {
      return this.renderTag(momentDate.calendar())
    }

    return this.renderTag(momentDate.format(this.getDateTimeFormat()))
  }
}

export default FormattedDate
