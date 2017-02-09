import React from 'react'
import expect from 'expect'
import { Map } from 'immutable'
import { mount } from 'enzyme'
import { IntlProvider } from 'react-intl'
import FullName from 'apollo-library/components/Formatters/FullName'
import formats from 'locale/formats'

describe('Formatters.FullName', () => {

  it('empty props', () => {
    const party = {}

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.html()).toBe(null)
  });

  it('props as object', () => {
    const party = {
      titleBefore: 'a',
      firstName: 'b',
      middleName: 'c',
      lastName: 'd',
      titleAfter: 'e'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('a b c d, e')
  });

  it('props as Map', () => {
    const party = Map({
      titleBefore: 'a',
      firstName: 'b',
      middleName: 'c',
      lastName: 'd',
      titleAfter: 'e'
    })

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('a b c d, e')
  })

  it('Should display "Jan Novak"', () => {
    const party = {
      firstName: 'Jan',
      lastName: 'Novak'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Jan Novak')
  });

  it('Should display "Bc. Jan Novak"', () => {
    const party = {
      titleBefore: 'Bc.',
      firstName: 'Jan',
      lastName: 'Novak'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Bc. Jan Novak')
  })

  it('Should display "Jan Novak, CsC."', () => {
    const party = {
      firstName: 'Jan',
      lastName: 'Novak',
      titleAfter: 'CsC.'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Jan Novak, CsC.')
  })

  it('Should display "Bc. Jan Novak, CsC."', () => {
    const party = {
      titleBefore: 'Bc.',
      firstName: 'Jan',
      lastName: 'Novak',
      titleAfter: 'CsC.'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Bc. Jan Novak, CsC.')
  })

  it('Should display "Novak, CsC."', () => {
    const party = {
      lastName: 'Novak',
      titleAfter: 'CsC.'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Novak, CsC.')
  })

  it('Should display "Bc. Novak"', () => {
    const party = {
      titleBefore: 'Bc.',
      lastName: 'Novak'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Bc. Novak')
  });

  it('Should display "Jan Josef Novak"', () => {
    const party = {
      firstName: 'Jan',
      middleName: 'Josef',
      lastName: 'Novak'
    }

    const wrapper = mount(
      <IntlProvider locale="en" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Jan Josef Novak')
  });

  it('Czech alphabet test "Příčinění Žlůťoučký"', () => {
    const party = {
      firstName: 'Příčinění',
      middleName: 'Žlůťoučký'
    }

    const wrapper = mount(
      <IntlProvider locale="cs" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Příčinění Žlůťoučký')
  });

  it('Cyrillic alphabet test "проэю янжольэнж"', () => {
    const party = {
      firstName: 'проэю',
      lastName: 'янжольэнж'
    }

    const wrapper = mount(
      <IntlProvider locale="ru" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('проэю янжольэнж')
  });

  it('Greek alphabet test "Ἀβειρὼν Σοφοκλής"', () => {
    const party = {
      firstName: 'Ἀβειρὼν',
      lastName: 'Σοφοκλής'
    }

    const wrapper = mount(
      <IntlProvider locale="el" formats={formats}>
        <FullName party={party} />
      </IntlProvider>
    )
    expect(wrapper.text()).toBe('Ἀβειρὼν Σοφοκλής')
  })

})
