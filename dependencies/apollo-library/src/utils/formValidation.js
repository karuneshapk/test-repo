import validationFunctions from './validations'
import messages from 'apollo-library/messages/formValidation'
import { isDefined, isUndefined } from 'apollo-library/utils/common'

/**
 * Function for running all the validations applicable for a single form field
 * or the entire form
 *
 * @param {*} value - value of the form field (or the form) to be validated
 * @param {Array} validations - list of validations to apply to the value;
 *
 * each validation can be a string, or an object with
 * - "name" of the validation function from utils/validations, or "custom"
 *   function
 * - "args" for the validation function; value is always added to this list
 * as a first argument when the validation function is called
 * - "message" in react-intl 2.0 format (optional for non-custom)
 * - "messageArgs" object (needed for messages that have args)
 *
 * @return {Object|undefined} - containing react-intl message object and an
 *  object with arguments for the message
 */
export const validateForm = (value, validations) => {
  if (!validations) {
    return
  }
  for (let i = 0; i < validations.length; i++) {
    const validation = validations[i]
    let validationName, args, valid, custom, message, messageArgs, mandatory

    if (typeof validation === 'object') {
      args = [value].concat(validation.args)
      validationName = validation.name
      message = validation.message
      mandatory = validation.mandatory

      messageArgs = (!validation.messageArgs && validation.args)
        ? Object.assign({}, validation.args)
        : validation.messageArgs

      if (!mandatory && (isUndefined(value) || value === '')) {
        continue
      }

      if (validation.custom){
        custom = true
        valid = validation.custom.apply(null, args)
      }
    } else {
      args = [value]
      validationName = validation
    }

    if (!custom) {
      valid = validationFunctions[validationName].apply(null, args)
    }

    if (!valid) {
      const constantValidatorArgs = validationFunctions.messageArgs[validationName] || {}
      const mixedArgs = { ...constantValidatorArgs, ...messageArgs || {} }

      message = message || messages[validationName]

      return { message, values: mixedArgs }
    }
  }
}

/**
 * Function for running all the validations applicable for a single form field
 * or the entire form and returns an error only if all validations return false
 *
 * @param {*} value - value of the form field (or the form) to be validated
 * @param {Object} validationObj - object containing a list of validations
 * to apply to the value and a message to show if it fails the validation
 *
 * each validation can be a string, or an object with
 * - "name" of the validation function from utils/validations, or "custom"
 *   function
 * - "args" for the validation function; value is always added to this list
 * as a first argument when the validation function is called
 * - "message" in react-intl 2.0 format (optional for non-custom)
 * - "messageArgs" object (needed for messages that have args)
 *
 * @return {Object|undefined} - containing react-intl message object and an
 *  object with arguments for the message
 */
export const validateFormSoft = (value, validationObj) => {
  if (!validationObj || typeof validationObj !== 'object') {
    return
  }

  const {
    validations,
    message
  }  = validationObj

  if (!validations || !Array.isArray(validations) || !message) {
    return
  }

  for (let i = 0; i < validations.length; i++) {
    const validation = validations[i]
    let validationName, args, valid, custom, mandatory

    if (typeof validation === 'object') {
      args = [value].concat(validation.args)
      validationName = validation.name
      mandatory = validation.mandatory

      if (!mandatory && (isUndefined(value) || value === '')) {
        continue
      }

      if (validation.custom){
        custom = true
        valid = validation.custom.apply(null, args)
      }
    } else {
      args = [value]
      validationName = validation
    }

    if (!custom) {
      valid = validationFunctions[validationName].apply(null, args)
    }

    if (valid) {
      return
    }
  }

  return message
}

export default {
  validateForm,
  validateFormSoft,
  onServerError(error, inputFields, mappings) {
    // handle upload error - file is too big, or not found
    if (error.isUploadError) {
      return {
        formName: error.formName,
        formErrors: {
          message: messages.uploadError
        },
        fieldErrors: []
      }
    }

    if (error.statusCode !== 400) {
      return null
    }
    const errors = error.errors
    const attrMappings = (mappings && mappings.attrMappings)
    const codeMappings = (mappings && mappings.codeMappings)
    const argsMappings = (mappings && mappings.argsMappings)
    const customMessages = (mappings && mappings.customMessages)

    return errors.reduce((reduced, current) => {
      const attributeName = current.attributeName
      const mappedAttributeName = (attrMappings && attrMappings[attributeName])

      // error code should be same as our message name
      const currentCode = current.code
      const currentCodeMappings = (codeMappings && codeMappings[currentCode])

      // if there are custom messages in the options
      // then look for the messages there
      // else look in the standard messages
      // in either case first check in codeMappings
      const message = (customMessages && customMessages[currentCodeMappings])
        || (customMessages && customMessages[currentCode])
        || messages[currentCodeMappings]
        || messages[currentCode]
        || messages.noMessageFound

      // take arguments from the error
      const currentArguments = current.arguments
      var messageArgs = currentArguments
      var args = {}

      // if there are mappings for args, override the arguments from the error
      if (argsMappings && currentArguments && argsMappings[currentCode]) {
        for (const arg in currentArguments) {
          if (currentArguments.hasOwnProperty(arg)) {
            args[argsMappings[currentCode][arg]] = currentArguments[arg]
          }
        }
        messageArgs = args
      }

      // if current error has attributeName and
      // that name is either in inputFields or in the inputFields mapper
      if (attributeName && (inputFields[mappedAttributeName]
        || inputFields[attributeName])) {

        reduced.fieldErrors.push({
          name: mappedAttributeName || attributeName,
          message: {
            message,
            values: messageArgs
          },
          serverError: true
        })
      } else {
        // TODO: prepare rendering data when we decide on what the form errors will look like
        reduced.formErrors.push({
          message,
          values: messageArgs
        })
      }

      return reduced
    }, {
      formName: error.formName,
      formErrors: [],
      fieldErrors: []
    })
  }

}
