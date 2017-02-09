import React from 'react'
import invariant from 'invariant'

Route.propTypes = {
  index: React.PropTypes.bool,
  path: React.PropTypes.string,
  module: React.PropTypes.string,
  component: React.PropTypes.func,
  onNotFound: React.PropTypes.func
}

/**
 * This Route is taken from react-router project and rewritten to ES6 syntax
 *
 * A <Route> is used to declare which components are rendered to the
 * page when the URL matches a given pattern.
 *
 * Routes are arranged in a nested tree structure. When a new URL is
 * requested, the tree is searched depth-first to find a route whose
 * path matches the URL.  When one is found, all routes in the tree
 * that lead to it are considered "active" and their components are
 * rendered into the DOM, nested in the same order as in the tree.
 */
export default function Route() {
  invariant(
    false,
    '<Route> elements are for router configuration only and should not be ' +
    'rendered'
  )
}
