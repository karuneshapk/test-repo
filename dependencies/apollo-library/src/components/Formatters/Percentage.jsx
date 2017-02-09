import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import { isNumber } from 'apollo-library/utils/math'
import { composeClassName } from 'apollo-library/utils/components'

const DEFAULT_DECIMAL = 0

/**
 * Renders localised percentage with configured number of decimals
 *
 * @param {string|number} amount - number to be formated as percents
 * @param {string|number} decimals - number of decimals to show
 * @param {boolean} fixedDecimals - should the number of decimals be fixed
 * @param {string|React.element} emptyValue - empty message
 *
 * @module
 */
export class Percentage extends Component{

  static propTypes = {
    emptyValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    amount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    decimals: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    fixedDecimals: PropTypes.bool
  }

  static defaultProps = {
    emptyValue: '—',
    fixedDecimals: false,
    decimals: DEFAULT_DECIMAL
  }

  /**
   * On the contrary
   *
   * @returns {ReactNode}
   **/
  render() {
    const {
      amount,
      decimals,
      fixedDecimals,
      emptyValue,
      className,
      intl: { formatNumber }
    } = this.props

    const classes = composeClassName('percentage', className)

    if (isNumber(amount)) {
      const value = parseFloat(amount) / 100

      let decimalDigits = parseInt(decimals, 10)

      decimalDigits = isNumber(decimalDigits)
        ? decimalDigits
        : DEFAULT_DECIMAL

      const attrs = {
        style: 'percent',
        value,
        maximumFractionDigits: decimalDigits
      }

      if (fixedDecimals) {
        attrs['minimumFractionDigits'] = decimalDigits
      }

      const formatted = formatNumber(value, attrs)
      const symbolIndex = formatted.indexOf('%')
      const formattedArr = formatted.split('%')

      let element = <span className={classes}>{formatted}</span>

      if (formattedArr.length === 1 && symbolIndex > -1) {
        if (symbolIndex === 0) {
          element = (
            <span className={classes}>
              <span className="symbol">
                {'%'}
              </span>
              <span className="value">
                {formattedArr[0]}
              </span>
            </span>
          )
        } else {
          element = (
            <span className={classes}>
              <span className="value">
                {formattedArr[0]}
              </span>
              <span className="symbol">
                {'%'}
              </span>
            </span>
          )
        }
      } else if (formattedArr.length === 2) {
        element = (
          <span className={classes}>
            <span className="value">
              {formattedArr[0]}
            </span>
            <span className="symbol">
              {'%'}
            </span>
            <span className="value">
              {formattedArr[1]}
            </span>
          </span>
        )
      }

      return element
    } else {
      // if the value is not a valid number, display emptyValue
      return (typeof emptyValue === 'string')
        ? <span className={classes}>{emptyValue}</span>
        : emptyValue
    }
  }

}

export default injectIntl(Percentage)
