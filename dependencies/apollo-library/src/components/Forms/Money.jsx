import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import BaseInput from 'apollo-library/components/Forms/BaseInput'
import { isDefined, isUndefined, isFunction } from 'apollo-library/utils/common'
import {
  MONEY_SYMBOL_GLYPHICON,
  MONEY_SYMBOL_POSITION,
  MONEY_CURRENCY_SYMBOL_POSITION,
  MONEY_DEFAULT_FRACTION,
  MONEY_DEFAULT_DECIMAL_POINT,
  CURRENCY_SYMPOLS,
} from 'apollo-library/constants/components'

/**
 * Money input component
 *
 * Other properties for use:
 * @see {BaseInput}
 *
 * @property {String} inputName
 * @property {String} symbol Currency symbol name, one of (GBP, USD, EUR)
 * @property {Number} fractionSize number of allowed digits after the decimal point
 * @property {ReactNode} ReactNode
 *
 * @module
 */
export class Money extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    inputName: PropTypes.string.isRequired,
    formProps: PropTypes.object,
    currencyCode: PropTypes.string,
    symbol: PropTypes.string,
    symbolPosition: PropTypes.oneOf([
      MONEY_SYMBOL_POSITION.PRE,
      MONEY_SYMBOL_POSITION.POST,
    ]),
    fractionSize: PropTypes.number,
    decimalPoint: PropTypes.string
  }

  static defaultProps = {
    symbol: '',
    fractionSize: MONEY_DEFAULT_FRACTION,
    decimalPoint: MONEY_DEFAULT_DECIMAL_POINT,
  }

  /**
   * Bind on change
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.onChange = this.onChange.bind(this)
  }

  /**
   * Updates display value when not provided and initial value is provided
   * @param {Object} newProps
   */
  componentWillReceiveProps(newProps) {
    const {
      initialValue,
      formProps: newFormProps,
    } = newProps

    const {
      displayValue,
      onChange,
    } = newFormProps || {}

    if (isUndefined(displayValue) && isFunction(onChange) && isDefined(initialValue)) {
      const newValue = this.getValue(initialValue)
      const formattedDisplayValue = this.formatDisplayValue(newValue)

      newProps.formProps.onChange(newValue, formattedDisplayValue)
    }
  }

  /**
   * Update caret position
   */
  componentDidUpdate() {
    const {
      caretPosition
    } = this.props.formProps || {}

    if (caretPosition) {
      this.inputRef.refs.baseInput.setSelectionRange(caretPosition, caretPosition)
    }
  }

  /**
   * On change handler
   * @param {event} event
   */
  onChange(event) {
    const {
      formProps,
      onChange,
    } = this.props

    const { value, selectionStart } = event.target

    if (!isDefined(value)) {
      return
    }

    const newValue = this.getValue(value)
    const displayValue = this.formatDisplayValue(newValue)

    event.target.value = newValue

    if (isFunction(onChange)) {
      onChange(event, displayValue, selectionStart)
    }

    if (isDefined(formProps) && isFunction(formProps.onChange)) {
      formProps.onChange(event, displayValue, selectionStart)
    }
  }

  /**
   * Returns processed value
   * @param {string} value
   * @returns {string}
   */
  getValue(value) {
    const {
      fractionSize,
      decimalPoint,
    } = this.props

    const realValue = isDefined(value) ? value.replace(decimalPoint, '.') : value
    const hasFraction = realValue.match(/\./)

    if (hasFraction) {
      const [ integer, fraction ] = realValue.split('.')
      const newFraction = isDefined(fraction) ? fraction.slice(0, fractionSize) : ''

      return `${integer}.${newFraction}`
    }

    return realValue
  }

  /**
   * Formats display value
   * @param {string} newValue
   * @returns {string}
   */
  formatDisplayValue(newValue) {
    const {
      decimalPoint,
    } = this.props

    return isDefined(newValue) && newValue.replace('.', decimalPoint) || undefined
  }

  /**
   * Renders Money input
   * @returns {ReactElement}
   */
  render() {
    const {
      formProps,
      symbol,
      symbolPosition,
      currencyCode,
      ...props
    } = this.props

    const symbolHasGlyphicon = Object.keys(MONEY_SYMBOL_GLYPHICON)
      .map(key => MONEY_SYMBOL_GLYPHICON[key])
      .includes(symbol.toUpperCase())

    const addonClassName = symbolHasGlyphicon
      && composeClassName('glyphicon', `glyphicon-${symbol.toLowerCase()}`)

    const currencySymbol = symbol || CURRENCY_SYMPOLS[currencyCode]
    const currencySymbolPosition = symbolPosition ||
      MONEY_CURRENCY_SYMBOL_POSITION[currencyCode] ||
      MONEY_SYMBOL_POSITION.PRE

    const symbolElement = symbolHasGlyphicon
      ? <span className={addonClassName} />
      : currencySymbol

    const addons = {}

    if (currencySymbolPosition === MONEY_SYMBOL_POSITION.PRE) {
      addons['preAddon'] = symbolElement
    } else if (currencySymbolPosition === MONEY_SYMBOL_POSITION.POST) {
      addons['postAddon'] = symbolElement
    }

    return (
      <BaseInput
        ref={ref => this.inputRef = ref}
        type="text"
        formProps={formProps}
        {...addons}
        {...props}
        onChange={this.onChange}
      />
    )
  }

}

export default Money
