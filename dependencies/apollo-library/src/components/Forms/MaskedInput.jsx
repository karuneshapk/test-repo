import React, { Component, PropTypes } from 'react'

import { isDefined } from 'apollo-library/utils/common'

import { filterInputProps } from 'apollo-library/utils/props'

const DELETE_KEY = 46
const BACKSPACE_KEY = 8
const NO_SPECIAL_CHARACTER = 0

/**
 * Input addon component
 * Small component reflected
 *  @see {@url http://getbootstrap.com/components/#input-groups-basic}
 *
 * @property {!ADDON_TYPES} type
 * @property {!*} children
 */
export class MaskedInput extends Component {

  static propTypes = {
    formOnChange: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    maskRunner: PropTypes.func.isRequired,
    masks: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
      PropTypes.object
    ]),
    value: PropTypes.any,
    displayValue: PropTypes.any,
    caretPosition: PropTypes.number,
    maskInitial: PropTypes.bool
  }

  constructor() {
    super(...arguments)

    this.deleteButton = false
    this.backspaceButton = false
    this.isKeyPressed = false
    this.selectionRange = []
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
  }

  /**
   * Mask initial value if requested in props
   */
  componentWillMount() {
    const {
      formOnChange,
      maskRunner,
      masks,
      value,
      displayValue,
      caretPosition,
      maskInitial
    } = this.props

    if (maskInitial) {
      if (typeof maskRunner !== 'function' && __DEV__) {
        /* eslint-disable no-console */
        console.error('maskRunner must be a function.')
        /* eslint-enable no-console */
        return
      }

      const fieldValue = isDefined(displayValue) ? displayValue : value

      const masked = maskRunner(
        masks, fieldValue,
        value, displayValue, caretPosition,
        this.deleteButton, this.backspaceButton,
        this.selectionRange, this.isKeyPressed
      )

      if (typeof formOnChange === 'function') {
        formOnChange(masked.actualValue, masked.displayValue, masked.caretPosition)
      }
    }
  }

  /**
   * Info needs updating otherwise carret position will diverge
   */
  shouldComponentUpdate(newProps) {
    return true
  }

  /**
   * Set cursor position.
   */
  componentDidUpdate() {
    const { caretPosition } = this.props
    const node = this.refs.input

    if (isDefined(caretPosition) && node.selectionStart !== caretPosition) {
      node.setSelectionRange(caretPosition, caretPosition)
    }
  }


  /**
   * If the delete or backspace buttons were pressed,
   * remember the selection and which key was pressed.
   * Additionally, mark that a key was pressed
   * so the change event can send that info to masking function.
   *
   * @param {Object} event - react's onKeyDown event
   */
  handleKeyDown(event) {
    const {
      nativeEvent: {
        keyCode,
        which
      },
      target: {
        selectionStart,
        selectionEnd
      }
    } = event

    this.resetFlags()

    this.isKeyPressed = true

    if (keyCode === BACKSPACE_KEY || keyCode === DELETE_KEY
      && which !== NO_SPECIAL_CHARACTER) {
      if (selectionStart !== selectionEnd) {
        this.selectionRange = [ selectionStart, selectionEnd ]
      }
      if (keyCode === BACKSPACE_KEY) {
        this.backspaceButton = true
      } else if (keyCode === DELETE_KEY) {
        this.deleteButton = true
      }
    }
  }

  /**
   * If text was pasted, remember the selection
   *
   * @param {Object} event - react's onPaste event
   */
  handlePaste(event) {
    const {
      target: {
        selectionStart,
        selectionEnd
      }
    } = event

    this.resetFlags()

    if (selectionStart !== selectionEnd) {
      this.selectionRange = [ selectionStart, selectionEnd ]
    }
  }

  /**
   * Apply mask to value before sending it to the reducer
   *
   * @param {Object} event - react's onChange event
   */
  handleChange(event) {
    const {
      formOnChange,
      onChange,
      maskRunner,
      masks,
      value,
      displayValue,
      caretPosition
    } = this.props

    if (typeof maskRunner !== 'function' && __DEV__) {
      /* eslint-disable no-console */
      console.error('maskRunner must be a function.')
      /* eslint-enable no-console */
      return
    }

    const masked = maskRunner(
      masks,
      event,
      value,
      displayValue,
      caretPosition,
      this.deleteButton,
      this.backspaceButton,
      this.selectionRange,
      this.isKeyPressed
    )

    if (typeof formOnChange === 'function') {
      formOnChange(masked.actualValue, masked.displayValue, masked.caretPosition)
    }

    if (typeof onChange === 'function') {
      onChange(masked.actualValue, masked.displayValue, masked.caretPosition)
    }

    this.resetFlags()
  }


  /**
   * Reset all the event flags
   */
  resetFlags() {
    this.selectionRange = []
    this.backspaceButton = false
    this.deleteButton = false
    this.isKeyPressed = false
  }

  render() {
    const componentProps = {
      ...filterInputProps(this.props),
      onChange: this.handleChange,
      onKeyDown: this.handleKeyDown,
      onPaste: this.handlePaste
    }

    return <input ref="input" {...componentProps} />
  }

}

export default MaskedInput

