import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { composeClassName } from 'apollo-library/utils/components'
import { isNil, isDefined } from 'apollo-library/utils/common'

/**
 * Element for formating currencies.
 * When both amount and currency code are provided, format it properly with
 * react-intl. Otherwise, just display span with amount
 *
 * @property {string} tagName
 * @property {number} value - amount
 * @property {string} currency - currency code
 * @property {list.<{code: string, value: number}>} listOfCurrencies
 * @property {bool} hideFractions - whether to render value without fractions
 * @property {bool} defaultOutput - Return back in default view
 *
 * @module
 */
export class FormattedCurrency extends Component {

  static propTypes = {
    tagName: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    currency: PropTypes.string.isRequired,
    listOfCurrencies: ImmutablePropTypes.map,
    hideFractions: PropTypes.bool,
    defaultOutput: PropTypes.bool
  }

  static defaultProps = {
    defaultOutput: false,
    hideFractions: false,
    tagName: 'span'
  }

  /**
   * Get options for FormattedNumber, number of fraction digits from props
   * listOfCurrencies or set to 0 if hideFractions property is set to true
   *
   * @return {Object} intl properties
   */
  getOptions() {
    const {
      currency,
      hideFractions,
      listOfCurrencies
    } = this.props

    var attr = {
      style: 'currency',
      currency
    }

    if (hideFractions) {
      attr['minimumFractionDigits'] = 0
      attr['maximumFractionDigits'] = 0
    } else if (isDefined(listOfCurrencies)) {
      const minimumFractionDigits = (listOfCurrencies.get(currency) || {}).value
      if (isDefined(minimumFractionDigits)) {
        attr['minimumFractionDigits'] = minimumFractionDigits
      }
    }

    return attr
  }

  /**
   * Parse currency number and put it to renderable output
   *
   * @param {string|number} currency
   * @param {
   *   {minimumFractionDigits: ?number, maximumFractionDigits: ?number, hideFractions: boolean}
   *  } options
   * @return {ReactNode}
   */
  renderParsedCurrency(currency, { minimumFractionDigits, maximumFractionDigits, hideFractions}) {
    var regexpText = '([^0-9., ]+)([0-9., ]+)'

    if (!hideFractions) {
      regexpText = regexpText + '([.,]\\d{'
      regexpText = regexpText + (minimumFractionDigits || maximumFractionDigits || 0)
      regexpText = regexpText + ','
      regexpText = regexpText + (maximumFractionDigits || minimumFractionDigits || 3)
      regexpText = regexpText + '})'
    }

    const {
      tagName: Tag,
      defaultOutput,
      className
    } = this.props
    const regexp = new RegExp(regexpText)
    const matched = currency.match(regexp)
    const classes = composeClassName('currency', className)

    if (isNil(matched) || defaultOutput) {
      return <Tag className={classes}>{currency}</Tag>
    }

    return (
      <Tag className={classes}>
        <span className="symbol">{matched[1]}</span>
        <span className="integer">{matched[2]}</span>
        {!hideFractions &&
          <span className="decimal">{matched[3]}</span>
        }
      </Tag>
    )
  }

  /**
   * Component render
   *
   * @return {ReactNode}
   */
  render() {
    const {
      value,
      hideFractions,
      intl: { formatNumber }
    } = this.props
    const options = this.getOptions()
    const formatedCurrency = formatNumber(value, options)

    return this.renderParsedCurrency(formatedCurrency, {...options, hideFractions})
  }

}

export default injectIntl(FormattedCurrency)
