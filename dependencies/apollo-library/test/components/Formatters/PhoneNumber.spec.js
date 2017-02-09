import React from 'react'
import expect from 'expect'
import { mount, shallow } from 'enzyme'

import PhoneNumber from 'apollo-library/components/Formatters/PhoneNumber'
import { formatPhoneNumber } from 'apollo-library/utils/phone'

describe('Formatters.PhoneNumber', () => {

  var testPhoneNumber = '+420111223344'

  it('without any props', () => {
    var
      wrapper = shallow(
        <PhoneNumber />
      )

    expect(wrapper.text()).toBe('')
  });

  it('default rendering as link', () => {
    var
      wrapper = mount(
        <PhoneNumber phoneNumber={testPhoneNumber} />
      ),
      formattedPhoneNumber = formatPhoneNumber(testPhoneNumber)

    /* is anchor */
    expect(wrapper.find('a').length).toBe(1)

    /* is in DOM with given formatted phoneNumber */
    expect(wrapper.text()).toMatch(formattedPhoneNumber)



    // /* link has 'mailto:' ? */
    expect(wrapper.find('a').prop('href')).toEqual('tel:' + testPhoneNumber)
    /* link has className pointer */
    expect(wrapper.find('a').hasClass('pointer')).toBe(true)
  });

  it('rendering without link', () => {
    var
      wrapper = mount(
        <PhoneNumber phoneNumber={testPhoneNumber} isLink={false} />
      ),
      formattedPhoneNumber = formatPhoneNumber(testPhoneNumber)

    /* is span */
    expect(wrapper.find('span').length).toBe(1)
    /* is in DOM with given formatted phoneNumber */
    expect(wrapper.text()).toMatch(formattedPhoneNumber)

  });
})
