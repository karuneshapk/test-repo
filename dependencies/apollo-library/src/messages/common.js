import { defineMessages } from 'react-intl'

export default defineMessages({

  serverError500: {
    id: 'common.serverError500',
    description: 'notification text to be shown to the user when there was an error on the server',
    defaultMessage: '{idCall}'
  },
  serverError500Old: {
    id: 'common.serverError500Old',
    description: 'Message for production?',
    defaultMessage: 'Oops, something bad happened on our side. Please try again latter.'
  },
  serverError403: {
    id: 'common.serverError403',
    description: 'notification text to be shown to the user when he has no rights do do something',
    defaultMessage: 'You don\'t have rights to do that. Please contact your manager.'
  },
  itemWithComma: {
    id: 'common.itemWithComma',
    description: 'item with comma',
    defaultMessage: '{item}, '
  },
  reset: {
    id: 'common.reset',
    description: 'Reset',
    defaultMessage: 'Reset'
  },
  cancel: {
    id: 'common.cancel',
    description: 'Cancel',
    defaultMessage: 'Cancel'
  },
  continue: {
    id: 'common.continue',
    description: 'Continue',
    defaultMessage: 'Continue'
  },
  or: {
    id: 'common.or',
    description: 'or',
    defaultMessage: 'or'
  },
  with: {
    id: 'common.with',
    description: 'with',
    defaultMessage: 'with'
  },
  close: {
    id: 'common.close',
    description: 'Close',
    defaultMessage: 'Close'
  },
  save: {
    id: 'common.save',
    description: 'Save changes',
    defaultMessage: 'Save changes'
  },
  saving: {
    id: 'common.saving',
    description: 'Saving',
    defaultMessage: 'Saving...'
  },
  apply: {
    id: 'common.apply',
    description: 'Apply',
    defaultMessage: 'Apply'
  },
  applying: {
    id: 'common.applying',
    description: 'Applying',
    defaultMessage: 'Applying...'
  },
  back: {
    id: 'common.back',
    description: 'go Back',
    defaultMessage: 'Back'
  },
  delete: {
    id: 'common.delete',
    description: 'Delete',
    defaultMessage: 'Delete'
  },
  deleting: {
    id: 'common.deleting',
    description: 'Deleting',
    defaultMessage: 'Deleting...'
  },
  submit: {
    id: 'common.submit',
    description: 'Submit form',
    defaultMessage: 'Submit'
  },
  submiting: {
    id: 'common.submiting',
    description: 'Submiting form',
    defaultMessage: 'Submiting...'
  },
  hide: {
    id: 'common.hide',
    description: 'Hide Label',
    defaultMessage: 'hide'
  },
  show: {
    id: 'common.show',
    description: 'Show Label',
    defaultMessage: 'show'
  },
  addFile: {
    id: 'common.add.file',
    description: 'Add file',
    defaultMessage: 'Add file'
  },
  browse: {
    id: 'common.browse',
    description: 'Browse',
    defaultMessage: 'Browse'
  },
  chooseFile: {
    id: 'common.choose.file',
    description: 'Choose file',
    defaultMessage: 'Choose file'
  },
  remove: {
    id: 'common.remove',
    description: 'Remove',
    defaultMessage: 'Remove'
  },
  /* Internal Error */
  internalErrorTitle: {
    id: 'common.error.title',
    description: 'Title of Internal Error Message',
    defaultMessage: 'Something bad happened'
  },
  internalErrorText: {
    id: 'common.error.text',
    description: 'Text of Internal Error Message',
    defaultMessage: 'We were unable to finish your operation. Please try again later.'
  },
  /* Confirmation */
  confirmation: {
    id: 'Confirmation.default.header',
    description: 'Confirmation default header',
    defaultMessage: 'Confirmation'
  },
  confirmationText: {
    id: 'Confirmation.default.text',
    description: 'Confirmation default text',
    defaultMessage: 'Are you sure?'
  },
  confirmationButton: {
    id: 'Confirmation.default.button',
    description: 'Confirmation default button',
    defaultMessage: 'Confirm'
  },
  /* Simple search */
  simpleSearchPlaceholder: {
    id: 'simpleSearch.default.placeholder',
    description: 'Simple search default placeholder',
    defaultMessage: 'Fulltext Search'
  },
  simpleSearchSubmitButton: {
    id: 'simpleSearch.default.submit.button',
    description: 'Simple search default submit button',
    defaultMessage: 'Search'
  },
  simpleSearchingSubmitButton: {
    id: 'simpleSearching.default.submit.button',
    description: 'Simple search default submit button while submitting',
    defaultMessage: 'Searching...'
  },
  yes: {
    id: 'common.yes',
    description: 'Yes',
    defaultMessage: 'Yes'
  },
  no: {
    id: 'common.no',
    description: 'No',
    defaultMessage: 'No'
  },
  notAvailabile: {
    id: 'common.notAvailable',
    description: 'Not available',
    defaultMessage: 'Not available'
  },
  enterFileName: {
    id: 'common.form.multiFileUpload.enter.file.name',
    description: 'Enter file name',
    defaultMessage: 'Enter file name...'
  },
  noDocumentSelected: {
    id: 'common.form.multiFileUpload.no.document',
    description: 'No document selected',
    defaultMessage: 'No document selected'
  },
  currency: {
    id: 'common.currency',
    description: 'currency',
    defaultMessage: 'Currency'
  },
  GBP: {
    id: 'common.currency.GBP',
    description: 'GBP currency symbol',
    defaultMessage: '£'
  },
  percentage: { //FIXME try to find usage and delete, use Percentage component instead
    id: 'common.percentage',
    description: 'Displays number in percents',
    defaultMessage: '{amount}%'
  },
  ordinal: {
    id: 'common.ordinal',
    description: 'ordinal',
    defaultMessage: '{value, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}'
  },
  optional: {
    id: 'common.optionalField',
    description: 'optional field',
    defaultMessage: '{field} (optional)'
  },
  TOSTitle: {
    id: 'common.form.TOS.title',
    description: 'Title of terms and conditions',
    defaultMessage: 'Please read terms & conditions'
  },
  firstName: {
    id: 'common.form.firstName',
    description: 'First Name',
    defaultMessage: 'First Name'
  },
  lastName: {
    id: 'common.form.lastName',
    description: 'Last Name',
    defaultMessage: 'Last Name'
  },
  emailAddress: {
    id: 'common.form.emailAddress',
    description: 'Email Address',
    defaultMessage: 'Your email Address'
  },
  emailAddressDescription: {
    id: 'common.form.emailAddressDescription',
    description: 'Email Address Description',
    defaultMessage: 'It will be your user name'
  },
  mobilePhone: {
    id: 'common.form.mobilePhone',
    description: 'Mobile Phone',
    defaultMessage: 'Mobile Phone Number'
  },
  mobilePhoneDescription: {
    id: 'common.form.mobilePhoneDescription',
    description: 'Mobile Phone Description',
    defaultMessage: 'To send your verification code'
  },
  password: {
    id: 'common.form.password',
    description: 'Password',
    defaultMessage: 'Password'
  },
  TOSModalTitle: {
    id: 'common.modal.TOS.title',
    description: 'terms & conditions modal title',
    defaultMessage: 'Terms and Conditions'
  },
  TOSAccept: {
    id: 'common.form.TOSAccept',
    description: 'terms & conditions presspeech',
    defaultMessage: 'I accept {link}'
  },
  TOSAcceptLink: {
    id: 'common.form.TOSAcceptLink',
    description: 'terms & conditions in link',
    defaultMessage: 'terms & conditions'
  },
  dateOfBirth: {
    id: 'common.form.dateOfBirth',
    description: 'Date of birth',
    defaultMessage: 'Date of birth'
  },
  phoneCode: {
    id: 'common.form.phoneCode',
    description: 'Phone code',
    defaultMessage: 'Phone code'
  },
  phoneNumber: {
    id: 'common.form.phoneNumber',
    description: 'Phone number',
    defaultMessage: 'Phone number'
  },
  addressLine: {
    id: 'common.form.addressLine',
    description: 'Address line',
    defaultMessage: 'Street and number'
  },
  city: {
    id: 'common.form.city',
    description: 'City',
    defaultMessage: 'City'
  },
  zipCode: {
    id: 'common.form.zipCode',
    description: 'Zip code',
    defaultMessage: 'Zip code'
  },
  registrationNumber: {
    id: 'common.form.registrationNumber',
    description: 'Taxpayer Identification Number',
    defaultMessage: 'TIN'
  },
  companyName: {
    id: 'common.form.companyName',
    description: 'Company name',
    defaultMessage: 'Company name'
  },
  legalForm: {
    id: 'common.form.legalForm',
    description: 'Legal form',
    defaultMessage: 'Legal form'
  },
  legalFormIndividual: {
    id: 'common.legalForm.individual',
    description: 'Individual',
    defaultMessage: 'Individual'
  },
  legalFormSelfEmployed: {
    id: 'common.legalForm.SelfEmployed',
    description: 'Self-employed',
    defaultMessage: 'Self-employed'
  },
  legalFormLegalEntity: {
    id: 'common.legalForm.LegalEntity',
    description: 'Legal entity',
    defaultMessage: 'Legal entity'
  },
  logout: {
    id: 'common.logout.logout',
    description: 'menu item - Logout',
    defaultMessage: 'Logout'
  },
  loggingOut: {
    id: 'common.logout.loggingOut',
    description: 'Logging out message',
    defaultMessage: 'Logging out ...'
  },
})
