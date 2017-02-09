import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'
import Alert from 'apollo-platform/components/UI/Alert'

describe('UI.Alert', () => {

  var className = 'test-class'
  var text = 'Alert text'
  var type = 'success' // 'default', 'primary', 'success', 'info', 'warning', 'danger', 'link'

  it('show', () => {

    const wrapper = mount(
      <Alert
        text={text}
        type={type}
        className={className}
      />
    )

    expect(wrapper.text()).toEqual(text)
    expect(wrapper.find('div').first().hasClass(className)).toBe(true)
  })

})
