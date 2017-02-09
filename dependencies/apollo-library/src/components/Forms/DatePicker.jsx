import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { injectIntl } from 'react-intl'
import RCCalendar from 'rc-calendar'
import RCDatePicker from 'rc-calendar/lib/Picker'

import { isDefined, isFunction } from 'apollo-library/utils/common'

import { DATE_FORMAT, TIME_FORMAT_hh_mm_A } from 'apollo-library/constants/general'

import calendarMessages from 'apollo-library/messages/rc-calendar'
import enUS from 'rc-calendar/lib/locale/en_US'

import Input from 'apollo-library/components/Forms/Input'

/**
 * Date Picker form component
 * @see http://momentjs.com/docs/#/parsing/string-format/
 * @see https://www.npmjs.com/package/rc-calendar
 *
 * @property {string} [yearFormat=YYYY] Moment format param
 * @property {string} [dateFormat=DATE_FORMAT] Moment format param
 * @property {string} [dayFormat=D] Moment format param
 * @property {string} [dateTimeFormat=DATE_FORMAT TIME_FORMAT_hh_mm_A] Moment format param
 * @property {string} [monthFormat=MMMM] Moment format param
 * @property {boolean} [monthBeforeYear=true] Moment format param
 * @property {Object} [inputProps={}] Moment format param
 * @property {Object} [calendarProps={}] Moment format param
 * @property {Object} [datePickerProps={}] Moment format param
 */
export class DatePicker extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    formProps: PropTypes.object,
    disabled: PropTypes.bool,
    yearFormat: PropTypes.string,
    dateFormat: PropTypes.string,
    dayFormat: PropTypes.string,
    dateTimeFormat: PropTypes.string,
    monthFormat: PropTypes.string,
    monthBeforeYear: PropTypes.bool,
    inputProps: PropTypes.object,
    calendarProps: PropTypes.object,
    datePickerProps: PropTypes.object,
  }

  static defaultProps = {
    disabled: false,
    yearFormat: 'YYYY',
    dateFormat: DATE_FORMAT,
    dayFormat: 'D',
    dateTimeFormat: `${DATE_FORMAT} ${TIME_FORMAT_hh_mm_A}`,
    monthFormat: 'MMMM',
    monthBeforeYear: true,
    formProps: {},
    inputProps: {},
    calendarProps: {},
    datePickerProps: {},
  }

  /**
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.locale = {}

    this.renderInput = this.renderInput.bind(this)
    this.handleRCDatePickerChange = this.handleRCDatePickerChange.bind(this)
  }

  /**
   * Handle rc-datepicker change component
   *
   * @param {Moment} date
   */
  handleRCDatePickerChange(date) {
    const {
      onChange: dpOnChange,
      formProps: { onChange: fpOnChange },
      calendarProps: { onChange: rcOnChange },
    } = this.props

    // React component Calendar onChange
    if (isFunction(rcOnChange)) {
      rcOnChange(date)
    }

    var formattedDate = ''
    if (moment.isMoment(date)) {
      formattedDate = date.format(this.getMomentFormat())
    }

    // DatePicker component onChange
    if (isFunction(dpOnChange)) {
      dpOnChange(formattedDate)
    }

    // Form component formProps onChange
    if (isFunction(fpOnChange)) {
      fpOnChange(formattedDate)
    }
  }

  /**
   * Get format for moment by time picker usage
   *
   * @return {string}
   */
  getMomentFormat() {
    const {
      calendarProps: { timePicker },
      dateFormat,
      dateTimeFormat
    } = this.props

    if (isDefined(timePicker)) {
      return dateTimeFormat
    }

    return dateFormat
  }

  /**
   * Prepare locale for calendar component
   *
   * @return {Object}
   */
  getCalendarLocale() {
    // Will be do only one
    if (Object.keys(this.locale).length > 0) {
      return this.locale
    }

    const {
      intl: { formatMessage }
    } = this.props

    Object.keys(enUS).forEach((key) => {
      this.locale[key] = enUS[key]

      if (isDefined(calendarMessages[key])) {
        this.locale[key] = formatMessage(calendarMessages[key])
      }

      if (isDefined(this.props[key])) {
        this.locale[key] = this.props[key]
      }
    })

    return this.locale
  }

  /**
   * Render input element for datepicker
   *
   * @return {ReactElement}
   */
  renderInput() {
    const {
      inputName,
      formProps,
      inputProps,
      disabled,
    } = this.props
    var value = formProps.value

    if (moment.isMoment(formProps.value)) {
      value = formProps.value.format(this.getMomentFormat())
    }

    return (
      <Input
        disabled={disabled}
        {...inputProps}
        inputName={inputName}
        formProps={{...formProps, value}}
      />
    )
  }

  /**
   * Render calendar component for datepicker
   *
   * @return {ReactElement}
   */
  renderCalendar() {
    const {
      className,
      calendarProps
    } = this.props

    return (
      <RCCalendar
        className={className}
        {...calendarProps}
        locale={this.getCalendarLocale()}
        format={this.getMomentFormat()}
      />
    )
  }

  /**
   * Render component
   *
   * @return {ReactElement}
   */
  render() {
    const {
      disabled,
      formProps: { value },
      datePickerProps,
    } = this.props
    var rcValue = moment(value, this.getMomentFormat())

    if (rcValue.isValid() === false) {
      rcValue = undefined
    }

    return (
      <RCDatePicker
        animation="slide-up"
        disabled={disabled}
        {...datePickerProps}
        value={rcValue}
        calendar={this.renderCalendar()}
        onChange={this.handleRCDatePickerChange}
      >
        {this.renderInput}
      </RCDatePicker>
    )
  }
}

export default injectIntl(DatePicker)
