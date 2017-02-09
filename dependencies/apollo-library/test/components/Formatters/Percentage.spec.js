import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'
import { IntlProvider } from 'react-intl'
import Percentage from 'apollo-library/components/Formatters/Percentage'
import formats from 'apollo-library/locale/formats'

describe('Formatters.Percentage', () => {

  var testAmount

  beforeEach(() => {
    testAmount = 100
  })

  it('Should display "100%"', () => {
    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <Percentage
          amount={testAmount}
          fixedDecimals={false}
          decimals={0}
        />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('100%')
  })

  it('Should display "12.44%"', () => {
    testAmount = 12.44
    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <Percentage
          amount={testAmount}
          fixedDecimals={false}
          decimals={2}
        />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('12.44%')
  })

  it('Should display "12.4%"', () => {
    testAmount = 12.444
    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <Percentage
          amount={testAmount}
          fixedDecimals={false}
          decimals={1}
        />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('12.4%')
  })

  it('Should display "12.5%" - rounded 12.45 ', () => {
    testAmount = 12.45
    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <Percentage
          amount={testAmount}
          fixedDecimals={false}
          decimals={1}
        />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('12.5%')
  })

  it('Should display "0.125%" - cut trailing decimals', () => {
    testAmount = 0.1250000
    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <Percentage
          amount={testAmount}
          fixedDecimals={false}
          decimals={3}
        />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('0.125%')
  })

  it('Should display "0.100%" - fixed decimals', () => {
    testAmount = 0.1
    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <Percentage
          amount={testAmount}
          fixedDecimals={true}
          decimals={3}
        />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('0.100%')
  })

})
