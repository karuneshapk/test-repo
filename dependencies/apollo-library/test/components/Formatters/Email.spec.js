import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import ReactDOM from 'react-dom'
import expect from 'expect'

import Email from 'components/Formatters/Email'

describe('Formatters.Email', () => {

  var testEmail = 'test@email.com'

  it('without any props', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <Email />
    )
    const inDom = ReactDOM.findDOMNode(component)

    expect(inDom).toNotExist()
  })

  it('default rendering as link', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <Email email={testEmail} />
    )

    const inDom = ReactDOM.findDOMNode(component)

    /* is anchor */
    expect(inDom.tagName).toMatch(new RegExp('^a$', 'i'))
    /* is in DOM with given email */
    expect(inDom.textContent).toMatch(new RegExp(`^${testEmail}$`))
    /* link has 'mailto:' ? */
    expect(inDom.href).toMatch(new RegExp(`^mailto:${testEmail}$`))
    /* link has className pointer */
    expect(inDom.className).toContain('pointer')
  });

  it('rendering without link', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <Email email={testEmail} isLink={false} />
    )

    const inDom = ReactDOM.findDOMNode(component)

    /* is span */
    expect(inDom.tagName).toMatch(new RegExp('^span$', 'i'))
    /* is in DOM with given email */
    expect(inDom.textContent).toMatch(new RegExp(`^${testEmail}$`))
  })

})
