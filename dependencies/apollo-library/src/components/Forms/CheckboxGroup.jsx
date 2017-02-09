import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List } from 'immutable'

import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import Checkbox from 'apollo-library/components/Forms/Checkbox'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Checkbox group input component
 *
 * @property {Array<{id: string, label: string|ReactNode}>} options - list of checkbox values and labels
 * @property {Boolean} noValidation - whether to show the validation
 * @property {String} groupClassName - additional css classes for input-group
 * @property {String} validationClassName - additional css classes for validation text
 * @property {String} preselectedIds - preselected IDs of checkboxes
 * @property {Array} initialValue - Array of checked values
 *
 * @module
 */
export class CheckboxGroup extends Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
      ])
    })).isRequired,
    noValidation: PropTypes.bool,
    groupClassName: PropTypes.string,
    validationClassName: PropTypes.string,
    preselectedIds: ImmutablePropTypes.list,
    initialValue: PropTypes.array
  }

  static defaultProps = {
    noValidation: false,
    preselectedIds: List()
  }

  updateGroupValue(itemName, event) {
    const {
      onChange,
      value = [],
      displayValue
    } = this.props.formProps

    if (event.target.checked) {
      value.push(itemName)
    } else {
      let index = value.indexOf(itemName)
      value.splice(index, 1)
    }

    onChange(value, displayValue)
  }

  /**
   * Handles events from checkboxes and sends them to the form
   */
  handleCheckboxEvents(itemName, event) {
    const { formProps } = this.props

    switch (event.type) {
      
      case 'change': {
        this.updateGroupValue(itemName, event)
        break
      }
      
      case 'blur': {
        formProps.onBlur(event)
        break
      }
      
      case 'focus': {
        formProps.onFocus(event)
        break
      }

    }
  }

  render() {
    const {
      noValidation,
      className,
      validationClassName,
      formProps: { error, value, displayValue },
      formProps,
      options,
      preselectedIds
    } = this.props

    const invalid = (!!error)

    const classes = composeClassName(
      invalid && 'has-error',
      className
    )

    const values = List(value || [])
    const displayValues = displayValue || options

    return (
      <div className={classes}>
        {displayValues && displayValues.map(checkbox => {
          const checked = preselectedIds.includes(checkbox.id)

          return (
            <Checkbox
              defaultChecked={checked}
              noValidation={true}
              key={checkbox.id}
              formProps={{
                checked: (values.includes(checkbox.id))
              }}
              inputName={checkbox.id}
              label={checkbox.label}
              onChange={this.handleCheckboxEvents.bind(this, checkbox.id)}
              onBlur={this.handleCheckboxEvents.bind(this, checkbox.id)}
              onFocus={this.handleCheckboxEvents.bind(this, checkbox.id)}
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

export default CheckboxGroup
