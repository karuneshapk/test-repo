import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import Radio from 'apollo-library/components/Forms/Radio'
import { LABEL_POSITION } from 'apollo-library/constants/components'
import InputLabel from 'apollo-library/components/Forms/InputLabel'
import { isUndefined, isDefined } from 'apollo-library/utils/common'
import { composeClassName } from 'apollo-library/utils/components'
import { generateKey } from 'apollo-library/utils/math'

/**
 * Radio group input component
 * @see {Radio}
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/#heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 *
 * @property {!string} inputName
 * @property {!Array<Object>} radioButtons Array witch configuration of Radio button
 * @property {string} label
 * @property {Object} labelProps
 * @property {LABEL_POSITION} labelPosition
 * @property {boolean} disabled
 *
 * @module
 */
export class RadioGroup extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    radioButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    labelPosition: LABEL_POSITION.BEFORE,
    disabled: false
  }

  /**
   * Handle events on radio button and send them to form component
   */
  handleRadioButton(event) {
    const {
      formProps,
      onChange,
      onBlur,
      onFocus,
    } = this.props

    switch (event.type) {
      
      case 'change': {
        formProps.onChange(event)
        typeof onChange === 'function' ? onChange(event) : null
        break
      }

      case 'blur': {
        formProps.onBlur(event)
        typeof onBlur === 'function' ? onBlur(event) : null
        break
      }

      case 'focus': {
        formProps.onFocus(event);
        typeof onFocus === 'function' ? onFocus(event) : null
        break
      }

    }
  }

  componentWillMount() {
    const { id, label } = this.props

    this._id = id

    if (isDefined(label) && isUndefined(id)) {
      this._id = generateKey()
    }
  }

  render() {
    const {
      noValidation,
      className,
      validationClassName,
      formProps: { error, value },
      formProps,
      initialValue,
      radioButtons,
      inputName,
      labelProps,
      label,
      labelPosition,
      disabled
    } = this.props

    const invalid = (!!error)
    const classes = composeClassName(
      invalid && 'has-error',
      className,
      'form-group'
    )

    const {
      className: labelClasses,
      ...labelRestProps
    } =  labelProps || {}

    const labelClassName = labelClasses || 'show'

    return (
      <div className={classes}>
        {labelPosition === LABEL_POSITION.BEFORE && label &&
          <InputLabel
            htmlFor={this._id}
            label={label}
            className={labelClassName}
            {...labelRestProps}
          />
        }
        {radioButtons && radioButtons.map((radioButtonOptions, i) => {
          const radioValue = radioButtonOptions.value
          const {
            disabled: radioButtonDisabled,
            ...restRadioButtonOptions
          } = radioButtonOptions

          return (
            <Radio
              inputName={`RadioGroup:${inputName}`}
              name={`RadioGroup:${inputName}`}
              defaultChecked={initialValue === radioValue}
              formProps={{
                checked: (value === radioValue)
              }}
              key={`RadioGroup:${inputName}:${i}`}
              onChange={this.handleRadioButton.bind(this)}
              onBlur={this.handleRadioButton.bind(this)}
              onFocus={this.handleRadioButton.bind(this)}
              disabled={disabled || radioButtonDisabled}
              {...restRadioButtonOptions}
            />
          )
        })}
        {labelPosition === LABEL_POSITION.AFTER && label &&
          <InputLabel htmlFor={this._id} label={label} {...labelProps} />
        }
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

export default RadioGroup
