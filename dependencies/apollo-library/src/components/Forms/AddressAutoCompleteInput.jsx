import scriptJS from 'scriptjs'
import { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { injectIntl } from 'react-intl'

import BaseInput from 'apollo-library/components/Forms/BaseInput'
import messages from 'apollo-library/messages/addressAutoComplete'

const CHANGE_LISTENER = 'place_changed'

/**
 * Text input component with a support of an address auto completion
 *
 * @property {Function} handler - a handler of an address auto completion
 *
 * @module
 */
export class AddressAutoCompleteInput extends BaseInput {

  static propTypes = {
    handler: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.install(this.props.handler)
  }

  componentWillUnmount() {
    this.uninstall()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.handler !== nextProps.handler) {
      this.uninstall()
      this.install(nextProps.handler)
    }
  }

  uninstall() {
    if (this.autocomplete) {
      this.autocomplete.unbindAll()
    }
  }

  install(handler) {
    scriptJS('https://maps.googleapis.com/maps/api/js?libraries=places', () => {
      const { Autocomplete } = (window.google && google.maps.places)

      if (!Autocomplete) {
        let errorMessage = this.props.intl.formatMessage(messages.initErrorText)
        console.error(errorMessage)
        throw new Error(errorMessage)
      }

      this.autocomplete = new Autocomplete(this.refs.baseInput)

      this.autocomplete.addListener(CHANGE_LISTENER,
        this.onChange.bind(this, handler, this.autocomplete))
    })
  }

  onChange(handler, autocomplete) {
    handler(this.refs.baseInput.value, autocomplete.getPlace())
  }

}

export default injectIntl(AddressAutoCompleteInput)
