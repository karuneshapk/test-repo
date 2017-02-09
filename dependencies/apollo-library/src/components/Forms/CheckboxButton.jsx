import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { composeClassName } from 'apollo-library/utils/components'
import BaseInput from 'apollo-library/components/Forms/BaseInput'
import { CONTEXTUAL_COLORS } from 'apollo-library/constants/components'
import { isUndefined } from 'apollo-library/utils/common'

/**
 * CheckboxButton component
 *
 * @property {Function} onClick - click callback
 * @property {String} option - One of ['default', 'primary', 'success', 'info',
 *   'warning', 'danger', 'link'] default: default
 * @property {String} size - One of ['lg', 'large', 'sm', 'small', 'xs',
 *  'xsmall', false] default: false
 * @property {Boolean} active
 * @property {Boolean} disabled
 *
 * @module
 */
export class CheckboxButton extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    option: PropTypes.oneOf(Map(CONTEXTUAL_COLORS).toArray()),
    size: PropTypes.oneOf([
      'lg',
      'md',
      'sm',
      'xs',
      false
    ]),
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    formStatusProps: PropTypes.object,
    submittingText: PropTypes.string
  }

  static defaultProps = {
    option: CONTEXTUAL_COLORS.DEFAULT,
    size: false
  }

  /**
   * Render button component by params
   *
   * @override
   */
  render() {
    const {
      option,
      size,
      active,
      disabled,
      className,
      children,
      onClick,
      checkboxClasses,
      labelClasses,
      formProps,
      formStatusProps,
      radio,
      ...props
    } = this.props

    const {
      defaultChecked,
      value,
      checked
    } = formProps

    const classes = composeClassName(
      'checkbox-button',
      'btn',
      `btn-${option}`,
      size && `btn-${size}`,
      active && 'active',
      checked && 'checked',
      className
    )

    const checkboxStyles = composeClassName(
      'checkbox-button-input',
      checkboxClasses
    )

    const labelStyles = composeClassName(
      'checkbox-button-label',
      labelClasses
    )

    const isDisabled = disabled
      || formStatusProps && formStatusProps.submitting;

    const checkboxFormProps = {
      ...formProps,
      checked: (formProps.hasOwnProperty('checked')
        ? (isUndefined(checked)
            ? formProps.checked
            : checked
          )
        : defaultChecked),
      value
    }

    return (
      <label
        className={classes}
        disabled={isDisabled}
        onClick={onClick}
      >
        <BaseInput
          className={checkboxStyles}
          type={radio ? 'radio' : 'checkbox'}
          formControled={false}
          postAddon={<span className="styled-checkbox" />}
          formProps={(!formProps.hasOwnProperty('checked')
            ? {
              defaultChecked,
              value
            }
            : checkboxFormProps)
          }
          {...props}
        />

        <div className={labelStyles}>
          {children}
        </div>
      </label>
    )
  }

}

export default CheckboxButton
