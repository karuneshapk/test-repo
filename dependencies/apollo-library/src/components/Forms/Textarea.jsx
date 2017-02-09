import React, { Component, PropTypes } from 'react'

import BaseInput from 'apollo-library/components/Forms/BaseInput'

/**
 * Textarea form component
 * Other properties for use:
 * @see {BaseInput}
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/#heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 * @see {@url http://getbootstrap.com/css/#textarea}
 *
 * @property {!string} inputName
 * @property {number} row
 * @property {number} col
 *
 * @module
 */
export class Textarea extends Component {

  static PropTypes = {
    inputName: PropTypes.string.isRequired,
    type: PropTypes.oneOf([ 'textarea' ]),
    rows: PropTypes.number,
    cols: PropTypes.number
  }

  static defaultProps = {
    rows: 3,
    type: 'textarea'
  }

  render() {
    return <BaseInput {...this.props} type="textarea" />
  }

}

export default Textarea

