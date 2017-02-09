import React from 'react'
import expect from 'expect'
import { shallow } from 'enzyme'
import { fromJS, Map } from 'immutable'
import { COUNTRY, COUNTY } from 'apollo-library/constants/enums'

import FullAddress from 'apollo-library/components/Formatters/FullAddress'

describe('Formatters.FullAddress', () => {

  const enumsMap = Map({
    [COUNTRY]: Map({
      'CZ': {
        code: 'CZ',
        description: 'Czech Republic'
      }
    }),
    [COUNTY]: Map({
      BH: {
        code: 'BH',
        description: 'Bohemia'
      }
    })
  });

  it('should display empty string if the address is not provided', () => {
    const wrapper = shallow(<FullAddress enums={enumsMap} />)
    expect(wrapper.text().length).toBe(0)
  })

  /* eslint-disable max-len */
  it('should display address "Na Porici 42, sector 1, Prague, 11000, Bohemia, Czech Republic"', () => {
    /* eslint-enable max-len */
    const address = fromJS({
      countyCode: 'BH',
      countryCode: 'CZ',
      adressLine1: 'Na Porici 42',
      adressLine2: 'sector 1',
      city: 'Prague',
      postCode: '11000'
    });

    const wrapper = shallow(<FullAddress enums={enumsMap} address={address} />);
    expect(wrapper.text()).toBe('Na Porici 42, sector 1, Prague, 11000, Bohemia, Czech Republic');
  })

})
