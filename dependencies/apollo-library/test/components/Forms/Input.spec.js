import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'

import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { formReducer } from 'apollo-library/reducers/form'

import Input from 'apollo-platform/components/Forms/Input'
import Form from 'apollo-library/containers/Form'

describe('Forms.Input', () => {

  /* test className */
  const className = 'test-class'
  const value = 'testing text'
  const formName = 'testForm'
  const inputName = 'testInput'

  it('props test with full dom renderer', () => {
    const wrapper = mount(
      <Input
        inputName={inputName}
        className={className}
        text={value}
      />
    )

    expect(wrapper.find('input').hasClass(className)).toBe(true)
  })

  it('Should have value "testing text" - component initialValue "testing text"', () => {

    const store = createStore(combineReducers({
      platform: combineReducers({
        form: formReducer
      })
    }))

    const wrapper = mount(
      <Provider store={store}>
        <Form
          formName={formName}
          onSubmit={() => {}}
        >
          <Input
            inputName={inputName}
            initialValue={value}
          />
        </Form>
      </Provider>
    )

    const inputNode = wrapper.find('input').first()
    const inputStore = store.getState().platform.form.getIn([ 'forms', formName, 'fields', inputName ])

    /* test dom component */
    expect(inputNode.prop('value')).toBe(value)

    /* test redux store */
    expect(inputStore.get('value')).toBe(value)
  })

})
