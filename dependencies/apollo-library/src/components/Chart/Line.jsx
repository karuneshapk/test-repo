import React, { PropTypes } from 'react'

/**
 * SVG line from one point to other
 */
const Line = ({ x1, y1, x2, y2, stroke, strokeWidth }) => (
  <path
    d={`M ${x1} ${y1} L ${x2} ${y2}`}
    stroke={stroke}
    strokeWidth={strokeWidth}
  />
)

Line.defaultProps = {
  stroke: '#000',
  strokeWidth: 1
};

Line.PropTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
}

export default Line

