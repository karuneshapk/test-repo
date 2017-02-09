import React, { PropTypes } from 'react'

const Bar = ({
  width,
  height,
  x,
  y,
  barClassName,
  color,
  style,
  title
}) => (
  <rect
    className={`${barClassName} bar`}
    width={width}
    height={height}
    x={x}
    y={y}
    fill={color}
    style={style}
    title={title}
  />
)

Bar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  barClassName: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string
}

Bar.defaultProps = {
  barClassName: 'react-d3-basic__bar',
  color: '#7895c3',
  style: {}
}

export default Bar
