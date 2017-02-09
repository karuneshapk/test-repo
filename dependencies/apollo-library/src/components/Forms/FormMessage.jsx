import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import { composeClassName } from 'apollo-library/utils/components'
import Alert from 'apollo-library/components/UI/Alert'

/**
 * Form Error Message component
 *
 * @property {Array, *} error - list of errors; if it's nor array, nothing's rendered
 *
 * @module
 */
export class FormMessage extends Component {

  static propTypes = {
    error: PropTypes.any
  }

  componentDidUpdate(oldProps) {
    // if we just got the message, scroll it into view
    if (this.props.error && !oldProps.error) {
      this.refs.container.scrollIntoView(true)
    }
  }

  render() {
    const {
      className,
      formStatusProps
    } = this.props

    const error = formStatusProps && formStatusProps.error
    var errors, show = false

    if (error) {
      errors = Array.isArray(error) ? error : [ error ]
      show = (!!errors.length)
    }

    const classes = composeClassName(
      'margin-t-m',
      className,
      !show && 'none'
    )

    return (
      <div className={classes} ref="container">
        {show
          ? <Alert type="danger">
              {/* if we have more that one message, render them with bullets */
              errors.length === 1
                ? <FormattedMessage
                    key="err.message.id"
                    {...errors[0].message} values={errors[0].values}
                  />
                : <ul>
                    {errors.map(error => (
                      <li>
                        <FormattedMessage
                          key="err.message.id"
                          {...error.message} values={error.values}
                        />
                      </li>
                    ))}
                  </ul>
              }
            </Alert>
          : null
        }
      </div>
    )
  }

}

export default FormMessage
