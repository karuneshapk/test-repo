import React from 'react'
import { mount } from 'enzyme'
import expect from 'expect'
import { IntlProvider } from 'react-intl'
import formats from 'locale/formats'

import FormattedCurrency from 'apollo-platform/components/Formatters/FormattedCurrency'

describe('Formatters.FormattedCurrency', () => {

  var amount = 55
  var currency = 'EUR'

  const component = (
    <IntlProvider locale="en" formats={formats}>
      <FormattedCurrency value={amount} currency={currency} />
    </IntlProvider>
  )

  it('should contains given value', () => {
    const wrapper = mount(component)

    expect(wrapper.length).toBeGreaterThan(0)
    expect(wrapper.text()).toInclude(amount)
    expect(wrapper.text()).toInclude(amount)
  })

  it('should contains currency symbol', () => {
    const wrapper = mount(component)

    expect(wrapper.text()).toInclude('€')
  })

})
