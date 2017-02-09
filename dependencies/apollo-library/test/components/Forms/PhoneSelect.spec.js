import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'

import PhoneSelect from 'apollo-library/components/Forms/PhoneSelect'

describe('Forms.PhoneSelect', () => {

  const countryCode = '+420'
  const number = '123456789'
  const initialValue = {
    countryCode,
    number
  }
  const countryCodes = [
    {
      name: 'XX +99',
      value: '+99'
    }, {
      name: 'CZ +420',
      value: '+420'
    }, {
      name: 'YY +11',
      value: '+11'
    }
  ]

  it('without any props', () => {
    const wrapper = mount(
      <PhoneSelect />
    )
    expect(wrapper.find("select").length).toBe(0)
    expect(wrapper.find("input").length).toBe(1)
  })

  it('should be rendered', () => {
    const wrapper = mount(
      <PhoneSelect
        countryCodes={countryCodes}
      />
    )

    expect(wrapper.find("select").length).toBe(1)
    expect(wrapper.find("option").length).toBe(countryCodes.length)
    expect(wrapper.find("input").length).toBe(1)
  })

  it('should selected from initialValue - select', () => {
    const wrapper = mount(
      <PhoneSelect
        initialValue={initialValue}
        countryCodes={countryCodes}
      />
    )
    expect(wrapper.find("select").get(0).value).toBe(countryCode)
  })

  it('should selected from initialValue - input', () => {
    const wrapper = mount(
      <PhoneSelect
        initialValue={initialValue}
        countryCodes={countryCodes}
      />
    )
    expect(wrapper.find("input").get(0).value).toBe(number)
  })

  it('should be disabled', () => {
    const wrapper = mount(
      <PhoneSelect
        initialValue={initialValue}
        countryCodes={countryCodes}
        disabled
      />
    )
    expect(wrapper.find("input").get(0).disabled).toBe(true)
    expect(wrapper.find("select").get(0).disabled).toBe(true)
  })

})
