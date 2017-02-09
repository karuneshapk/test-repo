import React, { Component, PropTypes } from 'react'

import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import InputLabel from 'apollo-library/components/Forms/InputLabel'
import { LABEL_POSITION } from 'apollo-library/constants/components'
import { isUndefined, isDefined, isFunction, isEmptyString } from 'apollo-library/utils/common'
import { generateKey } from 'apollo-library/utils/math'
import { trim } from 'apollo-library/utils/common'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Date input component
 *
 * @property {Boolean} noValidation - whether to show the validation
 * @property {String} groupClassName - additional css classes for input-group
 * @property {String} validationClassName - additional css classes for validation text
 * @property {Boolean} disabled - whether the input is disabled
 * @property {string} label
 * @property {Object} labelProps
 * @property {LABEL_POSITION} labelPosition
 * @property {Object} formProps - properties of the input field kept by redux-form
 *
 * @module
 */
export class DateInput extends Component {

  static propTypes = {
    id: PropTypes.string,
    noValidation: PropTypes.bool,
    groupClassName: PropTypes.string,
    validationClassName: PropTypes.string,
    disabled: PropTypes.bool,
    formProps: PropTypes.object,
    label: PropTypes.any,
    labelProps: PropTypes.object,
    labelPosition: PropTypes.oneOf([ LABEL_POSITION.BEFORE, LABEL_POSITION.AFTER ]),
    initialValue: PropTypes.any,
    noMaxWidth: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    noValidation: false,
    disabled: false,
    labelPosition: LABEL_POSITION.BEFORE,
    noMaxWidth: false,
  }

  /**
   * Before mount componnet create unique id for element
   */
  componentWillMount() {
    const { id, label } = this.props

    this.id = id

    if (isDefined(label) && isUndefined(id)) {
      this.id = generateKey()
    }
  }

  /**
   * After mount componnet parse date to field values
   */
  componentDidMount() {
    const { initialValue } = this.props
    const { year, month, day } = this.calculateDisplayValues(initialValue)

    if (!isEmptyString(year) && !isEmptyString(month) && !isEmptyString(day)) {
      this.setInitialValue(year, month, day)
    }
  }

  /**
   * Handle field blur event
   */
  onFieldBlur() {
    // a hack to check if the user is moving from one field to another
    // inside the DateInput component, or left the component all together
    window.setTimeout(() => {
      if (document.activeElement !== this.refs.month
          && document.activeElement !== this.refs.year) {
        const {
          onBlur
        } = this.props.formProps || {}

        if (isFunction(onBlur)) {
          onBlur()
        }
      }
    }, 100)
  }

  /**
   * Set initial value for form
   *
   * @param {string|number} year
   * @param {string|number} month
   * @param {string|number} day
   */
  setInitialValue(year, month, day) {
    const newValue = year.concat('-')
      .concat(month).concat('-')
      .concat(day)
    if (this.props.formProps.onChange) {
      this.props.formProps.onChange(newValue)
    }
  }

  /**
   * Parse date to usable values
   *
   * @param {string} value
   * @return {{year: string|number, month: string|number, day: string|number}}
   */
  calculateDisplayValues(value = '--') {
    const dateArr = value.split('T')[0].split('-')
    return (dateArr.length === 3)
      ? {
        year: dateArr[0],
        month: dateArr[1],
        day: dateArr[2]
      }
      : {
        year: '',
        month: '',
        day: ''
      }
  }

  /**
   * Update new value
   *
   * @param {Event} event
   * @param {string} oldValue
   * @param {string} newValuePiece
   * @param {string} datePart One of [day, month, year]
   */
  updateActualValue(event, oldValue = '--', newValuePiece, datePart) {
    var newValue
    const valuesList = oldValue.split('-')
    const value0 = isDefined(valuesList[0]) ? valuesList[0] : ''
    const value1 = isDefined(valuesList[1]) ? valuesList[1] : ''
    const value2 = isDefined(valuesList[2]) ? valuesList[2] : ''

    switch (datePart) {

      case 'day': {
        newValue = value0.concat('-')
          .concat(value1).concat('-')
          .concat(newValuePiece)

        if (this.refs.day.selectionStart === 2) {
          this.refs.month.focus()
          this.refs.month.select()
        }
        break
      }

      case 'month': {
        newValue = value0.concat('-')
          .concat(newValuePiece).concat('-')
          .concat(value2)
        if (this.refs.month.selectionStart === 2) {
          this.refs.year.focus()
          this.refs.year.select()
        }
        break
      }

      case 'year': {
        newValue = newValuePiece.concat('-')
          .concat(value1).concat('-')
          .concat(value2)
        break
      }
    }

    const realNewValue = newValue !== '--' ? newValue : ""

    if (this.props.formProps.onChange) {
      this.props.formProps.onChange(realNewValue)
    }

    if (this.props.onChange) {
      event.target.value = realNewValue
      this.props.onChange(event)
    }
  }

  /**
   * Renders date input
   * @returns {ReactElement}
   */
  render() {
    const {
      noValidation,
      groupClassName,
      validationClassName,
      className,
      disabled,
      formProps: { error, value },
      label,
      labelProps,
      labelPosition,
      noMaxWidth,
    } = this.props

    const invalid = (!!error)

    const baseClasses = [
      'form-control',
      'width-auto',
      'inline-block',
    ]

    const classes = composeClassName.apply(this, baseClasses.concat([
      'margin-r-s',
      className
    ]))

    const lastInputClasses = composeClassName.apply(this, baseClasses.concat([
      className
    ]))

    const widthClass = noMaxWidth ? false : 'width100'

    const groupClasses = composeClassName(
      invalid && 'has-error',
      groupClassName,
      widthClass,
      'form-group'
    )

    const { year, month, day } = this.calculateDisplayValues(value)

    const {
      className: labelClasses,
      ...labelRestProps
    } = labelProps || {}

    const labelClassName = labelClasses || 'show'

    return (
        <div className={groupClasses}>
          <div className="date-input-group">
            {labelPosition === LABEL_POSITION.BEFORE && label &&
              <InputLabel
                htmlFor={this.id}
                label={label}
                className={labelClassName}
                {...labelRestProps}
              />
            }
              <input
                className={classes}
                type="text"
                disabled={disabled}
                value={day}
                ref="day"
                size="2"
                maxLength="2"
                onChange={(event) => {
                  this.updateActualValue(event, value, event.target.value, 'day')
                }}
                onBlur={event => {
                  this.onFieldBlur(event)
                  const { target: { value: day } } = event
                  if (day && trim(day).length == 1) {
                    this.updateActualValue(event, value, `0${day}`, 'day')
                  }
                }}
                id={this.id}
              />
              <input
                className={classes}
                type="text"
                disabled={disabled}
                value={month}
                ref="month"
                size="2"
                maxLength="2"
                onChange={(event) => {
                  this.updateActualValue(event, value, event.target.value, 'month')
                }}
                onBlur={event => {
                  this.onFieldBlur(event)
                  const { target: { value: month } } = event

                  if (month && trim(month).length === 1) {
                    this.updateActualValue(event, value, `0${month}`, 'month')
                  }
                }}
              />
              <input
                className={lastInputClasses}
                type="text"
                disabled={disabled}
                value={year}
                ref="year"
                size="4"
                maxLength="4"
                onChange={(event) => {
                  this.updateActualValue(event, value, event.target.value, 'year')
                }}
                onBlur={event => this.onFieldBlur(event)}
              />
              {labelPosition === LABEL_POSITION.AFTER && label &&
                <InputLabel
                  htmlFor={this.id}
                  label={label}
                  {...labelProps}
                />
              }
          </div>
          {noValidation
            ? null
            :
            (
            <ValidationMessage
              show={invalid}
              className={validationClassName}
              message={error}
            />
            )
          }
        </div>
    )
  }

}

export default DateInput
