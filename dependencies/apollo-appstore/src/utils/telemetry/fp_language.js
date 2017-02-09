import { isDefined } from 'apollo-library/utils/common'

//Works partially in Tor : lang=en-US;syslang=;userlang=
export default () => {
  return new Promise(resolve => {
    try {
      resolve({
        'language': (
          (isDefined(typeof navigator.language)
            ? `lang=${navigator.language};`
            : (isDefined(typeof navigator.browserLanguage)
              ? `lang=${navigator.browserLanguage};`
              : 'lang=;'
            )
          ) + (
            isDefined(typeof navigator.systemLanguage)
              ? `syslang=${navigator.systemLanguage};`
              : 'syslang=;'
          ) + (
            isDefined(typeof navigator.userLanguage)
              ? `userlang=${navigator.userLanguage}`
              : 'userlang='
          )
        )
      })
    } catch (err) {
      resolve({
        'language': 'unknown'
      })
    }
  })
}
