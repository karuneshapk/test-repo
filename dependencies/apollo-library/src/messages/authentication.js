import { defineMessages } from 'react-intl'

export default defineMessages({

  nextSMSCountdownWaitText: {
    id: 'NextSMSCountdown.wait.text',
    description: 'Resend next sms counter waiting state',
    defaultMessage: `You can resend the code in {seconds} {seconds, plural,
      =0 {now}
      one {# second}
      other {# seconds}
    }.`
  },
  nextSMSPhoneCountdownWaitText: {
    id: 'NextSMSCountdown.phone.wait.text',
    description: 'Resend next sms counter waiting state',
    defaultMessage: `You can {link} to {phoneNumber} {seconds, plural,
      =0 {now}
      one {in # second}
      other {in # seconds}
    }.`
  },
  resendTheCode: {
    id: 'NextSMSCountdown.resend.the.code',
    description: 'Part of countdown message for link',
    defaultMessage: 'resend the code'
  },
  SMSAuthHeading: {
    id: 'SMSAuth.heading',
    description: 'Heading for sms authentication',
    defaultMessage: 'Please enter the SMS code'
  },
  SMSAuthInputLabel: {
    id: 'SMSAuth.input.label',
    description: 'Label for sms input',
    defaultMessage: 'SMS code'
  },
  passwordAuthHeading: {
    id: 'PasswordAuth.heading',
    description: 'Heading for password authentication block',
    defaultMessage: 'Please enter your password'
  },
  passwordAuthInputLabel: {
    id: 'PasswordAuth.input.label',
    description: 'Label for password authentication input field',
    defaultMessage: 'Password'
  },
  wrongValueTextSingle: {
    id: 'auth.wrongValueTextSingle',
    description: 'Error message for wrong value when there is only one auth detail',
    defaultMessage: 'Wrong value'
  },
  wrongValueTextMultiple: {
    id: 'auth.wrongValueTextMultiple',
    description: 'Error message for wrong value when there are multiple auth details',
    defaultMessage: 'Some of the values are wrong'
  },
  wrongValuePassword: {
    id: 'auth.wrongValuePassword',
    description: 'Error message for wrong value when there is only one auth detail, and it\'s password',
    defaultMessage: 'Password you entered is not correct'
  },
  wrongValueSMSCode: {
    id: 'auth.wrongValueSMSCode',
    description: 'Error message for wrong value when there is only one auth detail, and it\'s SMS code',
    defaultMessage: 'SMS code you entered is not correct'
  }

})
