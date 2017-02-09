import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

export class FullMaidenName extends Component {

  static propTypes = {
    party: ImmutablePropTypes.map.isRequired
  }

  render() {
    var { party } = this.props

    var result = ''

    if (party) {
      let firstName = party.get('firstName')
      let maidenName = party.get('maidenName')

      if (maidenName) {
        result = `${party.get('firstName').charAt(0)}.`

        let middleName = party.get('middleName')

        if (middleName) {
          result += `${middleName.charAt(0)}. `
        } else {
          result += ' ' // if no middle name, just add whitespace
        }

        result += maidenName
      }
    }

    return <span>{result}</span>
  }

}

export default FullMaidenName