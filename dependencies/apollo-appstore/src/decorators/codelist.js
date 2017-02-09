import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import { isUndefined } from 'apollo-library/utils/common'
import { getCodeLists } from 'apollo-appstore/actions/codelistActions'

/**
 * Creates a wrapper for sharing interface
 *
 * @param {Array} requestedCodeLists - an array of requested codelists
 * @param {ReactNode} WrappedComponent - component to be wrapped
 * to be shown
 *
 * @returns {ReactNode}
 */
const createWrappedComponent = (requestedCodeLists, WrappedComponent) => {

  /**
   * Wrapping class for rights
   *
   * @property {Array} codelists - an array of requested codelists
   */
  class CodeListInterface extends Component {

    static propTypes = {
      queue: ImmutablePropTypes.map,
      codelists: ImmutablePropTypes.map,
      getCodeLists: PropTypes.func.isRequired
    }

    /**
     * Check codelists when component loads
     */
    componentWillMount() {
      const {
        codelists,
        queue
      } = this.props

      if (codelists) {
        const codeListsToLoad = {}

        requestedCodeLists.forEach(codelistPath => {
          const immutablePath = codelistPath.split('.') || []

          // Check if we dont have data and if we dont start load data from API
          if (isUndefined(codelists.getIn(immutablePath)) &&
          queue.has(immutablePath[0]) === false) {
            codeListsToLoad[immutablePath[0]] = true
          }
        })

        this.loadCodeLists(Object.keys(codeListsToLoad))
      }
    }

    /**
     * Loads codelists
     *
     * @param {Array<string>} services - list of services to load codelists from
     */
    loadCodeLists(services) {
      services.forEach(service => this.props.getCodeLists(service))
    }

    /**
     * Renders wrapped component
     *
     * @returns {ReactNode}
     */
    render() {
      // remove unused props
      /* eslint-disable no-unused-vars */
      const {
        queue,
        getCodeLists,
        ...props
      } = this.props
      /* eslint-enable no-unused-vars */
      return (
        <WrappedComponent
          {...props}
        />
      )
    }
  }

  return connect(state => ({
    codelists: state.root.codelists.get('lists'),
    queue: state.root.codelists.get('queue')
  }), {
    getCodeLists
  })(CodeListInterface)
}

/**
 * Inject shared interface into a component
 *
 * @param {Array.<String>} requestedCodeLists - a list of shared data to provide
 *  to component
 * @param {ReactNode} WrappedComponent - component to be wrapped with rights
 *
 * @returns {ReactNode}
 */
export const injectCodeLists = createWrappedComponent
