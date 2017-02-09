import { isNumber } from 'apollo-library/utils/math'
import { MONEY_DEFAULT_SYMBOL, MONEY_DEFAULT_FRACTION } from 'apollo-library/constants/components'
import { isDefined, isUndefined, getCurrencySymbol, trim } from 'apollo-library/utils/common'

const DEFAULT_CURRENCY_OPTIONS = {
  decimals: MONEY_DEFAULT_FRACTION,
  decimalPoint: '.',
  separator: ',',
  separatorFormat: 'standard',
  symbol: getCurrencySymbol(MONEY_DEFAULT_SYMBOL),
  symbolFirst: true,
  showSymbol: true
}

export default {

  /**
   * Trims the string value.
   * GOTCHAS:
   * - this trims on change, that means it's not appropriate for use
   *   with inputs that should allow spaces even in the middle of its value
   *
   * @param {string|undefined} value
   *
   * @return {Object}
   */
  trim(value) {
    if (typeof value === 'string') {
      value = trim(value)
    }

    return {
      actualValue: value,
      displayValue: value,
      caretPosition: undefined
    }
  },

  /**
   * Formats number to certain currency.
   * Options are:
   *    decimals - {number} max number of decimal places (2),
   *    decimalPoint - {string} decimal point character ('.'),
   *    separator - {string} separator for thousands (','),
   *    separatorFormat - {string} how to separate: 'standard' is to separate to thousands,
   *    symbol - {string} currency symbol ('£'),
   *    symbolFirst - {boolean} show the currency symbol before of after the value (true),
   *    showSymbol - {boolean} render symbol or not (true)
   *
   * Examples (with default options):
   *    (pasted) '1234.56' -> {
   *      actualValue: '1234.56',
   *      displayValue: '£1,234.56',
   *      caretPosition: 9
   *    }
   *    (typed number 7) '£1,234.567' -> {
   *      actualValue: '1234.56',
   *      displayValue: '£1,234.56',
   *      caretPosition: 9
   *    }
   *    (typed dot after number 3)'£1,23.4.56' -> {
   *      actualValue: '1234.56',
   *      displayValue: '£1,234.56',
   *      caretPosition: 6
   *    }
   *    (pasted)'£1,23.4.56' -> {
   *      actualValue: '123.45',
   *      displayValue: '£123.45',
   *      caretPosition: 7
   *    }
   *    (deleted a comma after number 4 with backspace, will delete number 4)'£1,234567' -> {
   *      actualValue: '123567',
   *      displayValue: '£123,567',
   *      caretPosition: 4
   *    }
   *    (pasted)'-1234' -> {
   *      actualValue: '-1234',
   *      displayValue: '-£1,234',
   *      caretPosition: 7
   *    }
   *
   * @param {?string} value
   * @param {?Object} formattingOptions - formating options
   * @param {?number} caretPosition - current position of the caret
   * @param {?string} oldValue - previous value
   * @param {?string} oldDisplayValue - previous display value
   * @param {?number} oldCaretPosition - previous caret position
   * @param {boolean} deleteButton - was delete button pressed
   * @param {boolean} backspaceButton - was backspace button pressed
   * @param {?Array} selectionRange - range of the selection in the input field
   * @param {boolean} isKeyPressed - did the change happen due to a key press event
   *
   * @return {Object} -
   *  {
   *    actualValue: {string},
   *    displayValue: {string},
   *    caretPosition: {number}
   *  }
   */
  currency(value, formattingOptions, caretPosition,
    oldValue, oldDisplayValue, oldCaretPosition,
    deleteButton, backspaceButton, selectionRange, isKeyPressed) {

    const options = DEFAULT_CURRENCY_OPTIONS
    if (formattingOptions) {
      for (const op in formattingOptions) {
        options[op] = formattingOptions[op]
      }
    }

    // we're working with strings, if it's number - convert it,
    // if it's something else, return it as zero
    if (typeof value === 'number') {
      value = String(value)
    } else if (typeof value !== 'string') {
      var zeroDisplayValue = '0'

      if (options.showSymbol) {
        zeroDisplayValue = options.symbolFirst
          ? options.symbol.concat(zeroDisplayValue)
          : zeroDisplayValue.concat(options.symbol)
      }
      return {
        actualValue: '0',
        displayValue: zeroDisplayValue,
        caretPosition: 1
      }
    }

    // difference between two strings
    const difference = (longer, shorter) => {
      var offset = 0
      return Array.from(longer).reduce((reduced, current, index) => {
        if (index - offset >= shorter.length
          || current !== shorter.charAt(index - offset)) {
          offset++
          return reduced.concat(current)
        }
        return reduced
      }, '');
    }

    // what was added or removed from the display value
    const added = isDefined(oldDisplayValue)
      && value.length > oldDisplayValue.length
      ? difference(value, oldDisplayValue)
      : ''

    var displayValue = value
    const decimalPoint = options.decimalPoint

    // if the change occured because user pressed delete or backspace
    // and the character deleted was a thousands separator
    // and no text in input field was selected
    var caretPreoffset = 0
    if ((deleteButton || backspaceButton)
      && oldDisplayValue
      && oldDisplayValue.charAt(caretPosition) === options.separator
      && !selectionRange.length) {
      // delete character after the separator and offset caret forward
      if (deleteButton) {
        displayValue = displayValue.slice(0, caretPosition)
          .concat(displayValue.slice(caretPosition + 1))
      } else {
        // delete character before the separator and offset caret backwords
        displayValue = displayValue.slice(0, caretPosition - 1)
          .concat(displayValue.slice(caretPosition))
        caretPreoffset = 1
      }
    }

    // start calculating the caret offset by finding it's position in the value
    // and then offseting that with the number of non-digit characters before it
    // this offset will be fine tuned when display value is built further down
    const beforeCaret = displayValue.slice(0, caretPosition)
    const removedBeforeCaret = beforeCaret.match(/[^0-9]/g)
    var caretOffset =
      (removedBeforeCaret ? removedBeforeCaret.length : 0)
      + caretPreoffset

    // remove everything but digits, minus sign and decimal point
    const remove = new RegExp(`[^0-9\-\\${decimalPoint}]`, 'g')
    displayValue = displayValue.replace(remove, '')

    // check if it's a negative number and remove all the minus signs
    // but keep the difference in length with and without non-aplicable minuses
    const negative = displayValue.indexOf('-') === 0
    displayValue = displayValue.replace(/-/g, '')

    // remember the first decimal point position
    const decimalPointIndex = displayValue.indexOf(decimalPoint)
    // if there's more then one decimal point, and it was typed in
    // return the old value
    const lastDecimalPointIndex = displayValue.lastIndexOf(decimalPoint)

    if (decimalPointIndex !== lastDecimalPointIndex && isKeyPressed) {
      return {
        actualValue: oldValue,
        displayValue: oldDisplayValue,
        caretPosition: caretPosition - 1
      }
    }

    // remove all the decimal points
    displayValue = displayValue.replace(new RegExp(`\\${decimalPoint}`, 'g'), '')

    // if number of decimals is defined, and there is a decimal point,
    // remove the excess numbers behind the decimal point
    if (decimalPointIndex !== -1) {
      const { decimals } = options
      if (isNumber(decimals)) {
        displayValue = displayValue.slice(0, decimalPointIndex + decimals)
      }
    }

    if (displayValue === '') {
      displayValue = '0'
    }

    // "build" actual value, one that can be translated into a number
    var actualValue = displayValue
    // add decimal point if applicable
    if (decimalPointIndex !== -1) {
      actualValue =
        actualValue.slice(0, decimalPointIndex)
        .concat('.')
        .concat(actualValue.slice(decimalPointIndex))
    }
    // remove zeros at the beginning of the value
    // except the one before the decimal point
    while (actualValue.length > 1
      && actualValue[0] === '0'
      && actualValue[1] !== decimalPoint) {
      actualValue = actualValue.slice(1)
    }

    // add negative sign if applicable
    if (negative) {
      actualValue = `-${actualValue}`
    }

    // "build" display value, one to be displayed to user
    // add decimal point if applicable
    if (decimalPointIndex !== -1) {
      displayValue =
        displayValue.slice(0, decimalPointIndex)
          .concat('.')
          .concat(displayValue.slice(decimalPointIndex))
      if (decimalPointIndex < caretPosition) {
        caretOffset--
      }
    }

    // remove zeros at the beginning of the value
    // except the one before the decimal point
    var removedZeros = 0
    while (displayValue.length > 1
      && displayValue[0] === '0'
      && displayValue[1] !== decimalPoint) {
      displayValue = displayValue.slice(1)
      removedZeros++
      caretOffset++
    }

    var newDecimalPointIndex = decimalPointIndex - removedZeros
    // add separators if applicable
    // currently we support only standard separation into thousands
    // we'll add Indian and other special separators if/when we need them
    if (options.separator) {
      let valueFloat
      let valueDecimals
      if (decimalPointIndex !== -1) {
        valueFloat = displayValue.slice(0, newDecimalPointIndex)
        valueDecimals = displayValue.slice(newDecimalPointIndex)
      } else {
        valueFloat = displayValue
        valueDecimals = ''
      }

      if (options.separatorFormat === 'standard') {
        let position = valueFloat.length - 3
        while (position > 0){
          valueFloat =
            valueFloat.slice(0, position)
            .concat(options.separator)
            .concat(valueFloat.slice(position));
          if (position < caretPosition - caretOffset) {
            caretOffset--
          }
          position -= 3
        }
      }
      displayValue = valueFloat.concat(valueDecimals)
    }

    // add negative sign if applicable
    if (negative) {
      displayValue = `-${displayValue}`
      caretOffset--
    }

    let minimumLeftPosition = 0

    // add currency symbol if applicable
    if (options.showSymbol) {
      if (options.symbolFirst) {
        displayValue = options.symbol.concat(displayValue)
        caretOffset--
        minimumLeftPosition = options.symbol.length
      } else {
        displayValue = displayValue.concat(options.symbol)
      }
    }

    // if display value didn't change
    // in most of the cases we can just put the caret to the previous position
    if (displayValue === oldDisplayValue && isKeyPressed) {
      if (added === displayValue.charAt(caretPosition - 1)) {
        caretOffset = 0
      } else {
        caretOffset = 1
      }
    }

    // offset caret position
    if (isUndefined(caretPosition)) {
      caretPosition = displayValue.length
    }

    caretPosition = Math.max(minimumLeftPosition, caretPosition - caretOffset)

    // if caret was among the digits trimmed because of the limitation
    // of the number of decimal values
    if (caretPosition > displayValue.length) {
      caretPosition = displayValue.length
    }

    return {
      actualValue,
      displayValue,
      caretPosition
    }
  }

}
