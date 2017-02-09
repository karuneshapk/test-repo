import React, { Component, PropTypes } from 'react'

import { isDefined } from 'apollo-library/utils/common'

/**
 * Element displays navigating path
 *
 * @returns {ReactNode}
 */
export class Breadcrumb extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      label: PropTypes.any.isRequired,
      onClick: PropTypes.func
    })).isRequired
  }

  /**
   * Element displays navigating path
   *
   * @returns {ReactNode}
   */
  render() {
    const { items } = this.props

    return (
      <ol className="breadcrumb">
        {items.map((item, index) => (
          index < items.length - 1
            ? <li key={`br${index}`}>
                <a
                  href={item.url ? item.url : 'javascript:void(0)'}
                  onClick={isDefined(item.onClick) && item.onClick}
                >
                  {item.label}
                </a>
              </li>
            : <li key={`br${index}`} className="active">
                {item.label}
              </li>
          ))}
      </ol>
    )
  }
}

export default Breadcrumb
