import React, { Component, PropTypes } from 'react'

import { isDefined } from 'apollo-library/utils/common'

/**
 * Component that forces render of it's content when the screen resizes
 *
 * @param {Function} component - component
 * @module
 */
export class UpdateOnScale extends Component {

  static propTypes = {
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  }

  static defaultProps = {
    width: '100%',
    height: '100%'
  }

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.state = {
      width: 0,
      height: 0
    }

    this.updateDimensions = this.updateDimensions.bind(this)
  }

  /**
   * Register global listener on resize before component mounting
   */
  componentWillMount() {
    addEventListener('resize', this.updateDimensions)
  }

  /**
   * Calculate width and height for children components on mount
   */
  componentDidMount() {
    this.updateDimensions()
  }

  /**
   * Unregister global listener on resize before component unmounting
   */
  componentWillUnmount() {
    removeEventListener('resize', this.updateDimensions)
  }

  /**
   * Recalculates new width and height based on clientWidth and clientHeight
   * if either of width/height changes, function updates wrapper state
   */
  updateDimensions() {
    if (isDefined(this.refs.updateContainer)) {
      let { clientWidth, clientHeight } = this.refs.updateContainer
      if (clientWidth !== this.state.width || clientHeight !== this.state.height) {
        this.setState({
          width: clientWidth,
          height: clientHeight
        })
      }
    }
  }

  /**
   * Renders children wrapped within div that injects width and height props
   * into children based on current clientWidth and clientHeight of container
   *
   * @return {ReactNode}
   */
  render() {
    const { width, height } = this.props

    return (
      <div ref="updateContainer" style={{ 'width': width, 'height': height }}>
        {this.state.width
          ? React.cloneElement(React.Children.only(this.props.children),
            {
              height: this.state.height,
              width: this.state.width
            })
          : false
        }
      </div>
    )
  }

}

export default UpdateOnScale
