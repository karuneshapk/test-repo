import React, { Component } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { COUNTY, COUNTRY } from 'apollo-library/constants/enums'
import { isUndefined } from 'apollo-library/utils/common'

export class FullAddress extends Component {

  static propTypes = {
    address: ImmutablePropTypes.map.isRequired,
    enums: ImmutablePropTypes.map.isRequired
  }

  static defaultProps = {
    address: Map()
  }

  render() {
    let {
      address,
      enums
    } = this.props

    if (isUndefined(address)) {
      return false
    }

    const county = ((enums.getIn(
      [ COUNTY, address.get('countyCode') ]
    ) || {}).description || '')

    const country = ((enums.getIn(
      [ COUNTRY, address.get('countryCode') ]
    ) || {}).description || '')

    return (
      <span>
        {[ 'adressLine1', 'adressLine2', 'city', 'postCode' ]
          .map(attr => address.get(attr))
          .concat([ county, country ])
          .filter(item => !!item)
          .join(', ')
        }
      </span>
    )
  }

}

export default FullAddress
