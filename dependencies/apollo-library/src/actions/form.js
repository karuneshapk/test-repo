import {
  ADD_FORM,
  RESURRECT_FORM,
  SET_DEFAULT_FORM_OPTIONS,
  REMOVE_FORM,
  RESET_FORM,
  SET_FORM_VALIDATION_STATUS,
  ADD_INPUT,
  SHADOW_INPUT,
  UNSHADOW_INPUT,
  UPDATE_INPUT_VALUE,
  SET_INPUT_VALIDATION_STATUS,
  UPDATE_DYNAMIC_FORM_FIELDS,
  BULK_SET_VALIDATION_STATUS,
  BULK_UNCHECK_RADIOS,
  BULK_SET_INPUT_VALUES,
  NOT_SUBMITTING,
  FORM_SUBMITTING,
  SET_FORM_ASYNC_PENDING,
} from 'apollo-library/constants/actions'
import { isUndefined } from 'apollo-library/utils/common'

/**
 * Creates an action to add a new form
 *
 * @param {string} formName - the name of the new form
 * @param {Array} fields - list of input field objects
 * containing the name of the input field,
 * and optionally any of the following props:
 * initialValue, value, error
 * @param {function} onSubmit - submit callback
 * @param {Array} validators - list of validation functions
 * @param {Object} formOptions - form options
 * @param {Array} validateOn - list of event names triggering the validation
 * @param {function|Boolean} validationRunner - function to run the validations
 * @param {*} error - form error
 *
 * @return {Object}
 */
export const addForm = (formName, fields = [], onSubmit, validators, formOptions, validateOn, validationRunner, error) => ({
  type: ADD_FORM,
  formName,
  fields,
  onSubmit,
  validators,
  formOptions,
  validateOn,
  validationRunner,
  error
})

/**
 * Creates an action to resurrect existing form
 * (one that has been removed but not deleted)
 *
 * @param {String} formName - the name of the new form
 * @param {Array} fields - list of input field objects
 * containing the name of the input field,
 * and optionally any of the following props:
 * initialValue, value, error
 * @param {Function} onSubmit - submit callback
 * @param {Array} validators - list of validation functions
 * @param {Object} formOptions - form options
 * @param {Array} validateOn - list of event names triggering the validation
 * @param {Function|Boolean} validationRunner - function to run the validations
 * @param {*} error - form error
 *
 * @return {Object}
 */
export const resurrectForm = (formName, fields = [], onSubmit, validators, formOptions, validateOn, validationRunner, error) => ({
  type: RESURRECT_FORM,
  formName,
  fields,
  onSubmit,
  validators,
  formOptions,
  validateOn,
  validationRunner,
  error
})

/**
 * Creates an action to set default options for all forms
 *
 * @param {Object} options - object with options
 *
 * @return {Object}
 */
export const setDefaultFormOptions = options => ({
  type: SET_DEFAULT_FORM_OPTIONS,
  options
})

/**
 * Creates an action to remove an existing form from the state
 *
 * @param {String} formName - the name of the form
 *
 * @return {Object}
 */
export const removeForm = formName => ({
  type: REMOVE_FORM,
  formName
})

/**
 * Creates an action to reset form to it's initial state
 *
 * @param {String} formName - the name of the form
 *
 * @return {Object}
 */
export const resetForm = formName => ({
  type: RESET_FORM,
  formName
})

/**
 * Creates an action to set the validity and error message prop for the form
 *
 * @param {String} formName - the name of the form
 * @param {*} error - error message
 *
 * @return {Object}
 */
export const setFormValidationStatus = (formName, error) => ({
  type: SET_FORM_VALIDATION_STATUS,
  formName,
  error,
  valid: !error
})

/**
 * Creates an action to add input field to a form after the form was created
 *
 * @param {String} formName - the name of the form
 * @param {Object} field - new field to add to the form
 *
 * @return {Object}
 */
export const addInput = (formName, field) => ({
  type: ADD_INPUT,
  formName,
  field
})

/**
 * Creates an action to shadow the input field in a form
 * Shadowed field will now be submitted with the form,
 * and it won't be validated
 *
 * @param {String} formName - the name of the form
 * @param {String} inputName - the name of the input field
 *
 * @return {Object}
 */
export const shadowInput = (formName, inputName) => ({
  type: SHADOW_INPUT,
  formName,
  inputName
})

/**
 * Creates an action to "unshadow" a shadowed input field
 *
 * @param {String} formName - the name of the form
 * @param {Object} inputName - the name of the input field
 *
 * @return {Object}
 */
export const unshadowInput = (formName, inputName) => ({
  type: UNSHADOW_INPUT,
  formName,
  inputName
})

/**
 * Creates an action to update the value of an input field
 *
 * @param {string} formName - form name
 * @param {string} inputName - input field name
 * @param {*} newValue - new value for the input field
 * @param {*} newDisplayValue - new display (alternative) value for the input field
 * @param {boolean} checked
 * @param {number} caretPosition
 *
 * @return {Object}
 */
export function updateInputValue(formName, inputName, newValue,
  newDisplayValue, checked, caretPosition) {

  return {
    type: UPDATE_INPUT_VALUE,
    formName,
    inputName,
    newValue,
    newDisplayValue,
    caretPosition,
    checked,
  }
}

/**
 * Creates an action to set the validity and error message prop
 * for the input field and the form
 *
 * @param {String} formName - the name of the form
 * @param {Object} inputName - the name of the input field
 * @param {*} error - error message
 *
 * @return {Object}
 */
export const setInputValidationStatus = (formName, inputName, error) => ({
  type: SET_INPUT_VALIDATION_STATUS,
  formName,
  inputName,
  error,
  valid: !error
})

/**
 * Creates an action to add, shadow and unshadow multiple fields at once
 * as an optimisation for dynamical forms
 *
 * @param {String} formName - the name of the form
 * @param {Array} toAdd - an array of fields to add to the form
 * @param {Array} toShadow - an array of fields to shadow
 * @param {Array} toUnshadow - an array of fields to unshadow
 * @param {Array} toUpdateValidators - an array of fields the validators should be updated for
 * @param {Array} toUpdateInitValue - an array of fields the init value should be updated for
 * @param {*} toUpdateMasks
 *
 * @return {Object}
 */
export const updateDynamicFormFields = (formName, toAdd, toShadow, toUnshadow, toUpdateValidators, toUpdateMasks, toUpdateInitValue) => ({
  type: UPDATE_DYNAMIC_FORM_FIELDS,
  formName,
  toAdd,
  toShadow,
  toUnshadow,
  toUpdateValidators,
  toUpdateMasks,
  toUpdateInitValue
})

/**
 * Creates an action to add multiple errors to form fields and the form itself
 *
 * @param {String} formName - the name of the form
 * @param {Object} formError - form error
 * @param {Array} fieldErrors - an array of field errors
 *
 * @return {Object}
 */
export const bulkSetValidationStatus = (formName, formError, fieldErrors) => ({
  type: BULK_SET_VALIDATION_STATUS,
  formName,
  formError,
  fieldErrors
})

/**
 * Creates an action to uncheck all radio buttons from the same "group"
 * of the radio with inputName, except for the radio with inputName
 *
 * @param {String} formName - the name of the form
 * @param {String} inputName - the name of the radio button
 *
 * @return {Object}
 */
export const uncheckRadios = (formName, inputName) => ({
  type: BULK_UNCHECK_RADIOS,
  formName,
  inputName
})

/**
 * Creates an action to update multiple field values
 *
 * @param {String} formName - the name of the form
 * @param {Object} inputFields - like {firstName: David, lastName: Copperfield}
 *
 * @return {Object}
 */
export const bulkUpdateFieldValues = (formName, inputFields) => ({
  type: BULK_SET_INPUT_VALUES,
  formName,
  inputFields
})

/**
 * Creates an action to unset submitting prop of the form
 *
 * @param {String} formName - the name of the form
 *
 * @return {Object}
 */
export const formNotSubmitting = formName => ({
  type: NOT_SUBMITTING,
  formName
})

/**
 * Creates an action to set submitting prop of the form
 *
 * @param {String} formName - the name of the form
 *
 * @return {Object}
 */
export const formSubmitting = formName => ({
  type: FORM_SUBMITTING,
  formName
})

/**
 * Creates an action to set pending validation
 *
 * @param {String} formName - the name of the form
 * @param {String} inputName - the name of the input name
 * @param {boolean} pending - bool pending
 *
 * @return {Object}
 */
export const setFormAsyncPending = (formName, inputName, pending) => ({
  type: SET_FORM_ASYNC_PENDING,
  formName,
  inputName,
  pending,
})
