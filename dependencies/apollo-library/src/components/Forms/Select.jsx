import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { composeClassName } from 'apollo-library/utils/components'
import { isFunction } from 'apollo-library/utils/common'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import { filterInputProps } from 'apollo-library/utils/props'

/**
 * Select component
 *
 * @property {string} placeholder - placeholder text
 * @property {bool} showNullOption - display null selectable value
 * @property {bool} noValidation - whether to show the validation
 * @property {string} groupClassName - additional css classes for input-group
 * @property {string} inputName - additional css classes for input-group
 * @property {string} label - field label
 * @property {number|string} id - unique id
 * @property {bool} disabled - whether the input is disabled
 * @property {Object} formProps - properties of the input field kept by redux-form
 *
 * @module
 */
export class Select extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    noValidation: PropTypes.bool,
    showNullOption: PropTypes.bool,
    nullOptionText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    groupClassName: PropTypes.string,
    validationClassName: PropTypes.string,
    disabled: PropTypes.bool,
    formProps: PropTypes.object,
    inputName: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    display: PropTypes.string,
    options: PropTypes.oneOfType([
      PropTypes.array,
      ImmutablePropTypes.list
    ]),
    onChange: PropTypes.func
  }

  static defaultProps = {
    noValidation: false,
    showNullOption: true,
    nullOptionText: '---',
    disabled: false,
    display: 'inline-block',
    options: [],
    initialValue: ''
  }

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  /**
   * Handle and process select on change action
   */
  handleOnChange() {
    const {
      onChange,
      formProps
    } = this.props

    if (isFunction(onChange)) {
      onChange(...arguments)
    }

    if (isFunction(formProps.onChange)) {
      formProps.onChange(...arguments)
    }
  }

  /**
   * Renders <select> component
   *
   * @return {ReactNode}
   */
  render() {
    const {
      showNullOption,
      nullOptionText,
      noValidation,
      groupClassName,
      validationClassName,
      className,
      disabled,
      formProps: { error },
      formProps,
      display,
      options,
      inputName,
      label,
      id
    } = this.props

    const invalid = (!!error)

    const classes = composeClassName(
      'form-control',
      className
    )

    const groupClasses = composeClassName(
      invalid && 'has-error',
      groupClassName,
      display
    )

    const selectProps = filterInputProps(formProps)

    const inputId = (id || inputName)

    return (
      <div className={groupClasses}>
        {label &&
          <label htmlFor={inputId} key="label">
            {label}
          </label>
        }

        <select
          className={classes}
          disabled={disabled}
          {...selectProps}
          onChange={this.handleOnChange}
          id={inputId}
        >

          {showNullOption
            ? (
              <option key={`${inputName}@nullValue`} value="">
                {nullOptionText}
              </option>
              )
            : null
          }

          {options && options.map(option =>
            <option key={`${inputName}@${option.value}`} value={option.value}>
              {option.name}
            </option>
          )}
        </select>

        {noValidation
          ? null
          : (
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

export default Select
