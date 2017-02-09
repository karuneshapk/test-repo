import React, { PropTypes } from 'react'

/**
 * SVG Circle react wrapper
 */
const Circle = ({ circleClassName, x, y, r, color }) => (
  <circle
    className={circleClassName}
    cx={x}
    cy={y}
    r={r}
    fill={color}
  />
)

Circle.PropTypes = {
  circleClassName: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired
}

export default Circle
