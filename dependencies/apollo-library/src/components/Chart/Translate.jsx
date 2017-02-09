import React, { PropTypes } from 'react'

/**
 * SVG g container with translate transform
 */
const Translate = ({ x, y, children, title }) => (
  <g transform={`translate(${x}, ${y})`} title={title}>
    {title && <title>{title}</title>}
    {children}
  </g>
)

Translate.defaultProps = {
  x: 0,
  y: 0
}

Translate.PropTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  title: PropTypes.string
}

export default Translate
