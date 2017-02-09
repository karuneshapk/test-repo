import React from 'react'
import { FormattedDate, FormattedRelative } from 'react-intl'
import { shallow } from 'enzyme'
import expect from 'expect'

import FormattedRelativeLimitedDays from 'apollo-library/components/Formatters/FormattedRelativeLimitedDays'

describe('Formatters.FormattedRelativeLimitedDays', () => {

  it('should throw when value date is not passed', () => {
    expect(() => { shallow(<FormattedRelativeLimitedDays />) }).toThrow()
  })

  it('should display relative date if days limit is not passed', () => {
    const valueDate = new Date(1, 1, 2001)
    const wrapper = shallow(
      <FormattedRelativeLimitedDays value={valueDate} />
    )
    expect(wrapper.find(FormattedRelative).length).toBeGreaterThan(0)
  })

  it('should display regular date if today minus days limit equals to value date', () => {
    const limitToDays = 5
    const valueDate = new Date()
    valueDate.setDate(valueDate.getDate() - limitToDays)

    const wrapper = shallow(
      <FormattedRelativeLimitedDays value={valueDate} limitedTo={limitToDays} />
    )
    expect(wrapper.find(FormattedDate).length).toBeGreaterThan(0)
  })

  it('should display regular date if today minus days limit greater than value date', () => {
    const limitToDays = 5
    const valueDate = new Date()
    valueDate.setDate(valueDate.getDate() - limitToDays - 1)

    const wrapper = shallow(
      <FormattedRelativeLimitedDays value={valueDate} limitedTo={limitToDays} />
    )
    expect(wrapper.find(FormattedDate).length).toBeGreaterThan(0)
  })

  it('should display relative date if today minus days limit less than value date', () => {
    const limitToDays = 5
    const valueDate = new Date()
    valueDate.setDate(valueDate.getDate() - limitToDays + 1)

    const wrapper = shallow(
      <FormattedRelativeLimitedDays value={valueDate} limitedTo={limitToDays} />
    )
    expect(wrapper.find(FormattedRelative).length).toBeGreaterThan(0)
  })

})
