import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import Button from 'apollo-library/components/Forms/Button'
import { composeClassName } from 'apollo-library/utils/components'
import CommonMessages from 'apollo-library/messages/common'

/**
 * Buttons for confirming or canceling the changes in the bottom of an element,
 * e.g. modal dialog
 *
 * @property {string|ReactNode} orText - "or" text
 * @property {*} confirmButtonProps - props for confirm button
 * @property {string|ReactNode} confirmText - text for confirm button
 * @property {function} confirmClick - click callback for confirm button
 * @property {*} cancelButtonProps - props for cancel button
 * @property {string|ReactNode} cancelText - text for cancel button
 * @property {function} cancelClick - click callback for cancel button
 * @property {boolean} confirmDisabled - should confirm button be disabled
 * @property {string} orTextClasses - classes for "or" text between buttons
 * @property {string|ReactNode|boolean} sugmittingText - text for confirm button
 * @property {Object} formStatusProps - props for form status
 *
 * @example
 * <FooterButtons
 *  confirmText={submitButtonText}
 *   submittingText={submittingText}
 *   confirmButtonProps={{
 *     option: 'primary'
 *   }}
 *   cancelText={cancelButtonText}
 *   cancelClick={onCancel}
 * />
 *
 * @module
 */
export class FooterButtons extends Component {

  static propTypes = {
    orText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    confirmButtonProps: PropTypes.any,
    confirmText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    confirmClick: PropTypes.func,
    cancelButtonProps: PropTypes.any,
    cancelText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    cancelClick: PropTypes.func,
    confirmDisabled: PropTypes.bool,
    orTextClasses: PropTypes.string,
    submittingText: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.bool,
      PropTypes.element
    ]),
    formStatusProps: PropTypes.object
  }

  static defaultProps = {
    confirmClick: () => {},
    cancelClick: () => {},
    confirmDisabled: false
  }

  /**
   * The water poured in slowly
   *
   * @returns {ReactNode}
   */
  render() {
    var {
      confirmClick,
      cancelClick,
      confirmText,
      orText,
      cancelText,
      className,
      confirmButtonProps,
      orTextClasses,
      cancelButtonProps,
      confirmDisabled,
      submittingText,
      formStatusProps,
      intl: { formatMessage }
    } = this.props

    var classes = composeClassName(
      'section-footer',
      'margin-t-xxl',
      'margin-t-2xl',
      className
    )

    const submitting = submittingText === true
      ? formatMessage(CommonMessages.saving)
      : submittingText

    return (
      <div className={classes}>
        <Button
          onClick={confirmClick}
          disabled={confirmDisabled}
          formStatusProps={formStatusProps}
          submittingText={submitting}
          {...confirmButtonProps}
        >
          {confirmText || formatMessage(CommonMessages.save)}
        </Button>
        <span className={orTextClasses || 'margin-l-m'}>
          {orText || formatMessage(CommonMessages.or)}
        </span>
        <Button
          option="link"
          onClick={cancelClick}
          {...cancelButtonProps}
        >
          {cancelText || formatMessage(CommonMessages.cancel)}
        </Button>
      </div>
    )
  }

}


export default injectIntl(FooterButtons)
