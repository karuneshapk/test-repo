import React, { Component, PropTypes } from 'react'

export class FormattedSortCode extends Component {

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }

  static defaultProps = {
    value: ''
  }

  /**
   * Masks value xxxxxx to xx-xx-xx
   *
   * @return {ReactNode}
   */
  render() {
    const value = ('' + this.props.value).replace(/([^a-zA-Z0-9]+)/gi, '')
    var left = (value.slice(0, 6).match(/[\s\S]{1,2}/g) || []).join('-')
    var right = value.slice(6, value.length)

    return (
      <span>{left + right}</span>
    )
  }

}

export default FormattedSortCode