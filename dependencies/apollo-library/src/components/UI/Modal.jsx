import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import SectionHeader from 'apollo-library/components/UI/SectionHeader'
import DismissButton from 'apollo-library/components/UI/DismissButton'
import FooterButtons from 'apollo-library/components/UI/FooterButtons'

/**
 * Modal dialog element
 *
 * @property {bool} show - show or hide the modal dialog, default is "false"
 * @property {bool} dismissButton - whether to show the button for closing the modal
 * @property {string|element} dismissButtonText - text for dismiss button
 * @property {string} dismissButtonClasses - css classes for dismiss button
 * @property {bool} sectionHeader - whether to add a section header to modal
 * @property {string} headerClassName - css classes for section header
 * @property {string} headerText - text to add to a section header
 * @property {bool} footerButtons - whether to add footer buttons to modal
 * @property {string} footerButtonsClasses - css classes for footer buttons
 * @property {function} confirmClick - footer buttons confirmation button click callback
 * @property {function} cancelClick
    footer buttons cancel button, and/or dismiss button click callback
 * @property {string} confirmText - text for the confirmation button
 * @property {string} orText - text for between confirmation and cancel button
 * @property {string} cancelText - text for the cancel button
 * @property {string} overlayColor - color of the modal backdrop, "black" of "white"
 *
 * @module
 */
export class Modal extends Component {

  static childContextTypes = {
    moduleName: PropTypes.string
  }

  static propTypes = {
    show: PropTypes.bool,
    dismissButton: PropTypes.bool,
    dismissButtonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    dismissButtonClasses: PropTypes.string,
    sectionHeader: PropTypes.bool,
    headerClassName: PropTypes.string,
    headerText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    footerButtons: PropTypes.bool,
    footerButtonsClasses: PropTypes.string,
    confirmClick: PropTypes.func,
    cancelClick: PropTypes.func,
    confirmText: PropTypes.string,
    orText: PropTypes.string,
    cancelText: PropTypes.string,
    confirmButtonProps: PropTypes.any,
    cancelButtonProps: PropTypes.any,
    overlayColor: PropTypes.oneOf([
      'white',
      'black'
    ]),
    size: PropTypes.oneOf([
      'sm',
      'md',
      'lg'
    ])
  }

  static defaultProps = {
    overlayColor: 'black',
    show: true,
    size: 'lg'
  }

  getChildContext() {
    return {
      moduleName: this.props.moduleName
    }
  }

  /**
   * Modal renderer
   *
   * @return {ReactNode}
   */
  render() {
    const {
      show,
      children,
      className,
      dismissButton,
      dismissButtonText,
      dismissButtonClasses,
      sectionHeader,
      headerClassName,
      headerText,
      footerButtons,
      footerButtonsClasses,
      confirmClick,
      cancelClick,
      confirmText,
      orText,
      cancelText,
      overlayColor,
      confirmButtonProps,
      cancelButtonProps,
      size
    } = this.props

    var modalClasses = composeClassName(
      'modal',
      show ? 'show' : 'hide'
    )

    var classes = composeClassName(
      'modal-dialog',
      `modal-${size}`,
      className
    )

    var overlayClasses = composeClassName(
      'modal-overlay',
      overlayColor
    )

    var footerClasses = composeClassName(
      'padding-m',
      footerButtonsClasses
    )

    return (
      <div>
        <div className={overlayClasses} />
        <div className={modalClasses}>
          <div className={classes}>
            <div className="modal-content">
              {sectionHeader &&
                <SectionHeader
                  className={headerClassName}
                  text={headerText}
                />
              }
              {dismissButton &&
                <DismissButton
                  onClick={cancelClick}
                  className={dismissButtonClasses}
                  buttonLabel={dismissButtonText}
                />
              }
              <div className="modal-body">
                {children}
              </div>
              {footerButtons &&
                <FooterButtons
                  className={footerClasses}
                  confirmClick={confirmClick}
                  cancelClick={cancelClick}
                  confirmText={confirmText}
                  orText={orText}
                  cancelText={cancelText}
                  confirmButtonProps={confirmButtonProps}
                  cancelButtonProps={cancelButtonProps}
                />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Modal
