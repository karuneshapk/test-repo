import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

/**
 * Element acting as a container for modal windows
 * Use: import actions from platform/actions/modalContainer to your component
 * and call action showModal, passing the content to be rendered
 * (usually platform/components/modal), and hideModal to remove it
 *
 * @module
 */
export class Modals extends Component {

  render() {
    return (
      <div id='modals'>
        <ReactCSSTransitionGroup
          transitionName='animation_modal'
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}
        >
          {this.props.modal ? this.props.modal : <div />}
        </ReactCSSTransitionGroup>
      </div>
    )
  }

}

export default connect(state => ({
  modal: state.platform.modal
}), {
  pushState
})(Modals)
