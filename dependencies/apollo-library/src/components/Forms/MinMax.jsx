import React, { Component, PropTypes } from 'react'

import { isFunction, isDefined, isUndefined } from 'apollo-library/utils/common'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import {
  LABEL_POSITION,
  HELP_BLOCK_POSITION
} from 'apollo-library/constants/components'
import { generateKey } from 'apollo-library/utils/math'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Component class
 */
export default class MinMax extends Component {
  static propTypes = {
    id: PropTypes.string,
    formProps: PropTypes.object,
    minComponent: PropTypes.func,
    minComponentProps: PropTypes.object,
    maxComponent: PropTypes.func,
    maxComponentProps: PropTypes.object,
    className: PropTypes.string,
    validationClassName: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    separator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    disabled: PropTypes.bool,
    helpBlock: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    helpBlockClassName: PropTypes.string,
    helpBlockPosition: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    labelPosition: PropTypes.string,
    inputsClassName: PropTypes.string,
    units: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    noValidation: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    labelPosition: LABEL_POSITION.BEFORE,
    minComponentProps: {
      inputName: 'min'
    },
    maxComponentProps: {
      inputName: 'max'
    },
    inputsClassName: 'inputs'
  };

  /**
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.onChange = this.onChange.bind(this)

    this.localId = undefined

    /* input refs */
    this.minComponentRef = undefined
    this.maxComponentRef = undefined
  }


  /**
   * Generate ID for label
   */
  componentDidMount() {
    const {
      id,
      label
    } = this.props

    if (isDefined(label) && isUndefined(id)) {
      this.localId = generateKey()
    } else {
      this.localId = id
    }
  }

  /**
   * Proccess default value to form
   *
   * @param  {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const {
      formProps: {
        onChange: formOnChange
      },
      minComponentProps,
      maxComponentProps
    } = this.props

    const {
      formProps: {
        onChange: nextFormOnChange
      }
    } = nextProps

    const defaultValue = undefined

    if (minComponentProps.defaultValue) {
      defaultValue[minComponentProps.inputName] = minComponentProps.defaultValue
    }

    if (maxComponentProps.defaultValue) {
      defaultValue[maxComponentProps.inputName] = maxComponentProps.defaultValue
    }

    if(defaultValue && !isFunction(formOnChange) && isFunction(nextFormOnChange)) {
      nextFormOnChange(defaultValue)
    }
  }

  /**
   * Trigger onBlur with value
   */
  onBlur() {
    const {
      onBlur,
      formProps: {
        value,
        onBlur: formOnBlur
      }
    } = this.props

    /* custom onChange */
    if (isFunction(onBlur)) {
      onBlur(value);
    }

    /* formProps onChange */
    if (isFunction(formOnBlur)) {
      formOnBlur(value);
    }
  }

  /**
   * Create object from inputs
   *
   * @param {string} inputName
   * @param {string|SyntheticEvent} [event='']
   * @param {string} displayValue
   * @param {string} selectionStart
   * @param {Object} Event
   */
  onChange(inputName, event = '', displayValue, selectionStart) {
    const {
      onChange,
      formProps: {
        onChange: formOnChange
      }
    } = this.props
    var targetValue = event

    if (isDefined(event.target)) {
      targetValue = event.target.value
    }

    const newValue = this.mergeFormProp(inputName, 'value', targetValue)
    const newDisplayValue = this.mergeFormProp(inputName, 'displayValue', displayValue)
    const newSelectionStart = this.mergeFormProp(inputName, 'selectionStart', selectionStart)

    /* custom onChange */
    if (isFunction(onChange)) {
      onChange(newValue);
    }

    /* formProps onChange */
    if (isFunction(formOnChange)) {
      formOnChange(newValue, newDisplayValue, newSelectionStart)
    }
  }

  /**
   * Merge value from formProps for given input name
   * @param {string} inputName
   * @param {string} propertyName
   * @param {*} value
   * @returns {Object}
   */
  mergeFormProp(inputName, propertyName, value) {
    const {
      formProps,
    } = this.props

    const oldValue = formProps[propertyName]

    return {
      ...oldValue,
      [inputName]: value,
    }
  }

  /**
   * Render validation messages
   *
   * @return {ReactElement}
   */
  renderErrors() {
    const {
      formProps: {
        error
      },
      validationClassName
    } = this.props

    return (
      <ValidationMessage
        show={!!error}
        className={validationClassName}
        message={error}
      />
    )
  }

  /**
   * Render common label for both inputs
   *
   * @param  {string|ReactElement} label
   * @param  {string} id
   * @return {ReactElement}
   */
  renderLabel(label, id) {
    return (
      <label htmlFor={id}>
        {label}
      </label>
    )
  }

  /**
   * Render help block
   *
   * @return {ReactElement}
   */
  renderHelpBlock() {
    const {
      helpBlock,
      helpBlockPosition,
      helpBlockClassName
    } = this.props

    if (!helpBlock) {
      return false
    }

    const helpBlockClasses = composeClassName(
      'help-block',
      (helpBlockPosition !== HELP_BLOCK_POSITION.VALIDATION ? 'no-validation-control' : false),
      (helpBlockPosition === HELP_BLOCK_POSITION.AFTER_LABEL ? 'after-label' : false),
      (helpBlockPosition === HELP_BLOCK_POSITION.AFTER_INPUT ? 'after-input' : false),
      (helpBlockPosition === HELP_BLOCK_POSITION.VALIDATION ? 'validation' : false),
      helpBlockClassName
    )

    return (
      <span className={helpBlockClasses}>
        {helpBlock}
      </span>
    )
  }

  /**
   * Render component
   *
   * @return {ReactNode}
   */
  render () {
    const {
      minComponent: MinComponent,
      maxComponent: MaxComponent,
      minComponentProps,
      maxComponentProps,
      separator,
      disabled,
      formProps,
      formProps: {
        error
      },
      noValidation,
      labelPosition,
      label,
      className,
      inputsClassName,
      units
    } = this.props

    let minComponentFormProps = {}
    let maxComponentFormProps = {}

    if (isDefined(formProps.value)) {
      minComponentFormProps = {
        ...{
          value: formProps.value[minComponentProps.inputName],
          onBlur: this.onBlur.bind(this),
        }
      }

      maxComponentFormProps = {
        ...{
          value: formProps.value[maxComponentProps.inputName],
          onBlur: this.onBlur.bind(this),
        },
      }
    }

    if (isDefined(formProps.displayValue)) {
      minComponentFormProps = {
        ...minComponentFormProps,
        displayValue: formProps.displayValue[minComponentProps.inputName],
      }

      maxComponentFormProps = {
        ...maxComponentFormProps,
        displayValue: formProps.displayValue[maxComponentProps.inputName],
      }
    }

    const groupClasses = composeClassName(
      error ? 'has-error' : false,
      disabled ? 'disabled' : false,
      'form-group',
      className
    )

    return(
      <div className={groupClasses}>
        {labelPosition === LABEL_POSITION.BEFORE && label &&
          this.renderLabel(label, this.localId)
        }
        {labelPosition === LABEL_POSITION.BEFORE &&
          this.renderHelpBlock()
        }
        <div className={inputsClassName}>
          <div className="inputs-wrap">
            <MinComponent
              {...minComponentProps}
              ref={(input) => this.minComponentRef = input}
              onChange={this.onChange.bind(this, minComponentProps.inputName)}
              disabled={disabled}
              formProps={minComponentFormProps}
              id={this.localId}
            />
            {separator}
            <MaxComponent
              {...maxComponentProps}
              ref={(input) => this.maxComponentRef = input}
              onChange={this.onChange.bind(this, maxComponentProps.inputName)}
              disabled={disabled}
              formProps={maxComponentFormProps}
            />
            {units}
          </div>
        </div>
        {labelPosition === LABEL_POSITION.AFTER && label &&
          this.renderLabel(label, this.localId)
        }
        {labelPosition === LABEL_POSITION.AFTER &&
          this.renderHelpBlock()
        }
        {error && !noValidation && this.renderErrors()}
      </div>
    )
  }
}
