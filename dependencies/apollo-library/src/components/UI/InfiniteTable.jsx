import React, { Component, PropTypes, Children } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import Waypoint from 'apollo-library/components/Common/Waypoint'

export class InfiniteTable extends Component {

  static propTypes = {
    bordered: PropTypes.bool,
    condensed: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool,
    striped: PropTypes.bool,
    className: PropTypes.string,
    pageStart: PropTypes.number,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    isRequesting: PropTypes.bool
  }

  static defaultProps = {
    bordered: false,
    condensed: false,
    hover: false,
    responsive: false,
    striped: false,
    pageStart: 0,
    hasMore: false,
    isRequesting: false,
    loadMore: () => {}
  }

  /**
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.showMore = this.showMore.bind(this)
  }

  /**
   * Load more items
   */
  showMore() {
    const { hasMore, loadMore, isRequesting } = this.props

    if (hasMore && !isRequesting) {
      loadMore()
    }

    return false
  }

  /**
   * Renders what is visible as fast as possible, lazy renders additional rows,
   * does not mutate, modify or save data outside of props, just slide offset
   * pivot
   */
  renderTable() {
    const {
      bordered,
      condensed,
      hover,
      striped,
      className,
      children,
      isRequesting
    } = this.props

    var classes = composeClassName(
      'table-long',
      bordered && 'table-bordered',
      condensed && 'table-condensed',
      hover && 'table-hover',
      striped && 'table-striped',
      className
    )

    return (
      <frag>
        <table className={classes}>
          {children}
        </table>
        <Waypoint onVisible={this.showMore} />
      </frag>
    )
  }

  render() {
    var table = this.renderTable()

    return this.props.responsive
      ? <div className='table-responsive'>{table}</div>
      : table
  }

}

export default InfiniteTable
