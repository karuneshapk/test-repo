import { saveToken } from 'apollo-appstore/actions/authActions'
import expect from 'expect'

describe('actions/auth', () => {
  it('saveToken', () => {
    var action = saveToken('tokenValue')
    expect(action.value).toEqual('tokenValue')
  })
})

