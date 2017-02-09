import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'
import FormattedSortCode from 'apollo-platform/components/Formatters/FormattedSortCode'

describe('Formatters.FormattedSortCode', () => {

  it('Should display empty string - without any props', () => {
    const wrapper = mount(
      <FormattedSortCode />
    )
    expect(wrapper.text()).toBe('')
  })

  it('Should display empty string - empty value', () => {
    const wrapper = mount(
      <FormattedSortCode value="" />
    )
    expect(wrapper.text()).toBe('')
  })

  it('Should display empty string - undefined value', () => {
    const wrapper = mount(
      <FormattedSortCode value={undefined} />
    )
    expect(wrapper.text()).toBe('')
  })

  xit('Should display empty string - false value', () => {
    const wrapper = mount(
      <FormattedSortCode value={false} />
    )
    expect(wrapper.text()).toBe('')
  })

  xit('Should display empty string - null value', () => {
    const wrapper = mount(
      <FormattedSortCode value={null} />
    )
    expect(wrapper.text()).toBe('')
  })

  it('Should display "11-22-33" - already formatted "11-22-33"', () => {
    const wrapper = mount(
      <FormattedSortCode value="11-22-33" />
    )
    expect(wrapper.text()).toBe('11-22-33')
  })

  it('Should display "11-22-33" - already formatted with spaces "11 22 33"', () => {
    const wrapper = mount(
      <FormattedSortCode value="11 22 33" />
    )
    expect(wrapper.text()).toBe('11-22-33')
  })

  it('Should display "12-34-56" - value "123456" (string)', () => {
    const wrapper = mount(
      <FormattedSortCode value="123456" />
    )
    expect(wrapper.text()).toBe('12-34-56')
  })

  it('Should display "12-34-56" - value 123456 (number)', () => {
    const wrapper = mount(
      <FormattedSortCode value="123456" />
    )
    expect(wrapper.text()).toBe('12-34-56')
  })

  it('Should display "**-**-****" - overflow test', () => {
    const wrapper = mount(
      <FormattedSortCode value="12345678" />
    )
    expect(wrapper.text()).toBe('12-34-5678')
  })

  it('Should display "**-*" - underflow test', () => {
    const wrapper = mount(
      <FormattedSortCode value="123" />
    )
    expect(wrapper.text()).toBe('12-3')
  })
})
