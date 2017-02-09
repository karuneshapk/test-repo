import React from 'react'

/**
 * Creates wrapper around a component
 * @param {function} Wrapper - wrapping component
 * @param {function} Component - wrapped component
 * @returns {ReactNode}
 */
export const createComponentWrapper = (Wrapper, Component) => {

  /**
   * Wrapper component
   */
  class WrapperComponent extends React.Component {
    /**
     * Renders wrapper around a component
     * @returns {ReactNode}
     */
    render() {
      return (
        <Wrapper>
          <Component {...this.props} />
        </Wrapper>
      )
    }
  }

  return WrapperComponent
}
