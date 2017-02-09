import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import { isUndefined, isDefined } from 'apollo-library/utils/common'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import InputLabel from 'apollo-library/components/Forms/InputLabel'
import { parsePhoneNumber } from 'apollo-library/utils/phone'
import { generateKey } from 'apollo-library/utils/math'
import { LABEL_POSITION } from 'apollo-library/constants/components'

/**
 * Phone number input component
 *
 * @property {String} placeholder - phone number placeholder text
 * @property {Boolean} noValidation - whether to show the validation
 * @property {String} groupClassName - additional css classes for input-group
 * @property {String} validationClassName - additional css classes for validation text
 * @property {Boolean} disabled - whether the input is disabled
 * @property {Object} formProps - properties of the input field kept by redux-form
 * @property {String} codePlaceholder - phone code placeholder text
 * @property {string} label
 * @property {Object} labelProps
 * @property {LABEL_POSITION} labelPosition
 *
 * @module
 */
export class Phone extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    codePlaceholder: PropTypes.string,
    noValidation: PropTypes.bool,
    groupClassName: PropTypes.string,
    validationClassName: PropTypes.string,
    disabled: PropTypes.bool,
    formProps: PropTypes.object,
    display: PropTypes.string,
    label: PropTypes.any,
    labelProps: PropTypes.object,
    labelPosition: PropTypes.oneOf([LABEL_POSITION.BEFORE, LABEL_POSITION.AFTER]),
  }

  static defaultProps = {
    noValidation: false,
    disabled: false,
    display: 'inline-block',
    labelPosition: LABEL_POSITION.BEFORE
  }

  constructor() {
    super(...arguments)
    this.code = ''
    this.number = ''
  }

  componentWillMount() {
    const {
      code: countryCode,
      number: phoneNumber
    }  = parsePhoneNumber(this.props.initialValue)

    this.code = countryCode
    this.number = phoneNumber

    const { id, label } = this.props

    this._id = id

    if (isDefined(label) && isUndefined(id)) {
      this._id = generateKey()
    }
  }

  componentDidMount() {
    if (this.props.initialValue && this.props.formProps.onChange) {
      this.props.formProps.onChange(this.props.initialValue);
    }
  }

  updateActualValue(isCode, updatedValue) {
    if (isCode) {
      this.code = updatedValue
    } else {
      this.number = updatedValue
    }

    const newValue = `+${this.code}${this.number}`

    if (this.props.formProps.onChange) {
      this.props.formProps.onChange(newValue);
    }
  }

  render() {
    const {
      noValidation,
      groupClassName,
      validationClassName,
      className,
      disabled,
      formProps: {error},
      placeholder,
      codePlaceholder,
      label,
      labelProps,
      labelPosition,
    } = this.props

    const invalid = (!!error)

    const classes = composeClassName(
      'form-control',
      'inline-block',
      'width-auto',
      'margin-r-s',
      className
    )

    const groupClasses = composeClassName(
      invalid && 'has-error',
      groupClassName,
      'width100'
    )

    const prefixClasses = composeClassName(
      'inline-block',
      'margin-r-s'
    )

    const {
      className: labelClasses,
      ...labelRestProps
    } = labelProps || {}

    const labelClassName = (labelClasses || 'show')

    return (
      <div className={groupClasses}>
        {labelPosition === LABEL_POSITION.BEFORE && label &&
          <InputLabel
            htmlFor={this._id}
            label={label}
            className={labelClassName}
            {...labelRestProps}
          />
        }
        <div className={prefixClasses}>{'+'}</div>
        <input
          className={classes}
          placeholder={codePlaceholder}
          type="text"
          disabled={disabled}
          value={this.code}
          maxLength="3"
          size="3"
          onChange={event => this.updateActualValue(true, event.currentTarget.value)}
          id={this._id}
        />
        <input
          className={classes}
          placeholder={placeholder}
          type="text"
          disabled={disabled}
          value={this.number}
          size="10"
          onChange={event => this.updateActualValue(false, event.currentTarget.value)}
        />
        {labelPosition === LABEL_POSITION.AFTER &&
          label &&
        <InputLabel htmlFor={this._id} label={label} {...labelProps} />}
        {noValidation
          ? null
          : <ValidationMessage
              show={invalid}
              className={validationClassName}
              message={error}
            />
        }
      </div>
    )
  }

}

export default Phone
