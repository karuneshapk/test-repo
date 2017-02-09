import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isDefined, isNil } from 'apollo-library/utils/common'
import { AS_AGENDA_RIGHTS } from 'apollo-appstore/constants/agendas'

/**
 * Creates a wrapper for rights component
 *
 * @param {ReactNode} WrappedComponent - component to be wrapped
 * @param {string?} requiredComponentRight - required right for whole component
 * to be shown
 *
 * @returns {ReactNode}
 */
const createWrappedComponent = (WrappedComponent, requiredComponentRight = null) => {

  /**
   * Wrapping class for rights
   */
  class RequiredRights extends Component {

    static propTypes = {
      rights: PropTypes.object
    };

    static contextTypes = {
      moduleName: PropTypes.string,
    };

    /**
     * Renders wrapped component
     *
     * @returns {ReactNode}
     */
    render() {
      const {
        props: { rights },
        context: { moduleName }
      } = this

      const checkRights = (rightsSegment = moduleName, requiredRight) => {
        const segmentRights = rights && rightsSegment && rights.get(rightsSegment)
        if (isNil(requiredRight)) {
          return isDefined(segmentRights)
        } else if (Array.isArray(requiredRight)) {
          return requiredRight.every(right => (segmentRights && segmentRights.includes(right)))
        } else {
          return segmentRights && segmentRights.includes(requiredRight)
        }
      }

      const hasRights = rights ? checkRights : () => false

      var Component = (
        <WrappedComponent
          {...this.props}
          hasRights={hasRights}
        />
      )

      return (requiredComponentRight
        ? hasRights(...requiredComponentRight) && Component
        : Component
      )
    }
  }

  return connect(state => ({
    rights: state.root.agendas.get(AS_AGENDA_RIGHTS)
  }))(RequiredRights)
}

/**
 * Inject rights into a component
 *
 * @param {ReactNode} WrappedComponent - component to be wrapped with rights
 * @returns {ReactNode}
 */
export const injectRights = WrappedComponent =>
  createWrappedComponent(WrappedComponent)

/**
 * Shows component only when user has rights to see the component
 *
 * @param {string} right - required right to see the component
 * @param {function} WrappedComponent - wrapped react component
 *
 * @returns {function}
 */
export const componentRights = (right, WrappedComponent) =>
  createWrappedComponent(WrappedComponent, right)
