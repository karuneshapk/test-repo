import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Anchor from 'apollo-library/components/UI/Anchor'
import Button from 'apollo-library/components/Forms/Button'
import { composeClassName } from 'apollo-library/utils/components'
import { generateKey } from 'apollo-library/utils/math'
import { dropdownOpened } from 'apollo-library/actions/dropdown'

/**
 * Button dropdown container
 * @see Bootstrap documentation {@link http://getbootstrap.com/components/#btn-dropdowns}
 *
 * @property {!string} name Visible label
 * @property {string=} option Button component options @see Button Component
 * @property {string=} size Button component sizes @see Button Component
 * @property {boolean=} dropup Change curet direction
 *    @see @link http://getbootstrap.com/components/#btn-dropdowns-dropup
 * @property {string=} layoutClassName Css classes for wraper up content
 * @property {string=} toggleClassName Css classes for toggle dispatcher
 * @property {boolean=} isOpen Is menu visible Default: false
 * @property {boolean=} closeOnBlur Will be close by blur Default: false
 * @module
 */
class ButtonDropdown extends Component {

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.containerId = `ButtonDropdown-${generateKey()}`
    this.state = { isOpen: this.props.isOpen }
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    option: PropTypes.string,
    size: PropTypes.string,
    dropup: PropTypes.bool,
    layoutClassName: PropTypes.string,
    toggleClassName: PropTypes.string,
    isOpen: PropTypes.bool,
    closeOnBlur: PropTypes.bool
  };

  static defaultProps = {
    dropup: false,
    size: null,
    isOpen: false,
    closeOnBlur: true
  };

  /**
   * Hangle toogle click event
   *
   * @param {SyntheticEvent} event
   */
  handleToogleClick(event) {
    const { isOpen } = this.state
    const { dispatch } = this.props
    event.preventDefault()

    this.setState({ isOpen: !isOpen })

    if (!isOpen) {
      this.props.dropdownOpened(this.containerId)
    }
  }

  /**
   * Handle on blur event
   */
  handleOnBlur() {
    setTimeout(() => {
      this.setState({ isOpen: false })
    }, 200)
  }

  /**
   * Renderer
   *
   * @return {ReactNode}
   */
  render() {
    const { children,
      layoutClassName,
      dropup,
      name,
      toggleClassName,
      option,
      size,
      closeOnBlur } = this.props,
      { isOpen } = this.state;

    const toogleClasses = composeClassName('dropdown-toggle', toggleClassName)
    const layoutClasses = composeClassName(
      'btn-group',
      dropup && 'dropup',
      isOpen && 'open',
      layoutClassName
    )

    return (
      <div className={layoutClasses}>
        <Button
          className={toogleClasses}
          option={option}
          size={size}
          onClick={this.handleToogleClick.bind(this)}
          onBlur={closeOnBlur ? this.handleOnBlur.bind(this) : null}>
          {name} <span className='caret'/>
        </Button>
        <ul className='dropdown-menu'>{children}</ul>
      </div>
    )
  }

}

export const ButtonDropdownContainer = connect(
  state => state.platform.dropdown.toObject(),
  { dropdownOpened }
)(ButtonDropdown)

/**
 * Split dropdown container
 * @see Bootstrap documentation {@link http://getbootstrap.com/components/#btn-dropdowns-split}
 *
 * @property {!string} name Visible label
 * @property {string=} option Button component options @see Button Component
 * @property {string=} size Button component sizes @see Button Component
 * @property {boolean=} dropup Change curet direction
 *    @see @link http://getbootstrap.com/components/#btn-dropdowns-dropup
 * @property {string=} layoutClassName Css classes for wraper up content
 * @property {string=} buttonType Type button @see Button component Defaut: button
 * @property {function(SyntheticEvent)=} onClick Button on click handler
 * @property {boolean=} isOpen Is menu visible Default: false
 * @property {boolean=} closeOnBlur Will be close by blur Default: false
 *
 * @module
 */
 class SplitDropdown extends Component {

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.containerId = 'SplitDropdown-' + MathUtils.generateKey()
    this.state = { isOpen: this.props.isOpen }
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    option: PropTypes.string,
    size: PropTypes.string,
    dropup: PropTypes.bool,
    layoutClassName: PropTypes.string,
    buttonType: PropTypes.string,
    onClick: PropTypes.func,
    isOpen: PropTypes.bool,
    closeOnBlur: PropTypes.bool
  };

  static defaultProps = {
    dropup: false,
    size: null,
    buttonType: 'button',
    isOpen: false,
    closeOnBlur: true
  };

  /**
   * Hangle toogle click event
   *
   * @param {SyntheticEvent} event
   */
  handleToogleClick(event) {
    const { isOpen } = this.state
    const { dispatch } = this.props
    event.preventDefault()

    this.setState({ isOpen: !isOpen })
    if (!isOpen) {
      this.props.dropdownOpened(this.containerId)
    }
  }

  /**
   * Handle on blur event
   */
  handleOnBlur() {
    setTimeout(() => {
      this.setState({ isOpen: false })
    }, 200)
  }

  /**
   * Renderer
   *
   * @return {ReactNode}
   */
  render() {
    const {
      children,
      layoutClassName,
      dropup,
      name,
      option,
      size,
      buttonType,
      onClick,
      closeOnBlur
    } = this.props
    const { isOpen } = this.state
    
    const layoutClasses = composeClassName(
      'btn-group',
      dropup && 'dropup',
      isOpen && 'open',
      layoutClassName
    )

    return (
      <div className={layoutClasses}>
        <Button
          type={buttonType}
          option={option}
          size={size}
          onClick={onClick}
        >
          {name}
        </Button>
        <Button
          className='dropdown-toggle'
          option={option}
          size={size}
          onClick={this.handleToogleClick.bind(this)}
          onBlur={closeOnBlur ? this.handleOnBlur.bind(this) : null}
        >
          <span className='caret'/>
        </Button>
        <ul className='dropdown-menu'>{children}</ul>
      </div>
    )
  }

}

export const SplitDropdownContainer = connect(
  state => state.platform.dropdown.toObject(),
  { dropdownOpened }
)(SplitDropdown)
