import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import { isUndefined } from 'apollo-library/utils/common'
import BaseInput from 'apollo-library/components/Forms/BaseInput'

/**
 * Radio input component
 *
 * Other properties for use:
 * @see {BaseInput}
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/#heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 *
 * @property {!string} inputName Input name is diferent for radio button
 * @property {!string} name Name is for all html group same
 * @property {!*} value
 *
 * @module
 */
export class Radio extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    type: PropTypes.oneOf(['radio'])
  }

  static defaultProps = {
    type: 'radio'
  }

  render() {
    const {
      groupClassName,
      formProps,
      value,
      defaultChecked,
      checked,
      ...props
    } = this.props

    const groupClasses = composeClassName('radio', groupClassName)
    const radioFormProps = {
      ...formProps,
      checked: (formProps.hasOwnProperty('checked')
        ? (isUndefined(checked)
            ? formProps.checked
            : checked
          )
        : defaultChecked
      ),
      value
    }

    return (
      <BaseInput
        type='radio'
        groupClassName={groupClasses}
        labelPosition={BaseInput.LABEL_POSITION.AFTER}
        formControled={false}
        formProps={(!formProps.hasOwnProperty('checked')
          ? {
            defaultChecked,
            value
          }
          : radioFormProps)
        }
        {...props}
      />
    )
  }

}

export default Radio

