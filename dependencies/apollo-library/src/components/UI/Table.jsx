import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'

/**
 * Table Element
 *
 * @property {Boolean} bordered - table has bordered style
 * @property {Boolean} condensed - table has condensed style
 * @property {Boolean} hover - table has hover style
 * @property {Boolean} responsive - table is responsive
 * @property {Boolean} striped - table has striped style
 *
 * @module
 */
export class Table extends Component {

  static propTypes = {
    bordered: PropTypes.bool,
    condensed: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool,
    striped: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    bordered: false,
    condensed: false,
    hover: false,
    responsive: false,
    striped: false
  }

  renderTable() {
    const {
      bordered,
      condensed,
      hover,
      striped,
      className,
      children
    } = this.props

    var classes = composeClassName(
      'table',
      bordered && 'table-bordered',
      condensed && 'table-condensed',
      hover && 'table-hover',
      striped && 'table-striped',
      className
    )

    return (
      <table className={classes}>
        {children}
      </table>
    )
  }

  render() {
    const table = this.renderTable()

    return this.props.responsive
      ? <div className='table-responsive'>{table}</div>
      : table
  }

}

export default Table
