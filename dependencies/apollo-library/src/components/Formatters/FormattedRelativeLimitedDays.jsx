import React, { Component } from 'react'
import { FormattedDate, FormattedRelative } from 'react-intl'

/**
 * Element for formating dates as dates or relative (yesterday, last week),
 * depending on the limit provided.
 *
 * @property {Date} value - date value to format against
 * @property {Number} limitedTo - number of days in the past when relative
 * formating stops
 *
 * @module
 */
export class FormattedRelativeLimitedDays extends Component {

  /**
   * Renders ????
   *
   * @return {ReactNode}
   */
  render() {
    const { value, limitedTo } = this.props

    var limitDate = new Date()

    limitDate.setDate(limitDate.getDate() - limitedTo)

    const limited = (
      value.toDateString() === limitDate.toDateString() || value < limitDate
    )

    var formated = (limited
      ? <FormattedDate {...this.props}/>
      : <FormattedRelative {...this.props} />
    )

    return (
      <span className='capitalize'>
        {formated}
      </span>
    )
  }

}

export default FormattedRelativeLimitedDays