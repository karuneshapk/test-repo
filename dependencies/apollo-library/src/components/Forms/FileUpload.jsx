import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'

import {
  filterInputProps,
  filterButtonProps
} from 'apollo-library/utils/props'

/**
 * File Upload Component
 *
 * @property {String} type - button type
 * @property {String} option - button option
 * @property {String} size - button size
 * @property {Boolean} active - add 'active' css class to button
 * @property {String} iconType - button icon type (from fontAwesome)
 * @property {Boolean} noValidation - don't show validation message
 * @property {String} groupClassName - component css classes
 * @property {String} validationClassName - validation text css classes
 * @property {String} display - component css display value
 * @property {Boolean} disabled - disable button
 * @property {Function} setFileName - callback to set the name of the chosen file;
 * will be called when file is chosen and called with the name of the file
 *
 * @module
 */
export class FileUpload extends Component {

  static propTypes = {
    type: PropTypes.oneOf([
      'button',
      'submit',
      'reset'
    ]),
    option: PropTypes.oneOf([
      'default',
      'primary',
      'success',
      'info',
      'warning',
      'danger',
      'link'
    ]),
    size: PropTypes.oneOf([
      'lg',
      'sm',
      'xs',
      false
    ]),
    accept: PropTypes.array,
    active: PropTypes.bool,
    iconType: PropTypes.string,
    noValidation: PropTypes.bool,
    groupClassName: PropTypes.string,
    validationClassName: PropTypes.string,
    formProps: PropTypes.object,
    display: PropTypes.string,
    disabled: PropTypes.bool,
    fileName: PropTypes.string,
    setFileName: PropTypes.func,
    multiple: PropTypes.bool
  }

  static defaultProps = {
    type: 'button',
    option: 'default',
    size: false,
    noValidation: false,
    disabled: false,
    display: 'inline-block',
    multiple: false,
    accept: []
  }

  /**
   * Binds handlers
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.doFileClick = this.doFileClick.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  /**
   * Handles file selection
   * @param {event} event
   */
  onFileChange(event) {
    event.preventDefault()
    const {
      setFileName,
      formProps,
      multiple
    } = this.props

    const files = [ ...event.target.files ]

    if (files.length) {
      if (multiple) {
        formProps.onChange(files)
        setFileName(files.map(file => file.name))
      } else {
        const file = files[0]
        formProps.onChange(file)
        setFileName(file.name)
      }
    }
  }

  /**
   * Handles on blur
   */
  onBlur() {
    // a hack to check if the user has opened the file browser
    window.setTimeout(() => {
      if (document.activeElement !== this.refs.button) {
        this.props.formProps.onBlur()
      }
    }, 100)
  }

  /**
   * Handles click on button and opens a file input
   */
  doFileClick() {
    this.fileRef.click()
  }

  /**
   * Renders file upload component
   * @returns {ReactElement}
   */
  render() {
    const {
      type,
      option,
      size,
      active,
      children,
      noValidation,
      groupClassName,
      validationClassName,
      className,
      disabled,
      formProps: { error },
      formProps,
      display,
      iconType,
      fileName,
      multiple,
      accept,
      ...props
    } = this.props

    const invalid = (!!error)

    const groupClasses = composeClassName(
      invalid && 'has-error',
      groupClassName,
      'width100',
      display
    )

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

    return (
      <div className={groupClasses}>

        <input
          type="file"
          ref={ref => this.fileRef = ref}
          style={{ display: 'none' }}
          {...filterInputProps(formProps)}
          onChange={this.onFileChange}
          // value needs to be manualy updated and not updated via props
          // because of security settin in browsers
          value=""
          multiple={multiple}
          accept={accept.join(',')}
        />

        <button
          type={type}
          className={classes}
          ref="button"
          disabled={disabled}
          onClick={this.doFileClick}
          onBlur={this.onBlur}
          {...filterButtonProps(props)}
        >
          {iconType && <i className={iconClasses} />}
          {children}
        </button>

        <div className="margin-t-xs">{fileName}</div>

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

export default FileUpload
