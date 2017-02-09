import { defineMessages } from 'react-intl'

export default defineMessages({

  noMessageFound: {
    id: 'form.validation.noMessage',
    description: 'Note that we don\'t have a translation for this error code',
    defaultMessage: '!!We don\'t have a message for this error!!.'
  },
  required: {
    id: 'form.validation.required',
    description: 'Required field in the form is empty',
    defaultMessage: 'Cannot be empty.'
  },
  isChecked: {
    id: 'form.validation.isChecked',
    description: 'Checkbox in form needs to be checked be valid',
    defaultMessage: 'You have to check this'
  },
  minLength: {
    id: 'form.validation.minLength',
    description: 'Field in the form requires certain minimum number of characters',
    defaultMessage: 'You have to provide at least {count} characters.'
  },
  maxLength: {
    id: 'form.validation.maxLength',
    description: 'Field in the form requires certain maximum number of characters',
    defaultMessage: 'You have to provide at most {count} characters.'
  },
  exactLength: {
    id: 'form.validation.exactLength',
    description: 'Field in the form requires certain number of characters',
    defaultMessage: 'You have to provide exactly {count} characters.'
  },
  longString: {
    id: 'form.validation.longString',
    description: 'Field in the form requires certain minimum number of characters',
    defaultMessage: 'You have to provide at least 3 characters.'
  },
  isPhoneNumber: {
    id: 'form.validation.isPhoneNumber',
    description: 'Field in the form is not a phone number',
    defaultMessage: 'Not a valid phone number.'
  },
  isEmail: {
    id: 'form.validation.isEmail',
    description: 'Field in the form is not an email address',
    defaultMessage: 'Not a valid email address.'
  },
  isIrishIBAN: {
    id: 'form.validation.isIrishIBAN',
    description: 'Field in the form is not an irish IBAN',
    defaultMessage: 'You have to provide Irish IBAN.'
  },
  isDate: {
    id: 'form.validation.isDate',
    description: 'Field in the form is not a valid date',
    defaultMessage: 'Not a valid date.'
  },
  isDateObject: {
    id: 'form.validation.isDateObject',
    description: 'Field in the form is not a valid date',
    defaultMessage: 'Not a valid date.'
  },
  isDateRangeOptional: {
    id: 'form.validation.isDateRangeOptional',
    description: 'Field in the form is not a valid date',
    defaultMessage: 'Not a valid date range.'
  },
  isUpToToday: {
    id: 'form.validation.isUpToToday',
    description: 'Date value is not not in the past or on a current day',
    defaultMessage: 'The date needs to be in the past or today.'
  },
  isTodayOrAfter: {
    id: 'form.validation.isTodayOrAfter',
    description: 'Date value is today or greater',
    defaultMessage: 'The date needs to be today or greater.'
  },
  isAfterMinDate: {
    id: 'form.validation.isAfterMinDate',
    description: 'Date value is not after {minDate}',
    defaultMessage: 'The date needs to be after {minDate}.'
  },
  isNumber: {
    id: 'form.validation.isNumber',
    description: 'Not a valid number',
    defaultMessage: 'Not a valid number.'
  },
  isNumberObject: {
    id: 'form.validation.isNumberObject',
    description: 'Not a valid number',
    defaultMessage: 'Not a valid number.'
  },
  maxValue: {
    id: 'form.validation.maxValue',
    description: 'Field in the form requires to be less than predefined value',
    defaultMessage: 'Entered value should be less than {value}.'
  },
  anyFieldRequired: {
    id: 'form.validation.anyFieldRequired',
    description: 'Form is required to have at least one any field filled-in',
    defaultMessage: 'You have to fill at least one field.'
  },
  isNumberInRangeInclusive: {
    id: 'form.validation.isNumberInRangeInclusive',
    description: 'Not a valid number',
    defaultMessage: 'Value should be in range from {0} to {1}.'
  },
  isPositiveValue: {
    id: 'form.validation.isPositiveValue',
    description: 'Field in the form requires to have a value greater then zero',
    defaultMessage: 'Entered value should be greater then zero.'
  },
  'allowedSpecialCharacters': {
    id: 'form.validation.allowedSpecialCharacters',
    description: 'Allowed chracter',
    defaultMessage: 'Please use only alphanumeric charactes and any of those: {allowedCharacters}'
  },
  'Object.Empty': {
    id: 'form.validation.Object.Empty',
    description: 'Required field in the form is empty',
    defaultMessage: 'Cannot be empty.'
  },
  'Date.TooLow': {
    id: 'form.validation.Date.TooLow',
    description: 'Error message: date is outside the valid interval',
    defaultMessage: 'Date is outside the valid interval.'
  },
  'Date.TooHigh': {
    id: 'form.validation.Date.TooHigh',
    description: 'Error message: date is outside the valid interval',
    defaultMessage: 'Date is outside the valid interval.'
  },
  'Date.InFuture': {
    id: 'form.validation.Date.InFuture',
    description: 'Error message: date is in the future when it should have been a past date',
    defaultMessage: 'The date cannot be in the future.'
  },
  'Date.InPast': {
    id: 'form.validation.Date.InPast',
    description: 'Error message: date is in the past when it should have been a future date',
    defaultMessage: 'The date cannot be in the past.'
  },
  'String.TooShort': {
    id: 'form.validation.String.TooShort',
    description: 'Error message: the value is too short',
    defaultMessage: 'The value is too short.'
  },
  'String.TooLong': {
    id: 'form.validation.String.TooLong',
    description: 'Error message: the value is too long',
    defaultMessage: 'The value is too long.'
  },
  'String.InvalidFormat': {
    id: 'form.validation.String.InvalidFormat',
    description: 'Error message: value is in the wrong format',
    defaultMessage: 'Value is in the wrong format.'
  },
  'Int.TooLow': {
    id: 'form.validation.Int.TooLow',
    description: 'Error message: the number is too low',
    defaultMessage: 'The value is too low.'
  },
  'Int.TooHigh': {
    id: 'form.validation.Int.TooHigh',
    description: 'Error message: the number is too high',
    defaultMessage: 'The value is too high.'
  },
  'Long.TooLow': {
    id: 'form.validation.Long.TooLow',
    description: 'Error message: the number is too low',
    defaultMessage: 'The value is too low.'
  },
  'Long.TooHigh': {
    id: 'form.validation.Long.TooHigh',
    description: 'Error message: the number is too high',
    defaultMessage: 'The value is too high.'
  },
  'BigDecimal.TooLow': {
    id: 'form.validation.BigDecimal.TooLow',
    description: 'Error message: the number is too low',
    defaultMessage: 'The value is too low.'
  },
  'BigDecimal.TooHigh': {
    id: 'form.validation.BigDecimal.TooHigh',
    description: 'Error message: the number is too high',
    defaultMessage: 'The value is too high.'
  },
  'Email.Invalid': {
    id: 'form.validation.Email.Invalid',
    description: 'Error message: email is not in a valid format',
    defaultMessage: 'This is not a valid email address.'
  },
  'CodeList.Invalid': {
    id: 'form.validation.CodeList.Invalid',
    description: 'Error message: invalid code (of any type)',
    defaultMessage: 'This is not a valid code.'
  },
  'Currency.Invalid': {
    id: 'form.validation.Currency.Invalid',
    description: 'Error message: invalid currency code',
    defaultMessage: 'The currency is not supported.'
  },
  'Phone.Invalid': {
    id: 'form.validation.Phone.Invalid',
    description: 'Error message: invalid phone format',
    defaultMessage: 'This is not a valid phone number.'
  },
  'AuthProcess.Step.WrongValue': {
    id: 'form.validation.AuthProcess.Step.WrongValue',
    description: 'Error message: wrong value sent in one of the authentication steps',
    defaultMessage: 'The code you entered is not correct.'
  },
  'Account.Number.Invalid': {
    id: 'form.validation.Account.Number.Invalid',
    description: 'Error message: account number format is not matching the country code',
    defaultMessage: 'Account number is not valid with the sort code.'
  },
  'Account.Not.Found': {
    id: 'form.validation.Account.NotFound',
    description: 'Error message: account is not in the database',
    defaultMessage: 'Account doesn\'t exist.'
  },
  'Swift.WrongFormat': {
    id: 'form.validation.Swift.WrongFormat',
    description: 'Error message: swift code is not in a valid format',
    defaultMessage: 'Swift code is not in the right format.'
  },
  'List.Empty': {
    id: 'form.validation.List.Empty',
    description: 'Error message: list, that needs at least one item, is empty',
    defaultMessage: 'At least one value is required.'
  },
  'PASSWORD_POLICY': {
    id: 'form.validation.password.weak',
    description: 'New password does not meet password policy',
    defaultMessage: 'Password is too weak.'
  },
  'FileUpload.TooBig': {
    id: 'form.validation.FileUpload.TooBig',
    description: 'User tried to upload file that exceeds our size limit',
    defaultMessage: 'File exceeds the maximum size.'
  },
  'isFullPhoneNumber': {
    id: 'form.validation.isFullPhoneNumber',
    description: 'User tried to save phone number without filling up both number and country code, or entered a non-number value',
    defaultMessage: 'This is not a valid phone number.'
  },
  'uploadError': {
    id: 'form.validation.uploadError',
    description: 'User tried to upload a file or files that are either too big, or have been moved from the disc',
    defaultMessage: 'There was an error while uploading. Either the file(s) is too big, or it could not be found.'
  }

})
