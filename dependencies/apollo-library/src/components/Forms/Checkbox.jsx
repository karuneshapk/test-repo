import React, { Component, PropTypes } from 'react'

import { isUndefined, isDefined } from 'apollo-library/utils/common'
import { composeClassName } from 'apollo-library/utils/components'
import BaseInput from 'apollo-library/components/Forms/BaseInput'

/**
 * Checkbox input component
 *
 * Other properties for use:
 * @see {BaseInput}
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/#heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 *
 * @property {!string} inputName
 * @property {boolean} checked
 *
 * @module
 */
export class Checkbox extends Component {

  static propTypes = {
    groupClassName: PropTypes.string,
    formProps: PropTypes.object,
    value: PropTypes.any,
    type: PropTypes.oneOf([ 'checkbox' ]),
    inputName: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    inline: PropTypes.bool
  }

  static defaultProps = {
    type: 'checkbox',
    inline: false
  }

  /**
   * Checkbox component renderer
   *
   * @return {ReactNode}
   */
  render() {
    const {
      groupClassName,
      defaultChecked,
      checked,
      formProps,
      inline,
      value,
      ...props
    } = this.props

    const groupClasses = composeClassName(
      inline ? 'checkbox-inline' : 'checkbox', groupClassName
    )

    const checkboxFormProps = {
      ...formProps,
      defaultChecked,
      checked: (!formProps.hasOwnProperty('checked')
        ? defaultChecked
        : (isUndefined(checked)
            ? formProps.checked
            : checked
          )
        ),
      value
    }

    return (
      <BaseInput
        groupClassName={groupClasses}
        labelPosition={BaseInput.LABEL_POSITION.AFTER}
        formControled={false}
        formProps={(formProps.hasOwnProperty('checked')
          ? checkboxFormProps
          : {
            defaultChecked,
            value
          }
        )}
        {...props}
        type="checkbox"
      />
    )
  }

}

export default Checkbox
