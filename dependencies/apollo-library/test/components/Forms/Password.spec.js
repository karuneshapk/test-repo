import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'

import { IntlProvider } from 'react-intl'
import formats from 'apollo-library/locale/formats'

import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { formReducer } from 'apollo-library/reducers/form'

import Password from 'apollo-library/components/Forms/Password'
import Form from 'apollo-library/containers/Form'

describe('Forms.Password', () => {

  /* test className */
  const className = 'test-class'
  const password = 'PASSWORD'
  const formName = 'testForm'
  const inputName = 'testInput'
  var wrapper

  beforeEach(() => {
    wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <Password
          inputName="testInput"
          formProps={{ value: password }}
          className={className}
        />
      </IntlProvider>
    )
  })

  it('props test with full dom renderer', () => {
    expect(wrapper.find('input').hasClass(className)).toBe(true)
  })

  it('toogle password visibility', () => {

    var button = wrapper.find('button').first()
    var input = wrapper.find('input').first()

    /* check that password field and visibility toogle exists */
    expect(input).toExist()
    expect(button).toExist()

    /* check initial (obstructed) setting */
    expect(input.prop('type')).toBe('password')
    expect(input.prop('value')).toBe(password)

    /* toogle */
    button.simulate('click')

    /* check visible setting */
    expect(input.prop('type')).toBe('text')
    expect(input.prop('value')).toBe(password)

    /* toogle */
    button.simulate('click')

    /* check obstructed setting */
    expect(input.prop('type')).toBe('password')
    expect(input.prop('value')).toBe(password)
  })

  //Check props types "type: PropTypes.oneOf([ 'password', 'text' ])" disable e.g. submit, date ....


  it('Should have value "PASSWORD" - component initialValue "PASSWORD"', () => {
    const store = createStore(combineReducers({
      platform: combineReducers({
        form: formReducer
      })
    }))

    wrapper = mount(
      <Provider store={store}>
        <IntlProvider locale="en" formats={formats}>
          <Form
            formName={formName}
            onSubmit={() => {}}
          >
            <Password
              inputName={inputName}
              initialValue={password}
            />
          </Form>
        </IntlProvider>
      </Provider>
    )

    var inputWrapper = wrapper.find('input').first()
    const inputStore = store.getState().platform.form.getIn([ 'forms', formName, 'fields', inputName ])

    /* test dom component */
    expect(inputWrapper.prop('value')).toBe(password)

    /* test redux store */
    expect(inputStore.get('value')).toBe(password)
  })

})
