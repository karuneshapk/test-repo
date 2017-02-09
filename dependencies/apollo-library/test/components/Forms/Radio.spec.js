import React from 'react'
import expect from 'expect'

import { mount } from 'enzyme'

import Radio from 'apollo-platform/components/Forms/Radio'

describe('Forms.Radio', () => {

  it('props test with full dom rendered', () => {
    const className = 'test-class'
    const value = 'testValue'

    const wrapper = mount(
      <Radio
        className={className}
        inputName="testInput"
        defaultChecked={false}
        value={value}
        formProps={{}}
      />
    )

    var radio = wrapper.find('input[type="radio"]')

    /* test that there is only one radio rendered */
    expect(radio.length).toBe(1)

    const radioNode = radio.first()

    /* test that class was propagated */
    expect(radioNode.prop('className')).toEqual(className)

    /* test that checked property was propagated */
    expect(radioNode.prop('checked')).toBeFalsy()

    /* test that value property was propagated */
    expect(radioNode.prop('value')).toBe(value)
  })

  it('should use inputName property for name property and should not collide', () => {
    const groupName = 'testGroup'

    var radios = mount(
      <div>
        <Radio
          inputName={`${groupName}-1`}
          name={groupName}
          formProps={{}}
        />
        <Radio
          inputName={`${groupName}-2`}
          name={groupName}
          formProps={{}}
        />
      </div>
    ).find('input[type="radio"]')

    /* test that there is only one radio rendered */
    expect(radios.length).toBe(2)

    /* test that inputName property was propagated */
    expect(radios.first().prop('name')).toBe(`${groupName}-1`)
    expect(radios.first().prop('name')).toNotBe(`${groupName}-2`)
    expect(radios.last().prop('name')).toBe(`${groupName}-2`)
  })

})
