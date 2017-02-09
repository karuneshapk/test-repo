import React from 'react'
import expect from 'expect'

import { mount } from 'enzyme'

import Checkbox from 'apollo-platform/components/Forms/Checkbox'

describe('Forms.Checkbox', () => {

  it('props test with full dom rendered', () => {
    const className = 'test-class'
    const value = 'testValue'

    const wrapper = mount(
      <Checkbox
        className={className}
        inputName="testInput"
        defaultChecked={false}
        value={value}
        formProps={{}}
      />
    )

    var box = wrapper.find('input[type="checkbox"]')

    /* test that there is only one radio rendered */
    expect(box.length).toBe(1)

    const boxNode = box.first()

    /* test that class was propagated */
    expect(boxNode.prop('className')).toEqual(className)

    /* test that checked property was propagated */
    expect(boxNode.prop('checked')).toBeFalsy()

    /* test that value property was propagated */
    expect(boxNode.prop('value')).toEqual(value)
  })

  it('should use inputName property for name property and should not collide', () => {
    const groupName = 'testGroup'

    var wrapper = mount(
      <div>
        <Checkbox
          inputName={`${groupName}-1`}
          name={groupName}
          formProps={{}}
        />
        <Checkbox
          inputName={`${groupName}-2`}
          name={groupName}
          formProps={{}}
        />
      </div>
    )
    const inputs = wrapper.find('input[type="checkbox"]')
    /* test existence of valid input type */
    expect(inputs.length).toBe(2)


    /* test that inputName property was propagated */
    expect(inputs.first().prop('name')).toBe(`${groupName}-1`)
    expect(inputs.last().prop('name')).toNotBe(`${groupName}-1`)
    expect(inputs.last().prop('name')).toBe(`${groupName}-2`)
  })

})
