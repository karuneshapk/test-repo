import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { filterButtonProps } from 'apollo-library/utils/props'
import { composeClassName } from 'apollo-library/utils/components'
import { CONTEXTUAL_COLORS } from 'apollo-library/constants/components'

/**
 * Button component
 *
 * @property {String} type - One of ['button', 'submit', 'reset'] default: button
 * @property {Function} onClick - click callback
 * @property {String} option - One of ['default', 'primary', 'success', 'info',
 *   'warning', 'danger', 'link'] default: default
 * @property {String} size - One of ['lg', 'large', 'sm', 'small', 'xs',
 *  'xsmall', false] default: false
 * @property {Boolean} active
 * @property {Boolean} disabled
 * @property {String} iconType - icon in the button (use font-awesome classes)
 * @property {Boolean} withIcon - whether it has icon
 *
 * @module
 */
export class Button extends Component {

  static propTypes = {
    type: PropTypes.oneOf([ 'button', 'submit', 'reset' ]),
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
    iconType: PropTypes.string,
    withIcon: PropTypes.bool,
    formStatusProps: PropTypes.object,
    submittingText: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
  }

  static defaultProps = {
    type: 'button',
    option: CONTEXTUAL_COLORS.DEFAULT,
    size: false
  }

  /**
   * @return {HTMLElement} button dom node
   */
  getButtonComponent() {
    return this.refs.button
  }

  /**
   * Render button component by params
   *
   * @override
   */
  render() {
    const {
      type,
      option,
      size,
      active,
      disabled,
      className,
      children,
      onClick,
      iconType,
      submittingText,
      formStatusProps,
      onBlur,
      ...props
    } = this.props

    const classes = composeClassName(
      'btn',
      `btn-${option}`,
      size && `btn-${size}`,
      active && 'active',
      className
    )
    const iconClasses = composeClassName(
      'fa',
      iconType && 'margin-r-s',
      `fa-${iconType}`
    )

    const isDisabled = disabled || formStatusProps && formStatusProps.submitting

    const content = formStatusProps && formStatusProps.submitting && submittingText
      ? submittingText
      : children

    return (
      <button
        ref="button"
        type={type}
        className={classes}
        disabled={isDisabled}
        onClick={onClick}
        onBlur={onBlur || (() => {})}
        ref="button"
        {...filterButtonProps(props)}
      >
        {iconType &&
          <i className={iconClasses}></i>
        }
        {content}
      </button>
    )
  }

}

export default Button
