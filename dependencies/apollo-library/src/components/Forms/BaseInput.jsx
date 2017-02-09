import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import { generateKey } from 'apollo-library/utils/math'
import { isUndefined, isDefined } from 'apollo-library/utils/common'
import {
  ADDON_TYPES,
  LABEL_POSITION,
  HELP_BLOCK_POSITION
} from 'apollo-library/constants/components'

import { filterInputProps } from 'apollo-library/utils/props'

import ValidationMessage from './ValidationMessage'
import InputLabel from './InputLabel'
import InputAddon from './InputAddon'
import MaskedInput from './MaskedInput'

const ALLOWED_INPUT_TYPES = [
  'text', 'password', 'radio', 'checkbox', 'color', 'date', 'datetime',
  'datetime-local', 'email', 'mounth', 'number', 'range', 'search', 'tel',
  'time', 'url', 'week',
  'textarea'
]

/**
 * Text input component
 *
 * Other available property:
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/
    #heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 *
 * @property {!ALLOWED_INPUT_TYPES} type
 * @property {!string} inputName
 * @property {array} validators
 * @property {string|ReactNode} label
 * @property {Object} labelProps
 * @property {LABEL_POSITION} labelPosition
 * @property {string} groupClassName
 * @property {React.Element} preAddon
 * @property {ADDON_TYPES} preAddonType
 * @property {React.Element} postAddon
 * @property {ADDON_TYPES} postAddonType
 * @property {string} validationClassName
 * @property {string|ReactNode} helpBlock
 * @property {HELP_BLOCK_POSITION} helpBlockPosition
 * @property {string} helpBlockClassName
 * @property {boolean} formControled Use form-control for input element
 *
 * @module
 */
export class BaseInput extends Component {

  /**
   * Addons type
   *
   * @enum {string}
   */
  static ADDON_TYPES = ADDON_TYPES

  /**
   * Label possition
   *
   * @enum {string}
   */
  static LABEL_POSITION = LABEL_POSITION

  static propTypes = {
    type: PropTypes.oneOf(ALLOWED_INPUT_TYPES).isRequired,
    inputName: PropTypes.string.isRequired,
    validators: PropTypes.array,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    labelProps: PropTypes.object,
    labelPosition: PropTypes.oneOf([LABEL_POSITION.BEFORE, LABEL_POSITION.AFTER]),
    className: PropTypes.string,
    groupClassName: PropTypes.string,
    preAddon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    preAddonType:  PropTypes.oneOf([ADDON_TYPES.BUTTON, ADDON_TYPES.ADDON]),
    postAddon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    postAddonType: PropTypes.oneOf([ADDON_TYPES.BUTTON, ADDON_TYPES.ADDON]),
    validationClassName: PropTypes.string,
    helpBlock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    helpBlockClassName: PropTypes.string,
    helpBlockPosition: PropTypes.oneOf([
      HELP_BLOCK_POSITION.AFTER_LABEL,
      HELP_BLOCK_POSITION.AFTER_INPUT,
      HELP_BLOCK_POSITION.VALIDATION
    ]),
    formControled: PropTypes.bool,
    autoComplete: PropTypes.oneOf(['on', 'off']),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    id: PropTypes.string,
    formProps: PropTypes.object,
    masks: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array
    ]),
    disabled: PropTypes.bool,
    noValidation: PropTypes.bool
  }

  static defaultProps = {
    groupClassName: 'form-group',
    preAddonType: ADDON_TYPES.ADDON,
    postAddonType: ADDON_TYPES.ADDON,
    labelPosition: LABEL_POSITION.BEFORE,
    helpBlockPosition: HELP_BLOCK_POSITION.VALIDATION,
    formControled: true,
    formProps: {}
  }

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.localId = undefined
    this.handleBaseInputEvent = this.handleBaseInputEvent.bind(this)
  }

  /**
   * Create random id if not filled
   */
  componentWillMount() {
    const { id, label } = this.props

    this.localId = id

    if (isDefined(label) && isUndefined(id)) {
      this.localId = generateKey()
    }
  }

  /**
   * Handle events on base input and send them to form component
   *
   * @param {Object} event - react event
   */
  handleBaseInputEvent(event) {
    const {
      formProps,
      onChange,
      onBlur,
      onFocus
    } = this.props

    switch (event.type) {

      case 'change': {
        if (typeof formProps.onChange === 'function') {
          formProps.onChange(event)
        }
        if (typeof onChange === 'function') {
          onChange(event)
        }
        break
      }

      case 'blur': {
        if (typeof formProps.onBlur === 'function') {
          formProps.onBlur(event)
        }
        if (typeof onBlur === 'function') {
          onBlur(event)
        }
        break
      }

      case 'focus': {
        if (typeof formProps.onFocus === 'function') {
          formProps.onFocus(event)
        }
        if (typeof onFocus === 'function') {
          onFocus(event)
        }
        break
      }

      // this is a hack to allow autofill widgets that use keyup event
      // to change the values of text and password fields
      case 'keyup': {
        const {
          nativeEvent: {
            charCode,
            keyCode
          },
          currentTarget: {
            tagName,
            type
          }
        } = event

        if (tagName === 'INPUT' && (type === 'text' || type === 'password')
          && charCode === 0 && keyCode === 0) {
          if (typeof formProps.onChange === 'function') {
            formProps.onChange(event);
          }
          if (typeof onChange === 'function') {
            onChange(event)
          }
        }
        break
      }

    }
  }

  /**
   * @return {HTMLElement} input/textarea dom node
   */
  getInputComponent() {
    return this.refs.baseInput
  }

  /**
   * Render complex input component by properties
   *
   * @return {ReactNode}
   */
  render() {
    const {
      type,
      formProps: {
        error,
        masks,
        maskRunner,
        value,
        displayValue
      },
      formProps,
      inputName,
      validators,
      groupClassName,
      className,
      label,
      labelProps,
      labelPosition,
      preAddon,
      preAddonType,
      postAddon,
      postAddonType,
      validationClassName,
      helpBlock,
      helpBlockPosition,
      helpBlockClassName,
      formControled,
      disabled,
      noValidation,
      ...props
    } = this.props,
      invalid = (!!error),
      message = error,
      classes = composeClassName(
      formControled ? 'form-control' : false,
        className
      ),
      groupClasses = composeClassName(
        invalid ? 'has-error' : false,
        disabled ? 'disabled' : false,
        groupClassName
      ),
      helpBlockClasses = composeClassName(
        'help-block',
        (helpBlockPosition !== HELP_BLOCK_POSITION.VALIDATION ? 'no-validation-control' : false),
        (helpBlockPosition === HELP_BLOCK_POSITION.AFTER_LABEL ? 'after-label' : false),
        (helpBlockPosition === HELP_BLOCK_POSITION.AFTER_INPUT ? 'after-input' : false),
        (helpBlockPosition === HELP_BLOCK_POSITION.VALIDATION ? 'validation' : false),
        helpBlockClassName
      )

    formProps.name = (isUndefined(formProps.name) ? inputName : formProps.name)

    const masked = (masks && maskRunner)

    // props depend on whether the component has masks
    const changeEvents = masked
      ? {
        onChange: props.onChange,
        formOnChange: formProps.onChange
      }
      : {
        onChange: this.handleBaseInputEvent,
        onKeyUp: this.handleBaseInputEvent
      }

    const fieldValue = isDefined(displayValue) ? displayValue : value

    const inputProps = {
      id: this.localId,
      className: classes,
      disabled,
      validators,
      inputName,
      type,
      ...props,
      ...formProps,
      ...changeEvents,
      value: isDefined(fieldValue) ? fieldValue : '',
      onBlur: this.handleBaseInputEvent,
      onFocus: this.handleBaseInputEvent
    }

    const inputElementProps = filterInputProps(inputProps)

    return (
      <div className={groupClasses}>
        {labelPosition === BaseInput.LABEL_POSITION.BEFORE && label &&
          <InputLabel
            htmlFor={inputProps.id}
            label={label}
            {...labelProps}
          />
        }

        {helpBlockPosition === HELP_BLOCK_POSITION.AFTER_LABEL && helpBlock &&
          <div className={helpBlockClasses}>
            {helpBlock}
          </div>
        }

        {type === 'textarea'
        ? <textarea ref="baseInput" {...inputElementProps} />
        : (preAddon || postAddon) ?
            <div className="input-group">
              {preAddon &&
                <InputAddon type={preAddonType}>
                  {preAddon}
                </InputAddon>
              }
              {!masked
                ? <input ref="baseInput" {...inputElementProps} />
                : (
                  <MaskedInput
                    {...inputProps}
                    masks={masks}
                    maskRunner={maskRunner}
                  />
                  )
              }
              {postAddon &&
                <InputAddon type={postAddonType}>
                  {postAddon}
                </InputAddon>
              }
            </div>
          : !masked
            ? <input ref="baseInput" {...inputElementProps} />
            : (
              <MaskedInput
                {...inputProps}
                masks={masks}
                maskRunner={maskRunner}
              />
              )
        }

        {labelPosition === BaseInput.LABEL_POSITION.AFTER && label &&
          <InputLabel
            htmlFor={inputProps.id}
            label={label}
            {...labelProps}
          />
        }

        {helpBlockPosition === HELP_BLOCK_POSITION.AFTER_INPUT && helpBlock &&
          <div className={helpBlockClasses}>
            {helpBlock}
          </div>
        }

        {!invalid && helpBlock && helpBlockPosition === HELP_BLOCK_POSITION.VALIDATION &&
          <div className={helpBlockClasses}>
            {helpBlock}
          </div>}

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

export default BaseInput
