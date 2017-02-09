import React from 'react'
import { shallow } from 'enzyme'
import expect from 'expect'

import FormattedIBAN from 'apollo-library/components/Formatters/FormattedIBAN'

describe('Formatters.FormattedIBAN', () => {

  it('should format account "CZ6508000000192000145399" as "CZ65 0800 0000 1920 0014 5399"', () => {
    const iban = 'CZ6508000000192000145399';
    const wrapper = shallow(<FormattedIBAN account={iban} />)

    expect(wrapper.text()).toBe('CZ65 0800 0000 1920 0014 5399')
  });

  it('should render empty string when account property undefined', () => {
    const wrapper = shallow(<FormattedIBAN />)
    expect(wrapper.text()).toBe('')
  })

})
