import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import { composeClassName } from 'apollo-library/utils/components'
import { generateKey } from 'apollo-library/utils/math'
import { isUndefined, isDefined } from 'apollo-library/utils/common'
import { filterInputProps } from 'apollo-library/utils/props'
import InputLabel from './InputLabel'
import InputAddon from './InputAddon'

const DELETE_KEY = 46
const BACKSPACE_KEY = 8
const NO_SPECIAL_CHARACTER = 0

/**
 * Money input component
 * @module
 */
class MoneyInput extends Component {

  static propTypes = {
    symbol: PropTypes.string,
    decimalPoint: PropTypes.string,
    separator: PropTypes.string,
    decimals: PropTypes.number,
    label: PropTypes.string,
    labelProps: PropTypes.object,
    groupClasses: PropTypes.string,
    id: PropTypes.string,
    classes: PropTypes.string,
    formProps: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  }

  static defaultProps = {
    symbol: '',
    decimalPoint: ',',
    separator: ' ',
    decimals: 2,
    formProps: {
      value: 0
    },
    label: ''
  }

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.localId = undefined
    this.displayValue = ''
    this.endsWithDecimal = false
    this.caretPosition = 0
    this.oldDisplayValue = ''
    this.isKeyPressed = false
    this.selectionRange = false
    this.backspaceButton = false
    this.deleteButton = false
    this.handleEvent = this.handleEvent.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  /**
   * Create random id if not filled
   */
  componentWillMount() {
    const {
      id,
      label
    } = this.props

    this.localId = id

    if (isDefined(label) && isUndefined(id)) {
      this.localId = generateKey()
    }
  }

  /**
   * Set cursor position.
   */
  componentDidUpdate() {
    const node = this.refs.moneyInput

    var caretPosition = false

    // it the caret is after the value, we don't have to set it
    if (this.caretPositin === this.displayValue.length) {
      return
    }

    if (caretPosition) {
      node.setSelectionRange(caretPosition, caretPosition)
    }
  }

  /**
   * If the delete or backspace buttons were pressed,
   * remember the selection and which key was pressed.
   *
   * @param {Object} event - react's onKeyDown event
   */
  handleKeyDown(event) {
    const {
      nativeEvent: {
        keyCode,
        which
      },
      target: {
        selectionStart,
        selectionEnd
      }
    } = event

    this.isKeyPressed = true

    if (keyCode === BACKSPACE_KEY || keyCode === DELETE_KEY
      && which !== NO_SPECIAL_CHARACTER) {
      if (selectionStart !== selectionEnd) {
        this.selectionRange = [ selectionStart, selectionEnd ]
      }
      if (keyCode === BACKSPACE_KEY) {
        this.backspaceButton = true
      } else if (keyCode === DELETE_KEY) {
        this.deleteButton = true
      }
    }
  }

  /**
   * Handle change - update the value before propagating the change
   *
   * @param {Object} event - react event
   */
  handleChange(event) {
    const { separator } = this.props
    var {
      target: {value}
    } = event

    const oldValue = this.oldDisplayValue
    var caretPosition = event.target.selectionStart

    // if backspace was pressed after or a delete button
    // was pressed before the thousands separator,
    // delete the character berofe/after it
    if (this.keyPressed && !this.selectionRange) {
      if (this.backspaceButton && oldValue.charAt(caretPosition) === separator) {
        value = value.slice(0, caretPosition - 1).concat(value.slice(caretPosition))
        caretPosition = caretPosition - 1
      }

      if (this.deleteButton && oldValue.charAt(caretPosition) + 1 === separator) {
        value = value.slice(0, caretPosition).concat(value.slice(caretPosition) + 1)
      }
    }

    this.caretPosition = caretPosition
    this.updateActualValue(value)
  }

  /**
   * Handle events  and send them to form component
   *
   * @param {Object} event - react event
   */
  handleEvent(event) {
    const {
      formProps,
      onBlur,
      onFocus
    } = this.props

    switch (event.type) {

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

    }
  }

  /**
   * @return {HTMLElement} input dom node
   */
  getInputComponent() {
    return this.refs.moneyInput
  }

  /**
   * Update the value to be valid number
   *
   * @param {string} value
   * @param {boolean} isInitial
   */
  updateActualValue(value, isInitial) {
    const {
      formProps,
      onChange,
      separator,
      decimalPoint,
      decimals
    } = this.props

    this.endsWithDecimal = false
    this.oldDisplayValue = value

    var updatedValue = ''
    var update = false

    // we're working with strings, if it's number - convert it,
    // if it's something else, return it as zero
    if (typeof value === 'string') {
      updatedValue = value
    } else if (typeof value === 'number') {
      updatedValue = isNaN(value) ? '0' : String(value)
    } else {
      updatedValue = '0'
    }

    // remove everything but numbers, separators and decimal points
    const remove = new RegExp(`[^0-9\\${separator}\\${decimalPoint}]`, 'g')
    updatedValue = updatedValue.replace(remove, '')
    if (updatedValue !== this.displayValue) {
      update = true
    }

    // remove separators and replace decimal points
    const separatorReplace = new RegExp(`\\${separator}`, 'g')
    const decimalPointReplace = new RegExp(`\\${decimalPoint}`, 'g')
    updatedValue = updatedValue
      .replace(separatorReplace, '')
      .replace(decimalPointReplace, '.')

    if (updatedValue.indexOf('.') > -1) {

      const decimalPointIndex = updatedValue.indexOf('.') + 1
      if (decimalPointIndex === updatedValue.length
          && decimalPointIndex === updatedValue.lastIndexOf('.') + 1) {
        this.endsWithDecimal = true
      }

      // if there's more then one decimal point, remove all but first
      updatedValue = updatedValue.split('.')
      .reduce((reduced, current, index) => {
        return index === 0
          ? current.concat('.')
          : reduced.concat(current)
      }, '')

      // remove excess decimals
      updatedValue = updatedValue.slice(0, updatedValue.indexOf('.') + 1 + decimals)
    }

    updatedValue = parseFloat(updatedValue)

    // update if the value changed
    if (isInitial || update) {
      if (typeof formProps.onChange === 'function') {
        formProps.onChange(updatedValue)
      }
      if (typeof onChange === 'function') {
        onChange(updatedValue)
      }
    }

  }

  /**
   * Render component
   * @returns {ReactElement}
   */
  render() {
    const {
      label,
      labelProps,
      groupClasses,
      classes,
      formProps,
      symbol,
      decimals,
      decimalPoint,
      formProps: {
        value
      },
      intl: {
        formatNumber
      },
      ...props
    } = this.props

    const allGroupClasses = composeClassName(groupClasses, 'form-group')
    const inputClasses = composeClassName(classes, 'form-control')

    const allProps = {
      value,
      ...props,
      ...formProps
    }
    const inputElementProps = filterInputProps(allProps)

    const parsedValue = parseFloat(value)
    var displayValue = formatNumber(parsedValue || 0, {
      maximumFractionDigits: decimals
    })

    // if the last character the user typed previously was decimal point
    // we want to show it to them
    if (this.endsWithDecimal) {
      displayValue = displayValue.concat(decimalPoint)
    }

    // remember display value
    this.displayValue = displayValue

    // initial value may not be a number
    // or even a valid number when it's parsed
    // so we need to update it to make it a number
    // and it's value consistent with the displayed value
    if (value !== parsedValue) {
      this.updateActualValue(displayValue, true)
    }

    return (
      <div className={allGroupClasses}>
        <InputLabel
          htmlFor={this.localId}
          label={label}
          {...labelProps}
        />

        <div className="input-group">
          <InputAddon type="addon">
            {symbol}
          </InputAddon>

          <input
            ref="moneyInput"
            {...inputElementProps}
            className={inputClasses}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onBlur={this.handleEvent}
            onFocus={this.handleEvent}
            value={displayValue}
          />
        </div>

      </div>
    )
  }

}

export default injectIntl(MoneyInput)
