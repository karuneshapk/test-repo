import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import CommonMessages from 'apollo-library/messages/common'
import Form from 'apollo-library/containers/Form'
import Button from 'apollo-library/components/Forms/Button'
import ValidationMessage from 'apollo-library/components/Forms/ValidationMessage'
import { ADDON_TYPES, CONTEXTUAL_COLORS } from 'apollo-library/constants/components'
import { LONG_STRING_MIN } from 'apollo-library/constants/general'
import { composeClassName } from 'apollo-library/utils/components'
import { filterInputProps } from 'apollo-library/utils/props'

class Input extends Component {

  render() {
    const {
      formProps,
      inputName,
      placeholder,
      formStatusProps,
      sendToButton,
      buttonText,
      noValidation,
      groupClassName,
      disabled,
      ...props
    } = this.props
    const error = (formProps && formProps.error)
    const invalid = (!!error)
    const message = error
    const groupClasses = composeClassName(
      invalid && 'has-error',
      disabled && 'disabled',
      groupClassName
    )
    
    const inputProps = filterInputProps(props)

    return (
      <div className={groupClasses}>
        <div className='input-group'>
          <input
            type="text"
            onChange={formProps && formProps.onChange}
            onBlur={formProps && formProps.onBlur}
            onFocus={formProps && formProps.onFocus}
            className='form-control'
            inputName={inputName}
            placeholder={placeholder || formatMessage(CommonMessages.simpleSearchPlaceholder)}
            validators={['required', {
              name: 'longString',
              messageArgs: { count: LONG_STRING_MIN }
            }]}
            {...inputProps}
          />

          <span className={'input-group-btn'}>
            <Button
              type='submit'
              option={CONTEXTUAL_COLORS.PRIMARY}
              iconType='search'
              formStatusProps={formStatusProps}
              {...sendToButton}
            >
              {buttonText || formatMessage(CommonMessages.simpleSearchSubmitButton)}
            </Button>
          </span>
        </div>

        {invalid && !noValidation &&
          <ValidationMessage
            show={invalid}
            message={message}
          />
        }
      </div>
    )
  }

}

/**
 * Component for simple string search of parties
 * Default props comming to input component
 * @see {Input}
 * @see {@url http://www.w3schools.com/html/html_form_attributes.asp}
 * @see {@url https://docs.google.com/document/d/18-6OIKNDqIQcV9IuyL98FURkwDrcHU2or38JnCye-cM/#heading=h.strraxa964d0}
 * @see {@url https://facebook.github.io/react/docs/forms.html}
 *
 * @property {!function} onSubmit - search form submit callback
 * @property {string} buttonText
 * @property {string} formName
 * @property {string} inputName
 * @property {Object} sendToButton
 * @property {Object} sendToForm
 *
 * @module
 */
export class SimpleSearch extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    buttonText: PropTypes.string,
    formName: PropTypes.string,
    inputName: PropTypes.string,
    sendToButton: PropTypes.object,
    sendToForm: PropTypes.object
  }

  static defaultProps = {
    onSubmit: () => {},
    sendToButton: {},
    formOptions: {},
    formName: 'simpleSearch',
    inputName: 'searchString'
  }

  render() {
    const {
      onSubmit,
      buttonText,
      formName,
      inputName,
      sendToButton,
      sendToForm,
      intl: { formatMessage },
      placeholder,
      keepForm,
      formStatus,
      noValidation,
      groupClassName,
      disabled,
      ...props
    } = this.props

    return (
      <Form
        onSubmit={onSubmit}
        formName={formName}
        keepForm={keepForm}
        {...sendToForm}
      >
        <Input
          inputName={inputName}
          placeholder={placeholder}
          formStatus={formStatus}
          sendToButton={sendToButton}
          buttonText={buttonText}
          noValidation={noValidation}
          groupClassName={groupClassName}
          disabled={disabled}
          {...props}
        />
      </Form>
    )
  }

}

export default injectIntl(SimpleSearch)
