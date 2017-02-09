import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'

import Textarea from 'apollo-platform/components/Forms/Textarea'

describe('Forms.Textarea', () => {

  it('Textarea show content', () => {
    const textareaContent = 'Content text'

    const wrapper = mount(
      <Textarea
        inputName="testInput"
        formProps={{ value: textareaContent }}
        cols={12}
        rows={1}
      />
    )

    expect(wrapper.find('textarea').length).toBe(1)
    expect(wrapper.text()).toBe(textareaContent)
  })

})
