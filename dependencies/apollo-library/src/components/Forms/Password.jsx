import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import Button from 'apollo-library/components/Forms/Button'
import BaseInput from 'apollo-library/components/Forms/BaseInput'
import CommonMessages from 'apollo-library/messages/common'

/**
 * Password input component with text visibility toogling
 * @see {BaseInput}
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/#heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 *
 * @property {!string} inputName
 * @property {string} type
 *
 * @module
 */
export class Password extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    type: PropTypes.oneOf([ 'password', 'text' ])
  }

  static defaultProps = {
    type: 'password',
    autoComplete: 'off',
    autoFocus: false,
    disabled: false
  }

  constructor() {
    super(...arguments)

    this.state = { _readable: false }

    this.tooglePasswordVisibility = this.tooglePasswordVisibility.bind(this)
    this.onButtonBlur = this.onBlur.bind(this)
    this.assignInputComponent = this.assignInputComponent.bind(this)
    this.assignButtonComponent = this.assignButtonComponent.bind(this)
  }

  /**
   * a hack to check if the user is moving
   * from input to button (or vice versa) inside the component
   */
  onBlur(event) {
    window.setTimeout(() => {
      try {
        if (document.activeElement !== this.buttonComponent.getButtonComponent()
          && document.activeElement !== this.inputComponent.getInputComponent()) {
          this.props.formProps.onBlur()
        }
      } catch (e) {
        // @info component could no longer exist
      }
    }, 100)
  }

  tooglePasswordVisibility() {
    const { _readable } = this.state
    this.setState({ _readable: !_readable })
  }

  assignInputComponent(comp) {
    this.inputComponent = comp
  }

  assignButtonComponent(comp) {
    this.buttonComponent = comp
  }

  render() {
    const {
        type,
        disabled,
        formProps,
        intl: { formatMessage },
        ...props
      } = this.props,
      { _readable } = this.state

    var formPropsUpdated

    if (formProps && formProps.onBlur) {
      formPropsUpdated = {
        ...formProps,
        ...{ onBlur: event => this.onBlur(event) }
      }
    }

    const eyeClassName = `apl-icon-eye-${_readable ? 'hidden' : 'open'}`

    return (
      <BaseInput
        {...{ disabled }}
        {...props}
        ref={this.assignInputComponent}
        formProps={formPropsUpdated || formProps}
        type={(_readable ? 'text' : 'password')}
        postAddonType={BaseInput.ADDON_TYPES.BUTTON}
        postAddon={(
          <Button
            ref={this.assignButtonComponent}
            {...{ disabled }}
            onClick={this.tooglePasswordVisibility}
            onBlur={this.onButtonBlur}
          >
            <span className={`apl-icon ${eyeClassName}`} />
          </Button>
        )}
      />
    )
  }

}

export default injectIntl(Password)
