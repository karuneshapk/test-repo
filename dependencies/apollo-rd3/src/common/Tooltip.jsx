'use strict';

const React = require('react');
const utils = require('../utils');

module.exports = React.createClass({

  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    child: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.element,
    ]),
    show: React.PropTypes.bool,
  },

  defaultProps: {
    tooltipStyles: {},
    containerStyles: {},
  },

  render() {
    const props = this.props;
    const display = this.props.show ? 'inherit' : 'none';

    const containerStyles = utils.mergeObject({
      position: 'fixed',
      top: props.y,
      left: props.x,
      display,
      opacity: 0.8,
    }, props.containerStyles);

    // TODO: add 'right: 0px' style when tooltip is off the chart
    const tooltipStyles = utils.mergeObject({
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid',
      borderColor: '#ddd',
      borderRadius: '2px',
      padding: '10px',
      marginLeft: '10px',
      marginRight: '10px',
      marginTop: '-15px',
    }, props.tooltipStyles);

    return (
      <div
        className={`rd3-tooltip-container${props.className ? ' ' + props.className : ''}`}
        style={containerStyles}
      >
        <div
          className={'rd3-tooltip-content'}
          style={tooltipStyles}
        >
          {props.child}
        </div>
      </div>
    );
  },
});
