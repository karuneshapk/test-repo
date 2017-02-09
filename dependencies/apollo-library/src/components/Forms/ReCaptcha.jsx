import React, { Component, PropTypes } from 'react'

import { isDefined, isNil } from 'apollo-library/utils/common'

const GLOBAL_RECAPTCHA_CALLBACK = 'grecaptchaProxy'
const RECAPTCHA_EVENT = 'recaptchaChallenge'

/**
 * Very simple React component wrapper for the Google's ReCaptcha2.
 *
 * @example
 *
 * Usage:
 *   <ReCaptcha
 *     ref="recaptcha"
 *     sitekey="6Lc9Th0TAAAAAFK­mHyKpoY5anCmFEAAYkrcYJoo"
 *     onChallengeSolved={result => {debugger}}
 *   />
 *
 * submitForm(payload) {
 *   const { reCaptchaRequired } = this.props
 *
 *   if (reCaptchaRequired) {
 *     payload.reCaptchaResponse = this.refs.recaptcha.getChallengeResult()
 *   }
 *   this.props.onUserRegistration(payload)
 * }
 *
 */

class ReCaptchaNode extends Component {

  render() {
    return (
      <div
        className="g-recaptcha"
        data-sitekey={this.props.sitekey}
        data-callback={GLOBAL_RECAPTCHA_CALLBACK}
      />
    )
  }

}

export class ReCaptcha extends Component {

  static propTypes = {
    sitekey: PropTypes.string.isRequired,
    onChallengeSolved: PropTypes.func
  }

  /**
   * @constructor
   *
   * @extends {Component}
   */
  constructor() {
    super(...arguments)

    this.ticker = undefined
    this.onChallengeSolved = this.onChallengeSolved.bind(this)
  }

  /**
   * @param {CustomEvent} event - callback
   */
  onChallengeSolved(event) {
    if (isDefined(event.detail.recaptchaResponse)) {
      const { recaptchaResponse } = event.detail
      if (isDefined(this.props.onChallengeSolved)) {
        this.props.onChallengeSolved(recaptchaResponse)
      }
    }
  }

  /**
   * Before the component will be mounted, creates all necessary DOM
   * structures, required by the ReCaptcha library.
   */
  componentWillMount() {
    //@info prevent multiple forms to hijack or override recaptcha script
    if (isNil(document.getElementById('gReCaptcha'))) {
      this.reCaptchaScript = document.createElement('script')
      this.reCaptchaScript.async = true
      this.reCaptchaScript.id = 'gReCaptcha'
      this.reCaptchaScript.type = 'text/javascript'
      this.reCaptchaScript.src = 'https://www.google.com/recaptcha/api.js'
      document.getElementsByTagName('head')[0].appendChild(this.reCaptchaScript)
      window[GLOBAL_RECAPTCHA_CALLBACK] = result => {
        document.dispatchEvent(new CustomEvent(RECAPTCHA_EVENT, {
          detail: { recaptchaResponse: result },
          bubbles: true,
          cancelable: false
        }))
      }
    }

    document.removeEventListener(RECAPTCHA_EVENT, this.onChallengeSolved)
    document.addEventListener(RECAPTCHA_EVENT, this.onChallengeSolved, false)
  }

  /**
   * Before the component will be unmounted, removes all created DOM structures.
   */
  componentWillUnmount() {
    document.removeEventListener(RECAPTCHA_EVENT, this.onChallengeSolved)
    //@info prevent multiple forms to remove other form's recapcha node
    //if it wasn't added by this component
    if (isDefined(this.reCaptchaScript)) {
      delete window[GLOBAL_RECAPTCHA_CALLBACK]
      this.reCaptchaScript.parentNode.removeChild(this.reCaptchaScript)
      delete this.reCaptchaScript
    }
  }

  /**
   * Obtain challenge result from google servers
   */
  getChallengeResult() {
    return do {
      if (isDefined(window.grecaptcha)) {
        window.grecaptcha.getResponse()
      } else {
        undefined
      }
    }
  }

  /**
   * Renders the ReCaptcha React component
   * @return {ReactNode} ReCaptcha React component
   */
  render() {
    return <ReCaptchaNode sitekey={this.props.sitekey} />
  }

}

export default ReCaptcha

