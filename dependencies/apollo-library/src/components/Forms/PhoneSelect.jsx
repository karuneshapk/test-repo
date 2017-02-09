import React, { Component, PropTypes } from 'react';
import { composeClassName } from 'apollo-library/utils/components'
import {
  LABEL_POSITION,
  HELP_BLOCK_POSITION
} from 'apollo-library/constants/components'
import { generateKey } from 'apollo-library/utils/math'
import { isUndefined, isDefined } from 'apollo-library/utils/common'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'

/**
 * Form component for insetring phone number with select of country codes
 */
export default class PhoneSelect extends Component {
  static propTypes = {
    initialValue: PropTypes.shape({
      number: PropTypes.string,
      countryCode: PropTypes.string
    }),
    countryCodes: PropTypes.array,
    formProps: PropTypes.object,
    disabled: PropTypes.bool,
    groupClassName: PropTypes.string,
    inputName: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    helpBlock: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    helpBlockClassName: PropTypes.string,
    helpBlockPosition: PropTypes.string,
    noValidation: PropTypes.string,
    id: PropTypes.string,
    labelPosition: PropTypes.string,
    validationClassName: PropTypes.string,
    classNameCountryCode: PropTypes.string,
    classNameNumber: PropTypes.string,
    onChange: PropTypes.func,
    inputGroupClassName: PropTypes.string
  };

  static defaultProps = {
    labelPosition: LABEL_POSITION.BEFORE,
    formProps: {
      value: {
        number: '',
        countryCode: ''
      }
    },
    countryCodes: [],
    initialValue: {}
  };

  /**
   * Constructor
   */
  constructor() {
    super(...arguments)

    this.localId = undefined
    this.onChange = this.onChange.bind(this)
    this.onFieldBlur = this.onFieldBlur.bind(this)

    /* input refs */
    this.countryCodeInput = undefined
    this.numberInput = undefined
  }

  /**
   * Create random id if not filled
   */
  componentDidMount() {
    const {
      id,
      label,
      formProps,
      initialValue
    } = this.props

    if (isDefined(label) && isUndefined(id)) {
      this.localId = generateKey()
    } else {
      this.localId = id
    }

    /* initial value */
    if (initialValue && formProps.onChange) {
      formProps.onChange(this.props.initialValue);
    }
  }

  /**
   * Create phone object from inputs
   */
  onChange() {
    const {
      onChange,
      formProps: {
        onChange: formOnChange
      }
    } = this.props

    const newValue = {
      countryCode: this.countryCodeInput.value,
      number: this.numberInput.value
    }

    /* custom onChange */
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }

    /* formProps onChange */
    if (formOnChange && typeof formOnChange === 'function') {
      formOnChange(newValue);
    }
  }

  /**
   * Handle field blur event
   */
  onFieldBlur() {
    // a hack to check if the user is moving from one field to another
    // inside the DateInput component, or left the component all together
    window.setTimeout(() => {
      if (document.activeElement !== this.countryCodeInput
          && document.activeElement !== this.numberInput) {
        this.props.formProps.onBlur()
      }
    }, 100)
  }

  /**
   * Render country code select
   *
   * @param  {array} countryCodes
   * @param  {string} countryCode
   * @param  {string} classNameCountryCode
   * @return {ReactElement}
   */
  renderCountryCode(countryCodes, countryCode, classNameCountryCode = '') {
    const {
      initialValue,
      formProps: {
        onFocus
      }
    } = this.props

    if(countryCodes.length < 1) {
      return null
    }

    return (
      <select
        className={classNameCountryCode}
        name="countryCode"
        onChange={this.onChange}
        ref={(input) => this.countryCodeInput = input}
        disabled={this.props.disabled}
        defaultValue={initialValue.countryCode}
        onFocus={onFocus}
        onBlur={this.onFieldBlur}
      >
        {countryCodes.map((item) => {
          return (
            <option
              key={`${this.props.inputName}@${item.value}`}
              value={item.value}
            >
              {item.name}
            </option>)
        })}
      </select>
    )
  }

  /**
   * Render input for number
   *
   * @param  {string} number
   * @param  {string} id DOM id
   * @param  {string} classNameNumber
   * @return {ReactElement}
   */
  renderNumber(number, id, classNameNumber = '') {
    const {
      formProps: {
        onFocus
      }
    } = this.props

    return (
      <input
        className={classNameNumber}
        name="number"
        defaultValue={this.props.initialValue.number}
        onChange={this.onChange}
        id={id}
        ref={(input) => this.numberInput = input}
        disabled={this.props.disabled}
        onFocus={onFocus}
        onBlur={this.onFieldBlur}
      />
    )
  }

  /**
   * Render common label for both inputs
   *
   * @param  {string|ReactElement} label
   * @param  {string} id
   * @return {ReactElement}
   */
  renderLabel(label, id) {
    return (
      <label htmlFor={id}>
        {label}
        {this.renderHelpBlock()}
      </label>
    )
  }

  /**
   * Render help block
   *
   * @return {ReactElement}
   */
  renderHelpBlock() {
    const {
      helpBlock,
      helpBlockPosition,
      helpBlockClassName
    } = this.props

    const helpBlockClasses = composeClassName(
      'help-block',
      (helpBlockPosition !== HELP_BLOCK_POSITION.VALIDATION ? 'no-validation-control' : false),
      (helpBlockPosition === HELP_BLOCK_POSITION.AFTER_LABEL ? 'after-label' : false),
      (helpBlockPosition === HELP_BLOCK_POSITION.AFTER_INPUT ? 'after-input' : false),
      (helpBlockPosition === HELP_BLOCK_POSITION.VALIDATION ? 'validation' : false),
      helpBlockClassName
    )

    return (
      <span className={helpBlockClasses}>
        {helpBlock}
      </span>
    )
  }

  /**
   * Render validation messages
   *
   * @return {ReactElement}
   */
  renderErrors() {
    const {
      formProps: {
        error
      },
      validationClassName
    } = this.props

    return (
      <ValidationMessage
        show={!!error}
        className={validationClassName}
        message={error}
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
      formProps: {
        value = {},
        error
      },
      classNameCountryCode,
      classNameNumber,
      countryCodes,
      groupClassName,
      label,
      disabled,
      noValidation,
      labelPosition,
      inputGroupClassName
    } = this.props

    const {
      number,
      countryCode,
    } = value

    const groupClasses = composeClassName(
      error ? 'has-error' : false,
      disabled ? 'disabled' : false,
      'form-group',
      groupClassName
    )

    return (
      <div className={groupClasses}>
        {labelPosition === LABEL_POSITION.BEFORE && label &&
          this.renderLabel(label, this.localId)
        }
        <div className={inputGroupClassName}>
          {this.renderCountryCode(countryCodes, countryCode, classNameCountryCode)}
          {this.renderNumber(number, this.localId, classNameNumber)}
        </div>
        {labelPosition === LABEL_POSITION.AFTER && label &&
          this.renderLabel(label, this.localId)
        }
        {error && !noValidation && this.renderErrors()}
      </div>
    );
  }
}
