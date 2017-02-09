import React from 'react'
import expect from 'expect'
import { shallow } from 'enzyme'
// import Sinon from 'sinon'

import Select from 'apollo-platform/components/Forms/Select'

describe('Forms.Select', () => {

  var
    className = 'test-class',
    options = [
      { 'value': 'test1value', name: 'test1name' },
      { 'value': 'test2value', name: 'test2name' },
      { 'value': 'test3value', name: 'test3name' }
    ],
    formProps = {}

  it('props test', () => {
    const wrapper = shallow(
      <Select
        groupClassName={className}
        formProps={formProps}
      />
    )

    expect(wrapper.hasClass(className)).toBe(true)
  })

  it('options number', () => {
    const componentRaw = (
      <Select
        formProps={formProps}
        options={options}
        showNullOption={false}
      />
    )
    const wrapper = shallow(componentRaw)

    expect(wrapper.find('option').length).toEqual(options.length, 'Incorect number of options')
  })

  it('change event', done => {
    const onChangeHandler = event => {
      const expectedValue = 'someValue'

      if (event.target.value !== expectedValue) {
        done(new Error(event.target.value + ' != ' + expectedValue))
      } else {
        done()
      }
    }

    const wrapper = shallow(
      <Select
        formProps={formProps}
        onChange={onChangeHandler}
        options={options}
      />
    )

    const select = wrapper.find('select')

    select.simulate('change', { target: { value: 'someValue' } })
  })

})
