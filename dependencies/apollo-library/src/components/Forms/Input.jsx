import React, { Component, PropTypes } from 'react'

import BaseInput from 'apollo-library/components/Forms/BaseInput'

/**
 * Base input component
 *
 * Other available property:
 * @see {BaseInput}
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/#heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 *
 * @module
 */
export class Input extends Component {

  static propTypes = {
    type: PropTypes.oneOf(['text'])
  }

  static defaultProps = {
    type: 'text'
  }

  render() {
    const { type, ...props } = this.props

    return (
      <BaseInput type='text' {...props} />
    )
  }

}

export default Input
