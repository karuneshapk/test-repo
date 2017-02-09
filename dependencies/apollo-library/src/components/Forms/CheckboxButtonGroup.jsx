import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { composeClassName } from 'apollo-library/utils/components'
import { generateKey } from 'apollo-library/utils/math'
import { isUndefined } from 'apollo-library/utils/common'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import CheckboxButton from 'apollo-library/components/Forms/CheckboxButton'

/**
 * CheckboxButton group input component
 *
 * @property {string} inputName
 *
 * @module
 */
export class CheckboxButtonGroup extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    buttons: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      ImmutablePropTypes.list
    ]).isRequired,
    type: PropTypes.oneOf(['text']),
    validationClassName: PropTypes.string,
    noValidation: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    noValidation: false,
    type: 'text',
    disabled: false
  }

  constructor(...args) {
    super(...args)

    this.handleEvents = this.handleEvents.bind(this)
  }

  componentWillMount() {
    const { id } = this.props

    this.id = id

    if (isUndefined(id)) {
      this.id = generateKey()
    }
  }

  /**
   * Handle events
   */
  handleEvents(event) {
    const {
      formProps,
      onChange,
      onBlur,
      onFocus
    } = this.props

    switch (event.type) {
      
      case 'change': {
        formProps.onChange(event);
        if (onChange === 'function') {
          onChange(event)
        }
        break
      }

      case 'blur': {
        formProps.onBlur(event);
        if (onBlur === 'function') {
          onBlur(event)
        }
        break
      }

      case 'focus': {
        formProps.onFocus(event);
        if (onFocus === 'function') {
          onFocus(event)
        }
        break
      }

    }
  }

  render() {
    const {
      noValidation,
      className,
      validationClassName,
      formProps: {error, value},
      formProps,
      initialValue,
      buttons,
      radios,
      inputName,
      disabled
    } = this.props

    const invalid = (!!error)

    const classes = composeClassName(
      invalid && 'has-error',
      className,
      'form-group',
      'checkbox-buttons'
    )

    return (
      <div className={classes}>
        {buttons && buttons.map((options, i) => {
          const buttonValue = options.value
          return (
            <CheckboxButton
              radio={radios}
              inputName={`${inputName}:${buttonValue}`}
              name={`RadioGroup: ${inputName}`}
              defaultChecked={(initialValue === buttonValue)}
              formProps={{
                checked: (value === buttonValue),
                value: buttonValue
              }}
              key={`RadioGroup:${inputName}:${i}`}
              onChange={this.handleEvents}
              onBlur={this.handleEvents}
              onFocus={this.handleEvents}
              disabled={disabled}

              {...options}
            />
          )
        })}
        {!noValidation &&
          <ValidationMessage
            show={invalid}
            className={validationClassName}
            message={error}
          />
        }
      </div>
    )
  }

}

export default CheckboxButtonGroup

