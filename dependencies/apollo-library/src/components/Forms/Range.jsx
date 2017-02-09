import React, { Component, PropTypes } from 'react'
import Slider from 'rc-slider'

import { composeClassName } from 'apollo-library/utils/components'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'

/**
 * Range form component
 * To more property setting @see https://www.npmjs.com/package/rc-slider
 * Need to resolf syles ~rc-slider/assets/index.css
 */
export class Range extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    groupClassName: PropTypes.string,
    validationClassName: PropTypes.string,
    disabled: PropTypes.bool,
    noValidation: PropTypes.bool,
    formProps: PropTypes.object,
    onChange: PropTypes.func,
    onAfterChange: PropTypes.func
  }

  static defaultProps = {
    disabled: false,
    noValidation: false
  }

  /**
   * @constructor
   * @extends {React.Componet}
   */
  constructor() {
    super(...arguments)

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnAfterChange = this.handleOnAfterChange.bind(this)
  }

  /**
   * Handle range onChange
   *
   * @param {number} value
   */
  handleOnChange(value) {
    const {
      formProps,
      onChange
    } = this.props

    if (typeof formProps.onChange === 'function') {
      formProps.onChange(value)
    }
    if (typeof onChange === 'function') {
      onChange(value)
    }
  }

  /**
   * Handle range onAfterChange
   *
   * @param {number} value
   */
  handleOnAfterChange(value) {
    const {
      formProps,
      onAfterChange
    } = this.props

    if (typeof formProps.onChange === 'function') {
      formProps.onChange(value)
    }
    if (typeof onAfterChange === 'function') {
      onAfterChange(value)
    }
  }

  /**
   * Component renderer
   *
   * @return {ReactNode}
   */
  render() {
    const {
        inputName,
        disabled,
        formProps: {error},
        className,
        groupClassName,
        validationClassName,
        noValidation,
        ...props
      } = this.props,
      invalid = !!error,
      message = error,
      groupClasses = composeClassName(
        invalid && 'has-error',
        disabled && 'disabled',
        groupClassName
      ),
      handlers = {
        onChange: this.handleOnChange,
        onAfterChange: this.handleOnAfterChange
      }

    return (
      <div key={inputName} className={groupClasses}>
        <Slider
          className={className}
          disabled={disabled}
          {...props}
          {...handlers}
        />
        {invalid && !noValidation &&
          <ValidationMessage
            show={invalid}
            className={validationClassName}
            message={message}
          />
        }
      </div>
    )
  }

}

export default Range
