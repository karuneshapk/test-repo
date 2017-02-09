import React, { Component, PropTypes } from 'react'
import Immutable, { Iterable } from 'immutable'
import { connect } from 'react-redux'

import { showModal, hideModal } from 'apollo-library/actions/modalContainer'

/**
 * Component that wraps modal container content
 * to allow it to update on props change.
 * Will rerender modal only if any of the props
 * assigned to ModalWrapper change.
 *
 * @property {Boolean} show - whether to show the content
 *
 * @module
 */
export class ModalWrapper extends Component {

  static propTypes = {
    show: PropTypes.bool
  }

  componentWillMount() {
    const { show, showModal, children } = this.props
    if (show) {
      showModal(children)
    }
  }

  componentWillUnmount() {
    this.props.hideModal()
  }

  componentWillReceiveProps(newProps) {
    const props = this.props
    const { showModal, hideModal } = props
    const { show, children } = newProps

    if (!show && props.show) {
      hideModal()
    } else if (show && !props.show) {
      showModal(children)
    } else if (show) {
      for (let prop in newProps) {
        if (newProps.hasOwnProperty(prop) &&
          prop !== 'children' &&
          prop !== 'showModal' &&
          prop !== 'hideModal' &&
          prop !== 'show' &&
          this.areDifferent(newProps[prop], props[prop])
        ) {
          showModal(children)
          return
        }
      }
    }
  }

  /**
   * Checks the equality of two value.
   * Deep compares Immutable iterables,
   * but does simple check for other types of data.
   *
   * @property {*} newVal - first value to compare
   * @property {*} oldVal - second value to compare
   *
   * @return {Boolean}
   */
  areDifferent(newVal, oldVal) {
    if (Iterable.isIterable(newVal) &&
        Iterable.isIterable(oldVal) &&
        !Immutable.is(newVal, oldVal)
    ) {
      return true
    }
    if (newVal !== oldVal) {
      return true
    }
  }

  render() {
    return null
  }

}

export default connect(() => ({}), {
  showModal,
  hideModal
})(ModalWrapper)
