import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import expect from 'expect'

import Button from 'apollo-platform/components/Forms/Button'

describe('Forms.Button', () => {

  it('has button that fires a dom event for click', done => {
    const handleClick = () => { done() }

    var detachedComp = ReactTestUtils.renderIntoDocument(<Button onClick={handleClick} />)
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(detachedComp, 'button')

    expect(button).toExist()
    ReactTestUtils.Simulate.click(button)
  })

})
