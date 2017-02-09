import React, { Component, PropTypes, Children } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import Waypoint from 'apollo-library/components/Common/Waypoint'

const HOP_SIZE = 20

export class LongTable extends Component {

  static propTypes = {
    bordered: PropTypes.bool,
    condensed: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool,
    striped: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string.isRequired
  }

  static defaultProps = {
    bordered: false,
    condensed: false,
    hover: false,
    responsive: false,
    striped: false
  }

  constructor(...props) {
    super(...props);

    this.state = {
      visibleItems: 0, // how many items will be rendered now
      thead: null,
      tbody: [],
      tfoot: null
    }
  }

  /*
   * Reset current lazy renderer and let it behave like its rendered first time
   */
  resetLazyRenderer() {
    this.setState({ visibleItems: 0 }, this.showMore)
  }

  decoupleChildren() {
    var thead = null
    var tbody = []
    var tfoot = null

    const { children } = this.props

    React.Children.forEach(children, (child, i) => {
      switch (child.type) {
        
        case 'thead': {
          thead = child
          break
        }

        case 'tbody': {
          tbody.push(child.props.children || [])
          break
        }

        case 'tfoot': {
          tfoot = child
          break
        }

      }
    })

    this.setState({
      thead: thead,
      tbody: tbody,
      tfoot: tfoot
    })
  }

  componentDidMount() {
    // componetWillRecieveProps is not part of initial lifecycle so some
    // code this duplicity call is indeed necessary
    this.resetLazyRenderer()
    this.decoupleChildren()
  }

  componentWillReceiveProps(nextProps) {
    // when we expect new properties reset visible items to 0, finish props
    // lifecycle and then trigger gracefull update
    this.resetLazyRenderer()
    this.decoupleChildren()
  }

  /**
   * Increase lazy rendering by offset of 30 element
   */
  showMore() {
    const { visibleItems } = this.state
    // jumping by 30 items is a median between fast rendering and too much
    // cascade updating, 30 is just a right offset
    let nextHop = (visibleItems + HOP_SIZE)

    if (nextHop !== visibleItems) {
      this.setState({ visibleItems: nextHop })
      return true
    } else {
      return false
    }
  }

  /**
   * Renders what is visible as fast as possible, lazy renders additional rows,
   * does not mutate, modify or save data outside of props, just slide offset
   * pivot
   */
  renderTable() {
    const {
      bordered,
      condensed,
      hover,
      striped,
      className,
      children,
      id
    } = this.props

    const { thead, tbody, tfoot } = this.state

    var classes = composeClassName(
      'table-long',
      bordered && 'table-bordered',
      condensed && 'table-condensed',
      hover && 'table-hover',
      striped && 'table-striped',
      className
    )

    let { visibleItems } = this.state

    let body = [ thead ]

    for (let j = 0; visibleItems && j<tbody.length; j++) {
      let rows = []

      for (let i = 0; visibleItems && i < tbody[j].length; i++) {
        let row = tbody[j][i]
        rows.push(row)
        (visibleItems--)
      }

      if (!visibleItems) {
        body.push(
          <tbody key={`${id}-${j}`}>
            {rows}
            <tr key={`${id}-waypoint`} className='waypoint'>
              <td>
                <Waypoint
                  onVisible={this.showMore.bind(this)}
                />
              </td>
            </tr>
          </tbody>
        )
      } else {
        body.push(
          <tbody key={`${id}-${j}`}>
            {rows}
          </tbody>
        )
      }
    }

    body.push(tfoot)

    return (
      <table className={classes}>
        {body}
      </table>
    )
  }

  render() {
    var table = this.renderTable()

    return this.props.responsive
      ? <div className='table-responsive'>{table}</div>
      : table
  }

}

export default LongTable

