import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import Row from 'apollo-library/components/UI/Row'
import Col from 'apollo-library/components/UI/Col'
import Anchor from 'apollo-library/components/UI/Anchor'
import Button from 'apollo-library/components/Forms/Button'
import CommonMessages from 'apollo-library/messages/common'

/**
 * Confirmation wrapper up element with onClick
 * @example
 *    <Confirmation>
 *      <Button onClick={() => {alert('confirmed')}}>
 *        Confirm
 *      </Button>
 *    </Confirmation>
 *
 * @property {string|boolean=} title False for hide title part Default: Confirmation
 * @property {string|ReactElement=} body Default: Are you sure?
 * @property {boolean=} showCancel Show cancel button Default: true
 * @property {string=} confirmText Confimation button text Default: Confirm
 * @property {string=} confirmOption Confirm button option property Default: primary
 *  @see {apollo-library/components/Forms.Button}
 * @property {string=} orText Text between buttons Default: or
 * @property {string=} cancelText Text of cancel button Default: Cancel
 * @property {function=} onCalcel Is dispatched if click on cancel button
 */
export class Confirmation extends Component {

  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    body: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    showCancel: PropTypes.bool,
    confirmText: PropTypes.string,
    confirmOption: PropTypes.string,
    orText: PropTypes.string,
    cancelText: PropTypes.string,
    onCancel: PropTypes.func
  }

  static defaultProps = {
    showCancel: true,
    confirmOption: 'primary',
    onCancel: () => {}
  }

  /**
   * @constructor
   * @extends {React.Component}
   */
  constructor() {
    super(...arguments)

    this.state = {
      buttonElement: null,
      buttonElementEvent: null,
      buttonElementOnClick: () => {},
      showConfirmation: false
    }
  }

  /**
   * Handle click on children button element
   *
   * @param {SyntheticEvent} event
   */
  handleButtonElementClick(event) {
    event.preventDefault()

    this.setState({
      showConfirmation: true,
      buttonElementEvent: event
    })
  }

  /**
   * Handle click on confirm button
   */
  handleConfirmClick() {
    const {
       buttonElementOnClick,
       buttonElementEvent
     } = this.state

    this.setState({
      showConfirmation: false
    })

    buttonElementOnClick(buttonElementEvent)
  }

  /**
   * Handle click on cancel button
   * If exist users handler dispatch it
   */
  handleCancelClick() {
    const {
      onCancel
    } = this.props

    this.setState({ showConfirmation: false })

    onCancel()
  }

  /**
   * Before mount component do clone of children and replace his onClick handler
   */
  componentWillMount() {
    const {
      children
    } = this.props

    const child = React.Children.only(children)

    this.setState({
      buttonElement: React.cloneElement(child, {
        onClick: this.handleButtonElementClick.bind(this)
      }),
      buttonElementOnClick: child.props.onClick || (() => {})
    })
  }

  /**
   * Render confirm
   *
   * @return {ReactNode}
   */
  renderConfirmationModal() {
    const {
      title,
      body,
      showCancel,
      confirmText,
      confirmOption,
      orText,
      cancelText,
      intl: { formatMessage }
    } = this.props

    return (
      <frag>
        <div className='modal-overlay black' tabIndex="-1" />
        <div className='modal' role='dialog' tabIndex="-1">
          <div className='modal-dialog'>
            <div className='modal-content'>
              {title !== false &&
                <div className='modal-header'>
                  <h4 className='modal-title'>
                    {title || formatMessage(CommonMessages.confirmation)}
                  </h4>
                </div>}
              <div className='modal-body'>
                {body || formatMessage(CommonMessages.confirmationText)}
              </div>
              <div className='modal-footer'>
                <div className='pull-left'>
                  <Button
                    option={confirmOption}
                    onClick={this.handleConfirmClick.bind(this)}
                  >
                    {confirmText || formatMessage(CommonMessages.confirmationButton)}
                  </Button>

                  {showCancel &&
                    <span className='margin-l-m'>
                      {orText || formatMessage(CommonMessages.or)}
                    </span>}

                  {showCancel &&
                    <Button
                      option='link'
                      onClick={this.handleCancelClick.bind(this)}
                    >
                        {cancelText || formatMessage(CommonMessages.cancel)}
                    </Button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </frag>
    )
  }

  /**
   * Render component to frag tag
   *
   * @return {ReactNode}
   */
  render() {
    const {
      buttonElement,
      showConfirmation
    } = this.state

    return (
      <frag>
        {buttonElement}
        {showConfirmation &&
          this.renderConfirmationModal()
        }
      </frag>
    )
  }

}

export default injectIntl(Confirmation)
