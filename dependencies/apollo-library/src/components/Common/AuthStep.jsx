import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'

import Form from 'apollo-library/containers/Form'
import FooterButtons from 'apollo-library/components/UI/FooterButtons'
import Password from 'apollo-library/components/Forms/Password'
import Alert from 'apollo-library/components/UI/Alert'
import Input from 'apollo-library/components/Forms/Input'
import ReCaptcha from 'apollo-library/components/Forms/ReCaptcha'
import NextSMSCountdown from 'apollo-library/containers/NextSMSCountdown'
import { COUNTDOWN_POSITION } from 'apollo-library/constants/components'
import { ACTIVACTION_CODES } from 'apollo-library/constants/authentication'
import authMessages from 'apollo-library/messages/authentication'
import commonMessages from 'apollo-library/messages/common'

/**
 * Component rendering one complete authentication step.
 *
 * This component is used for displaying an authentication step of an
 * authentication process. This type of authentication process is triggered
 * when the user tries to do a risky operation, like changing their own password
 * or withdrawing money. On requesting such an operation MW responds with a list
 * of auth scenarios, each of which contains a list of auth steps. This component
 * displays one of these steps.
 *
 * @property {ImmutableList} details - list of auth details in the auth step
 * @property {string} idAuthProcess - auth step unique id
 * @property {function} onSubmit - confirmation callback
 * @property {function} onCancel - cancel callback
 * @property {string|ReactNode} submitButtonText - submit button text
 * @property {string|ReactNode} submittingText - submit button text while submitting
 * @property {string|ReactNode} cancelButtonText - cancel button text
 * @property {Object} authProps - set of rendering props for different detail types
 * @property {boolean} wrongValue - if the server responded that the value submited was wrong
 * @property {string|ReactNode} wrongValueTextSingle
 *  - wrong value alert text for single detail auth step
 * @property {string|ReactNode} wrongValueTextMultiple
 * - wrong value alert text for multiple details auth step
 * @property {string|ReactNode} wrongValuePasswordText
 *  - wrong value alert text for single detail auth step of type password
 * @property {string|ReactNode} wrongValueSMSCodeText
 * - wrong value alert text for multiple details auth step of type SMS code
 * @property {Object} confirmButtonProps
 * @property {Object} cancelButtonProps
 * @property {string} orTextClasses
 * @property {string} orText
 *
 * @example
 * <AuthStep
 *   details={Immutable.List([{code: 'SMS'}, {code: 'LDAPPWD'}])}
 *   idAuthProcess={idAuthProcess}
 *   onSubmit={handleAuthStepSubmit}
 *   onCancel={cancelAuth}
 *   submittingText={
 *     formatMessage(messages.confirmAuthStep)
 *   }
 *   reCaptchaRequired={true}
 *   submitButtonText={
 *     formatMessage(messages.confirmingAuthStep)
 *   }
 *   authProps={{
 *     [ACTIVACTION_CODES.LDAPPWD]: {
 *       label: formatMessage(messages.passwordLabel),
 *       validators: ['required', 'longString']
 *     },
 *     [ACTIVACTION_CODES.SMS]: {
 *       label: formatMessage(messages.smsLabel)
 *     }
 *   }}
 *   wrongValue={serverError}
 * />
 *
 * @module
 * @class
 */
export class AuthStep extends Component {

  static propTypes = {
    details: ImmutablePropTypes.list,
    idAuthProcess: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    submittingText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    cancelButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    authProps: PropTypes.object,
    reCaptchaRequired: PropTypes.bool,
    wrongValue: PropTypes.bool,
    wrongValueTextSingle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    wrongValueTextMultiple: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    wrongValuePasswordText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    wrongValueSMSCodeText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    confirmButtonProps: PropTypes.object,
    cancelButtonProps: PropTypes.object,
    orTextClasses: PropTypes.string,
    orText: PropTypes.string
  }

  static defaultProps = {
    details: List([]),
    submitButtonText: <FormattedMessage {...commonMessages.submit} />,
    cancelButtonText: <FormattedMessage {...commonMessages.cancel} />,
    wrongValueTextMultiple:
      <FormattedMessage {...authMessages.wrongValueTextMultiple} />,
    wrongValueTextSingle:
      <FormattedMessage {...authMessages.wrongValueTextSingle} />,
    wrongValuePasswordText:
      <FormattedMessage {...authMessages.wrongValuePassword} />,
    wrongValueSMSCodeText:
      <FormattedMessage {...authMessages.wrongValueSMSCode} />,
    wrongValue: false,
    confirmButtonProps: {
      option: 'primary'
    }
  }

  /**
   * Check if reCaptcha is required and add its response to form data
   *
   * @param {Object} data - form values
   * @param {string} formName - name of the form
   */
  handleSubmit(data, formName) {
    const { onSubmit, reCaptchaRequired } = this.props

    if (reCaptchaRequired) {
      onSubmit({
        ...data,
        recaptchaResponse: this.refs.recaptcha.getChallengeResult()
      }, formName)
    } else {
      onSubmit(data, formName)
    }
  }

  /**
   * Renders password authentication component
   *
   * @param {string} detailCode - authentication type code (received from MW)
   * @param {Object} detailProps - a set of rendering props
   * @param {boolean} autoFocus - whether to set autofocus on input field
   *
   * @returns {ReactNode}
   */
  renderPasswordAuth(detailCode, detailProps, autoFocus) {
    const {
      inputProps,
      heading,
      label,
      validators,
      showHeading,
      children
    } = detailProps

    const headingText = heading
      || <FormattedMessage {...authMessages.passwordAuthHeading} />
    const labelText = label
      || <FormattedMessage {...authMessages.passwordAuthInputLabel} />
    const passwordProps = inputProps || {}
    const validatorList = validators || ['required']

    return (
      <div key={detailCode} className="margin-b-m">
        {showHeading &&
          <h2>
            {headingText}
          </h2>
        }

        <Password
          label={labelText}
          labelProps={{className: 'block'}}
          validators={validatorList}
          inputName={detailCode}
          autoFocus={autoFocus}
          {...passwordProps}
        />

        {children}
      </div>
    )
  }

  /**
   * Renders SMS code authentication component
   *
   * @param {string} detailCode - authentication type code (received from MW)
   * @param {Object} detailProps - a set of rendering props
   * @param {boolean} autoFocus - whether to set autofocus on input field
   *
   * @returns {ReactNode}
   */
  renderSMSAuth(detailCode, detailProps, autoFocus) {
    const {
      inputProps,
      heading,
      label,
      validators,
      showHeading,
      children,
      countdownProps
    } = detailProps

    const headingText = heading
      || <FormattedMessage {...authMessages.SMSAuthHeading} />
    const labelText = label
      || <FormattedMessage {...authMessages.SMSAuthInputLabel} />
    const SMSProps = inputProps || {}
    const validatorList = validators || ['required']
    const countdownPosition = (countdownProps && countdownProps['position'])
      ? countdownProps['position']
      : COUNTDOWN_POSITION.AFTER_INPUT

    return (
      <div key={detailCode} className="SMSAuth margin-b-m">
        {showHeading && <h2>{headingText}</h2>}
        {countdownProps && countdownPosition === COUNTDOWN_POSITION.BEFORE_INPUT &&
          <div className="margin-t-l">
            <NextSMSCountdown {...countdownProps} />
          </div>
        }
        <Input
          label={labelText}
          labelProps={{className: 'block'}}
          validators={validatorList}
          inputName={detailCode}
          autoFocus={autoFocus}
          className="caps"
          {...SMSProps}
        />
        {countdownProps && countdownPosition === COUNTDOWN_POSITION.AFTER_INPUT &&
          <div className="margin-t-l">
            <NextSMSCountdown {...countdownProps} />
          </div>
        }
        {children}
      </div>
    )
  }

  /**
   * Render, my dear, like you never rendered before
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      details,
      idAuthProcess,
      onCancel,
      authProps,
      submitButtonText,
      submittingText,
      cancelButtonText,
      reCaptchaRequired,
      wrongValue,
      wrongValueTextSingle,
      wrongValueTextMultiple,
      wrongValuePasswordText,
      wrongValueSMSCodeText,
      className,
      confirmButtonProps,
      cancelButtonProps,
      orTextClasses,
      orText
    } = this.props

    var errorText = wrongValueTextMultiple
    if (details.size === 1) {
      const code = details.getIn([ 0, 'code' ])
      if (code === ACTIVACTION_CODES.SMS) {
        errorText = wrongValueSMSCodeText
      } else if (code === ACTIVACTION_CODES.PWD
        || code === ACTIVACTION_CODES.LDAPPWD) {
        errorText = wrongValuePasswordText
      } else {
        errorText = wrongValueTextSingle
      }
    }

    const confirmProps = {
      type: 'submit',
      ...confirmButtonProps
    }

    return (
      <Form
        className={className}
        formName={idAuthProcess}
        onSubmit={this.handleSubmit.bind(this)}
      >
        {details.map((detail, key) => {
          const detailCode = detail.get('code')
          const detailProps = (authProps[detailCode] || {})
          const autoFocus = !key

          switch (detailCode) {

            case ACTIVACTION_CODES.SMS: {
              return this.renderSMSAuth(detailCode, detailProps, autoFocus)
            }

            case ACTIVACTION_CODES.PWD:
            case ACTIVACTION_CODES.LDAPPWD: {
              return this.renderPasswordAuth(detailCode, detailProps, autoFocus)
            }

          }

        })}
        {wrongValue &&
          <Alert type="danger" text={errorText} />
        }
        {reCaptchaRequired &&
          <ReCaptcha
            ref="recaptcha"
            sitekey="6Lc9Th0TAAAAAFK-­mHyKpoY5anCmFEAAYkrcYJoo"
          />
        }
        <FooterButtons
          confirmText={submitButtonText}
          submittingText={submittingText}
          confirmButtonProps={confirmProps}
          cancelButtonProps={cancelButtonProps}
          orTextClasses={orTextClasses}
          formStatus
          cancelText={cancelButtonText}
          orText={orText}
          cancelClick={onCancel}
        />
      </Form>
    )
  }

}

export default AuthStep
