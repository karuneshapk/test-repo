import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

const POSITIONS = {
  above: 'above',
  inside: 'inside',
  below: 'below'
}

/**
 * Calls a function when you scroll to the element.
 * enhanced from https://raw.githubusercontent.com/brigade/react-waypoint/master/src/waypoint.jsx
 */
export class Waypoint extends Component {

  static propTypes = {
    onVisible: PropTypes.func,
    preFill: PropTypes.bool
  }

  static defaultProps = {
    onVisible: () => {},
    preFill: true
  }

  /**
   * Constructor
   */
  constructor(...props) {
    super(...props)

    // thanks https://github.com/moreartyjs/moreartyjs/issues/84
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
    this.scrollableAncestor = this.findScrollableAncestor()
    this.scrollableAncestor.addEventListener('scroll', this.handleScroll.bind(this))
    window.addEventListener('resize', this.handleScroll.bind(this))
    if (this.props.preFill) {
      this.fillScreen()
    }
  }

  componentDidUpdate() {
    // The element may have moved.
    if (this.props.preFill) {
      this.fillScreen()
    }
  }

  componentWillUnmount() {
    this.mounted = false
    if (this.scrollableAncestor) {
      this.scrollableAncestor.removeEventListener('scroll', this.handleScroll.bind(this))
    }
    window.removeEventListener('resize', this.handleScroll.bind(this))
  }

  /**
   * Check if the component is visible or not
   *
   * @return {Boolean} true if it's visible otherwise false
   */
  isComponentVisible() {
    var node = ReactDOM.findDOMNode(this)
    do {
      const style = window.getComputedStyle(node)
      const display = style.getPropertyValue('display')
      const visibility =  style.getPropertyValue('visibility')

      if (display === 'none' || visibility === 'hidden') {
        return false
      }
    } while((node = node.parentNode) && node !== document)

    return true
  }

  /**
   * Traverses up the DOM to find an ancestor container which has an overflow
   * style that allows for scrolling.
   *
   * @return {Object} the closest ancestor element with an overflow style that
   *   allows for scrolling. If none is found, the `window` object is returned
   *   as a fallback.
   */
  findScrollableAncestor() {
    let node = ReactDOM.findDOMNode(this)

    while (node.parentNode) {
      node = node.parentNode

      if (node === document) {
        // This particular node does not have a computed style.
        continue
      }

      if (node === document.documentElement) {
        // This particular node does not have a scroll bar, it uses the window.
        continue
      }

      const style = window.getComputedStyle(node)
      const overflowY = style.getPropertyValue('overflow-y') ||
        style.getPropertyValue('overflow')

      if (overflowY === 'auto' || overflowY === 'scroll') {
        return node
      }
    }

    // A scrollable ancestor element was not found, which means that we need to
    // do stuff on window.
    return window
  }

  fillScreen() {
    if (!this.mounted || !this.isComponentVisible()) {
      return
    }

    const currentPosition = this.currentPosition()
    const previousPosition = this.previousPosition || null

    // Save previous position as early as possible to prevent cycles
    this.previousPosition = currentPosition

    if (currentPosition === POSITIONS.inside) {
      this.props.onVisible.call(this, undefined, previousPosition)
    }
  }

  /**
   * @param {Object} event - the native scroll event coming from the scrollable
   *   ancestor, or resize event coming from the window. Will be undefined if
   *   called by a React lifecyle method
   */
  handleScroll(event) {
    if (!this.mounted || !this.isComponentVisible()) {
      return
    }

    const currentPosition = this.currentPosition()
    const previousPosition = this.previousPosition || null

    // Save previous position as early as possible to prevent cycles
    this.previousPosition = currentPosition

    if (previousPosition === currentPosition) {
      // No change since last trigger
      return
    }

    if (currentPosition === POSITIONS.inside) {
      this.props.onVisible.call(this, event, previousPosition)
    }

    const isRapidScrollDown = previousPosition === POSITIONS.below &&
                              currentPosition === POSITIONS.above
    const isRapidScrollUp =   previousPosition === POSITIONS.above &&
                              currentPosition === POSITIONS.below
    
    if (isRapidScrollDown || isRapidScrollUp) {
      // If the scroll event isn't fired often enough to occur while the
      // waypoint was visible, we trigger both callbacks anyway.
      this.props.onVisible.call(this, event, previousPosition)
    }
  }

  /**
   * @param {Object} node
   * @return {Number}
   */
  distanceToTopOfScrollableAncestor(node) {
    if (this.scrollableAncestor !== window && !node.offsetParent) {
      throw new Error(`
        The scrollable ancestor of Waypoint needs to have positioning to 
        properly determine position of Waypoint (e.g. 'position: relative;')
      `)
    }

    if (node.offsetParent === this.scrollableAncestor || !node.offsetParent) {
      return node.offsetTop
    } else {
      return node.offsetTop +
        this.distanceToTopOfScrollableAncestor(node.offsetParent)
    }
  }

  /**
   * @returns {boolean} true if scrolled down almost to the end of the scrollable
   *   ancestor element.
   */
  currentPosition() {
    const waypointTop =
      this.distanceToTopOfScrollableAncestor(ReactDOM.findDOMNode(this))
    
    let contextHeight
    let contextScrollTop

    if (this.scrollableAncestor === window) {
      contextHeight = window.innerHeight
      contextScrollTop = window.pageYOffset
    } else {
      contextHeight = this.scrollableAncestor.offsetHeight
      contextScrollTop = this.scrollableAncestor.scrollTop
    }

    const thresholdPx = contextHeight
    const isBelowTop = (contextScrollTop <= waypointTop + thresholdPx)
    
    if (!isBelowTop) {
      return POSITIONS.above
    }

    const contextBottom = (contextScrollTop + contextHeight)
    const isAboveBottom = (contextBottom >= waypointTop - thresholdPx)
    
    if (!isAboveBottom) {
      return POSITIONS.below
    }

    return POSITIONS.inside
  }

  /**
   * Are you sure?
   *
   * @return {ReactNode}
   */
  render() {
    // We need an element that we can locate in the DOM to determine where it is
    // rendered relative to the top of its context.
    return <span style={{ fontSize: 0 }} />
  }

}


export default Waypoint
