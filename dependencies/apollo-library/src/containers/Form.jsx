import React, { Component, PropTypes } from 'react'
import { fromJS, is as areIterablesEqual } from 'immutable'
import { connect } from 'react-redux'
import { Iterable, List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { isDefined, isUndefined, isFunction } from 'apollo-library/utils/common'
import {
  addForm,
  resurrectForm,
  removeForm,
  resetForm,
  setFormValidationStatus,
  addInput,
  shadowInput,
  unshadowInput,
  updateInputValue,
  setInputValidationStatus,
  updateDynamicFormFields,
  uncheckRadios,
  formSubmitting,
  setFormAsyncPending,
} from 'apollo-library/actions/form'
import { serverError } from 'apollo-library/actions/error'
import {
  VALIDATE_ON_MOUNT,
  VALIDATE_ON_FOCUS,
  VALIDATE_ON_CHANGE,
  VALIDATE_ON_BLUR,
  VALIDATE_ON_SUBMIT,
  MESSAGE_TYPE
} from 'apollo-library/constants/components'

/**
 * Decorator for form component
 *
 * @param {Function} onSubmit - submit callback
 * @param {String} formName - form name
 *
 * @module
 */
export class Form extends Component {

  static propTypes = {
    id: PropTypes.string,
    formName: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    serverError: PropTypes.func.isRequired,
    setFormAsyncPending: PropTypes.func.isRequired,
    dynamicForm: PropTypes.bool,
    validators: PropTypes.array,
    formOptions: PropTypes.object,
    setFormValidationStatus: PropTypes.func,
    setInputValidationStatus: PropTypes.func,
    removeForm: PropTypes.func,
    keepForm: PropTypes.bool,
    defaultOptions: PropTypes.object,
    updateDynamicFormFields: PropTypes.func,
    formSubmitting: PropTypes.func,
    updateInputValue: PropTypes.func,
    uncheckRadios: PropTypes.func,
    onChange: PropTypes.func,
    store: ImmutablePropTypes.map
  }

  /**
   * Binds submit
   * @constructor
   */
  constructor() {
    super(...arguments)

    this.submitForm = this.submitForm.bind(this)
  }

  /**
   * Gather data for fields and add the form to the store
   */
  componentWillMount() {
    this.addNewForm(this.props)
  }

  /**
   * Check if any of the input fields were removed or added to the form
   *
   * @param {Object} newProps - next props
   */
  componentWillReceiveProps(newProps) {
    const {
      formName,
      defaultOptions,
      dynamicForm,
      updateDynamicFormFields,
      removeForm
    } = this.props

    if (formName !== newProps.formName) {
      removeForm(formName)
      this.addNewForm(newProps)
      return
    }

    const { children, store } = newProps

    // "dynamicForm" prop allows for dynamic adding and removing of input fields
    if (dynamicForm) {
      const form = store.get(formName)

      if (form) {
        var toShadow = []
        var toUnshadow = []
        var toAdd = []
        var toUpdateValidators = []
        var toUpdateMasks = []
        var toUpdateInitValue = []
        const fields = form.get('fields')
        const formOptions = form.get('formOptions')
        const validateOn = form.get('validateOn')
        const validationRunner = form.get('validationRunner')

        // get all the fields in the new props
        const newFields = this.findFields(children, formName)

        // for every field in the new props, check if it's in the existing fields
        // if it is, and it's shadowed, unshadow it,
        // if it isn't, add it.
        newFields.forEach(current => {
          const props = current.props
          const oldField = fields.find(field => field.get('inputName') === props.inputName)

          if (oldField) {
            /* initial value change */
            const initialValue = props.initialValue

            if (!areIterablesEqual(fromJS(oldField.get('initialValue')), fromJS(initialValue))) {
              const checked = props.checked
              const isCheckable = this.isCheckable(props)
              const value = isCheckable
                ? (checked || false)
                : (isDefined(initialValue)
                    ? initialValue
                    : props.value
                  )

              toUpdateInitValue.push({
                inputName: props.inputName,
                value,
                checked,
                initialValue
              })
            }

            if (oldField.get('shadowed')) {
              const resetValue = props.resetValue
              const checked = props.checked

              var value
              if (resetValue) {
                const isCheckable = this.isCheckable(props)
                const initialValue = props.initialValue
                value = isCheckable
                  ? (checked || false)
                  : (isDefined(initialValue)
                      ? initialValue
                      : props.value
                    )
              }

              toUnshadow.push({
                inputName: props.inputName,
                resetValue: !!resetValue,
                value,
                checked
              })
            }

            var newValidatorsIterable = props.validators && fromJS(props.validators)
            var oldValidators = oldField.get('validators')
            var oldValidatorsIterable = oldValidators && fromJS(oldValidators)
            if (!areIterablesEqual(newValidatorsIterable, oldValidatorsIterable)) {
              toUpdateValidators.push({
                inputName: props.inputName,
                validators: props.validators
              })
            }

            var newMasks = props.masks
            var newMasksIterable = (newMasks && fromJS(newMasks))
            var oldMasks = oldField.get('masks')
            var oldMasksIterable = (oldMasks && fromJS(oldMasks))

            if (!areIterablesEqual(newMasksIterable, oldMasksIterable)) {
              toUpdateMasks.push({
                inputName: props.inputName,
                masks: props.masks
              })
            }
          } else {
            toAdd.push(this.prepareField(
              current.props, formName, formOptions, defaultOptions, validateOn, validationRunner
            ))
          }
        })

        // for every existing field, check if it's in the new props
        // if not, shadow it
        fields.forEach(field => {
          if (!field.get('shadowed')) {
            const newField = newFields.find(current =>
              current.props.inputName === field.get('inputName')
            )

            if (!newField) {
              toShadow.push(field.get('inputName'))
            }
          }
        })

        if (toAdd.length || toShadow.length || toUnshadow.length
          || toUpdateValidators.length || toUpdateMasks.length
          || toUpdateInitValue.length) {
          updateDynamicFormFields(formName, toAdd, toShadow, toUnshadow,
            toUpdateValidators, toUpdateMasks, toUpdateInitValue)
        }
      }
    }
  }

  /**
   * Remove form from the store on unmount
   * if keepForm prop was not set to true
   */
  componentWillUnmount() {
    const { removeForm, formName, keepForm } = this.props

    if (!keepForm) {
      removeForm(formName)
    }
  }

  /**
   * Callback for onChange for all input fields.
   * Calls the action creator to update the value of the input field in the store
   * and to validate the field and the form where applicable
   *
   * @param {string} inputName - name of the input field
   * @param {boolean} validate - whether to run the validations for the input field
   * @param {function} validationRunner - user-provided function that runs
   * the validation functions for input fields, bypassing built-in mechanism
   * @param {boolean} validateForm - whether to run the validations for the form
   * @param {function} formValidationRunner - user-provided function that runs
   * the validation functions for the form, bypassing built-in mechanism
   * @param {boolean} clearValidation - whether to reset the validation
   * @param {*} event - browser's onChange event,
   * or any value sent by the component if the component calls the callback manually
   * @param {*} newDisplayValue - optional; new display value,
   * for the components that use it
   * @param {number} caretPosition - current position of the caret
   *
   * @return {undefined}
   */
  onInputChange(
    inputName, validate, validationRunner,
    validateForm, formValidationRunner, clearValidation,
    event, newDisplayValue, caretPosition) {
    const {
      updateInputValue,
      setFormValidationStatus,
      setInputValidationStatus,
      formName,
      store,
      uncheckRadios,
      onChange
    } = this.props

    const form = store.get(formName)
    const inputField = form.getIn([ 'fields', inputName ])
    const target = event && event.currentTarget
    const isCheckable = inputField.get('isCheckable')
    const isRadio = inputField.get('isRadio')
    const checked = (isCheckable ? target.checked : null)
    const validators = inputField.get('validators', [])
    var value = (target ? target.value : event)

    if (clearValidation) {
      setInputValidationStatus(formName, inputName, false)
    }

    updateInputValue(formName, inputName, value, newDisplayValue, checked, caretPosition)

    if (isRadio) {
      uncheckRadios(formName, inputName)
    }

    if (validate && validators.length) {
      const error = this.validateInputField(
        inputName,
        isCheckable ? checked : value,
        validationRunner
      )
      setInputValidationStatus(formName, inputName, error)
    }

    if (validateForm) {
      var values = this.getFormValues(store, formName)
      values[inputName] = value
      const formError = this.validateForm(formValidationRunner, values)
      setFormValidationStatus(formName, formError)
    }

    if (typeof onChange === 'function') {
      const formValues = this.getFormValues(store, formName)
      /* update form values to actual input value */
      formValues[inputName] = isCheckable ? checked : value
      onChange(formValues, formName, inputName)
    }
  }

  /**
   * Callback for onBlur for all input fields,
   * used for validation where applicable
   */
  onInputBlur(...args) {
    this.onEventsValidation(...args)
  }

  /**
   * Callback for onFocus for all input fields,
   * used for validation where applicable
   */
  onInputFocus(...args) {
    this.onEventsValidation(...args)
  }

  /**
   * Does all the validation checks for input field event callbacks
   *
   * @param {string} inputName - name of the input field
   * @param {boolean} validate - whether to run the validations for the input field
   * @param {function} validationRunner - user-provided function that runs
   * the validation functions, bypassing built-in mechanism
   * @param {boolean} validateForm - whether to run the validations for the form
   * @param {function} formValidationRunner - user-provided function that runs
   * the validation functions for the form, bypassing built-in mechanism
   * @param {boolean} clearValidation - whether to reset validation
   *
   */
  onEventsValidation(inputName, validate, validationRunner,
    validateForm, formValidationRunner, clearValidation) {
    const {
      setFormValidationStatus,
      setInputValidationStatus,
      formName,
      store
    } = this.props

    const form = store.get(formName)
    const inputField = form.getIn([ 'fields', inputName ])
    const isCheckable = inputField.get('isCheckable')

    const validators = inputField.get('validators', []) || []
    const asyncValidator = inputField.get('asyncValidator')

    if (clearValidation) {
      this.clearValidation(clearValidation, inputName)
    }

    if (validate && (validators.length || asyncValidator)) {
      var value
      if (isCheckable) {
        value = inputField.get('checked')
      } else {
        value = inputField.get('value')
        if (Iterable.isIterable(value)) {
          value = value.toJS()
        }
      }

      const error = this.validateInputField(inputName, value, validationRunner)

      if (error) {
        setInputValidationStatus(formName, inputName, error)
      } else {
        this.validateInputFieldAsync(clearValidation, value, inputName, asyncValidator)
      }
    }

    if (validateForm) {
      const formError = this.validateForm(formValidationRunner)
      setFormValidationStatus(formName, formError)
    }
  }

  /**
   * Clear validation
   * @param {boolean} clearValidation - whether to reset validation
   * @param {string} inputName - name of the input field
   */
  clearValidation(clearValidation, inputName) {
    const {
      formName,
      setInputValidationStatus,
    } = this.props

    if (clearValidation) {
      setInputValidationStatus(formName, inputName, false)
    }
  }

  /**
   * Prepare data for the new form and add it to the store,
   * or just "resurrect" it, if it's already there, but was temporerily removed
   *
   * @param {Object} props - component props
   *
   */
  addNewForm(props) {
    const {
      store,
      defaultOptions,
      formName,
      addForm,
      resurrectForm,
      children,
      onSubmit,
      validators,
      formOptions
    } = props

    const validateFormOn = this.getFormValidateOnArr(formOptions, defaultOptions)
    const formValidationRunner = this.getFormValidationRunner(formOptions, defaultOptions)
    var error = false

    const fields = this.prepareFields(
      children, formName, formOptions, defaultOptions, validateFormOn, formValidationRunner
    )

    const values = fields.reduce((reduced, field) => {
      reduced[field.inputName] = field.isCheckable
        ? field.checked
        : field.value
      return reduced
    }, {})

    // if form needs to be updated on mount
    if (validateFormOn.indexOf(VALIDATE_ON_MOUNT) !== -1) {
      error = this.validateForm(formValidationRunner, values, validators)
    }

    // if form with this name does not exist already
    // (eg. is "kept" - see componentWillUnmount)
    if (!store.get(formName)) {
      addForm(
        formName, fields, onSubmit, validators, formOptions,
        validateFormOn, formValidationRunner, error
      )
    } else {
      resurrectForm(
        formName, fields, onSubmit, validators, formOptions,
        validateFormOn, formValidationRunner, error
      )
    }
  }

  /**
   * Finds all the input fields belonging to the form
   *
   * @param {Object} children - form React component "children" object
   * @param {String} formName - name of the form
   *
   * @return {Immutable.List}
   */
  findFields(children, formName) {
    var fields = List()

    React.Children.forEach(children, child => {
      // child can be null
      if (!child) {
        return
      }

      const props = child.props

      // if it's an html element, just return
      if (!props) {
        return
      }

      // if it has children, call this function on the children
      const nestedChildren = props.children

      if (nestedChildren) {
        fields = fields.concat(this.findFields(nestedChildren, formName))
      }

      // if it has prop inputName, we're interested in it
      const inputName = props.inputName
      if (inputName) {
        const inForm = props.inForm
        // if it doesn't belong to any specific form, or it belongs to this form
        // add it to the list
        if (!inForm || inForm === formName) {
          fields = fields.push(child)
        }
      }
    })

    return fields
  }

  /**
   * Gather data on forms input fields to be sent to the store
   *
   * @param {Object} children - form React component "children" object
   * @param {string} formName - name of the form
   * @param {Object} formOptions - settings specific for the current form
   * @param {Object} defaultFormOptions - general form settings
   * @param {Array} validateFormOn - list of event names triggering the validation
   * @param {function|boolean} formValidationRunner - function to run the validations
   *
   * @return {Array}
   */
  prepareFields(children, formName, formOptions, defaultFormOptions, validateFormOn, formValidationRunner) {
    var fields = []

    React.Children.forEach(children, child => {
      // child can be null
      if (!child) {
        return
      }

      const { props } = child

      // if it's an html element, just return
      if (!props) {
        return
      }

      // if it has children, call this function on the children
      const nestedChildren = props.children

      if (nestedChildren) {
        fields = fields.concat(this.prepareFields(
          nestedChildren, formName, formOptions, defaultFormOptions,
          validateFormOn, formValidationRunner
        ))
      }

      // if it has prop inputName, we're interested in it
      const inputName = props.inputName

      if (inputName) {
        const field = this.prepareField(
          props, formName, formOptions, defaultFormOptions,
          validateFormOn, formValidationRunner
        )

        if (field) {
          fields.push(field)
        }
      }
    })

    return fields
  }

  /**
   * Check if the field is "checkable" (radio or checkbox)
   *
   * @param {Object} props - input field's props
   *
   * @return {boolean}
   */
  isCheckable(props) {
    return props.hasOwnProperty('checked')
      || props.hasOwnProperty('defaultChecked')
      || (props.hasOwnProperty('type')
      && (props.type === 'checkbox' || props.type === 'radio')
    )
  }

  /**
   * Prepare data on input field to be sent to the store
   *
   * @param {Object} props - input field's props
   * @param {string} formName - name of the form
   * @param {Object} formOptions - settings specific for the current form
   * @param {Object} defaultFormOptions - general form settings
   * @param {Array} validateFormOn - list of event names triggering the validation
   * @param {function|boolean} formValidationRunner - function to run the validations
   *
   * @return {Array}
   */
  prepareField(props, formName, formOptions, defaultFormOptions, validateFormOn, formValidationRunner) {
    const {
      value,
      initialValue,
      displayValue,
      checked,
      defaultChecked,
      validators,
      asyncValidator,
      inputOptions,
      inForm,
      inputName,
      name,
      masks
    } = props

    var
      validateOn,
      validationRunner,
      maskRunner,
      clearValidationOn,
      error


    // get field validation settings from the options, or use default ones
    if (asyncValidator) {
      validateOn = [VALIDATE_ON_BLUR, VALIDATE_ON_SUBMIT]
    } else if (this.hasPropIsArray(inputOptions, 'validateOn')) {
      validateOn = inputOptions.validateOn
    } else if (this.hasPropIsArray(formOptions, 'validateFieldsOn')) {
      validateOn = formOptions.validateFieldsOn
    } else if (this.hasPropIsArray(defaultFormOptions, 'validateFieldsOn')) {
      validateOn = defaultFormOptions.validateFieldsOn
    } else {
      validateOn = [VALIDATE_ON_BLUR, VALIDATE_ON_SUBMIT]
    }

    // get field validation running functions from options
    if (this.hasPropIsFunc(inputOptions, 'validationRunner')) {
      validationRunner = inputOptions.validationRunner
    } else if (this.hasPropIsFunc(formOptions, 'fieldsValidationRunner')) {
      validationRunner = formOptions.fieldsValidationRunner
    } else if (this.hasPropIsFunc(defaultFormOptions, 'fieldsValidationRunner')) {
      validationRunner = defaultFormOptions.fieldsValidationRunner
    } else {
      validationRunner = false
    }

    // get field mask runner functions from options
    if (this.hasPropIsFunc(inputOptions, 'maskRunner')) {
      maskRunner = inputOptions.maskRunner
    } else if (this.hasPropIsFunc(formOptions, 'fieldsMaskRunner')) {
      maskRunner = formOptions.fieldsMaskRunner
    } else if (this.hasPropIsFunc(defaultFormOptions, 'fieldsMaskRunner')) {
      maskRunner = defaultFormOptions.fieldsMaskRunner
    } else {
      maskRunner = false
    }

    // get field clear-validation settings from the options, or use default ones
    if (asyncValidator) {
      clearValidationOn = [VALIDATE_ON_CHANGE]
    } else if (this.hasPropIsArray(inputOptions, 'clearValidationOn')) {
      clearValidationOn = inputOptions.clearValidationOn
    } else if (this.hasPropIsArray(formOptions, 'clearFieldsValidationOn')) {
      clearValidationOn = formOptions.clearFieldsValidationOn
    } else if (this.hasPropIsArray(defaultFormOptions, 'clearFieldsValidationOn')) {
      clearValidationOn = defaultFormOptions.clearFieldsValidationOn
    } else {
      clearValidationOn = []
    }

    // if onMount validation is set, validate it immediately
    if (validateOn.indexOf(VALIDATE_ON_MOUNT) !== -1) {
      const val = isDefined(value)
        ? value
        : initialValue

      if (validationRunner) {
        error = validationRunner(val, validators);
      } else if (validators && Array.isArray(validators)) {
        for (let i = 0; i < validators.length; i++) {
          error = validators[i](val)
          if (error) {
            break
          }
        }
      }
    }

    // is it a checkbox, radio, or a custom checkable component
    const isCheckable = this.isCheckable(props)
    const isRadio = (isCheckable && props.type === 'radio')

    // if it's a checkable element, use its "checked" value for initial value
    // else use initialValue or value
    var initValue = isCheckable
      ? (checked || false)
      : isDefined(initialValue)
        ? initialValue
        : value

    var fieldValue = isDefined(value)
      ? value
      : initialValue

    // if it doesn't belong to any specific form, or it belongs to this form
    // prepare the data for the store
    if (!inForm || inForm === formName) {
      return {
        inputName,
        formName,
        value:  fieldValue,
        initialValue: initValue,
        displayValue,
        name,
        checked: (isDefined(checked) ? checked : defaultChecked),
        isCheckable,
        isRadio,
        error,
        valid: !error,
        validators,
        asyncValidator,
        validateOn,
        validationRunner,
        maskRunner,
        inputOptions,
        masks,
        onChange: this.onInputChange.bind(this,
            inputName,
            validateOn.indexOf(VALIDATE_ON_CHANGE) !== -1,
            validationRunner,
            validateFormOn.indexOf(VALIDATE_ON_CHANGE) !== -1,
            formValidationRunner,
            clearValidationOn.indexOf(VALIDATE_ON_CHANGE) !== -1),
        onBlur: this.onInputBlur.bind(this,
            inputName,
            validateOn.indexOf(VALIDATE_ON_BLUR) !== -1,
            validationRunner,
            validateFormOn.indexOf(VALIDATE_ON_BLUR) !== -1,
            formValidationRunner,
            clearValidationOn.indexOf(VALIDATE_ON_BLUR) !== -1),
        onFocus: this.onInputFocus.bind(this,
            inputName,
            validateOn.indexOf(VALIDATE_ON_FOCUS) !== -1,
            validationRunner,
            validateFormOn.indexOf(VALIDATE_ON_FOCUS) !== -1,
            formValidationRunner,
            clearValidationOn.indexOf(VALIDATE_ON_FOCUS) !== -1)
      }
    }
  }

  /**
   * Get form validation settings from the options, or use default ones
   *
   * @param {Object} formOptions - current form options
   * @param {Object} defaultFormOptions - global form options
   *
   * @return {Array}
   */
  getFormValidateOnArr(formOptions, defaultFormOptions) {
    if (this.hasPropIsArray(formOptions, 'validateOn')) {
      return formOptions.validateOn
    } else if (this.hasPropIsArray(defaultFormOptions, 'validateOn')) {
      return defaultFormOptions.validateOn
    } else {
      return [VALIDATE_ON_SUBMIT]
    }
  }

  /**
   * Get form validation running function from options
   *
   * @param {Object} formOptions - current form options
   * @param {Object} defaultFormOptions - global form options
   *
   * @return {function|Boolean}
   */
  getFormValidationRunner(formOptions, defaultFormOptions) {
    if (this.hasPropIsFunc(formOptions, 'validationRunner')) {
      return formOptions.validationRunner
    } else if (this.hasPropIsFunc(defaultFormOptions, 'validationRunner')) {
      return defaultFormOptions.validationRunner
    } else {
      return false
    }
  }

  /**
   * Checks if object the first argument is an object,
   * if it has a property with the name of second argument
   * and if it's an array
   *
   * @param {*} obj
   * @param {String} prop
   *
   * @return {Boolean}
   */
  hasPropIsArray(obj, prop) {
    return !!(obj && obj[prop] && Array.isArray(obj[prop]))
  }

  /**
   * Checks if object the first argument is an object,
   * if it has a property with the name of second argument
   * and if it's a function
   *
   * @param {*} obj
   * @param {String} prop
   *
   * @return {Boolean}
   */
  hasPropIsFunc(obj, prop) {
    return !!(obj && obj[prop] && typeof obj[prop] === 'function')
  }

  /**
   * Callback for form submit event.
   * Checks if form all the fields need to be validated before submit;
   * does not submit if any of the validations returns an error
   *
   * @param {*} event - browser's submit event object
   *
   */
  submitForm(event) {
    if (event) {
      event.preventDefault();
    }

    const {
      onSubmit,
      formName,
      store,
      setFormValidationStatus,
      setInputValidationStatus,
      formSubmitting
    } = this.props
    var formError
    var fieldError

    const form = store.get(formName)
    const fields = form.get('fields')
    const validateOn = form.get('validateOn')
    const validationRunner = form.get('validationRunner')

    // if the form needs to be validated on submit
    if (validateOn.indexOf(VALIDATE_ON_SUBMIT) !== -1) {
      formError = this.validateForm(validationRunner)
      setFormValidationStatus(formName, formError)
    }

    if (!formError) {
      // check it any of the fields need to be validated on submit;
      // if so, run the validations and set the errors
      fieldError = fields.reduce((reduced, current) => {
        const fieldValidateOn = current.get('validateOn')
        const shadowed = current.get('shadowed')
        const asyncPending = current.get('asyncPending')

        if (asyncPending) {
          return true
        }

        var validateThisField = false

        if (fieldValidateOn.indexOf(VALIDATE_ON_SUBMIT) !== -1) {
          validateThisField = true
        }

        if (validateThisField && !shadowed) {
          const inputName = current.get('inputName')
          const isCheckable = current.get('isCheckable')
          let value = isCheckable
            ? current.get('checked')
            : current.get('value')
          let serverError = current.get('serverError') && current.get('error');
          serverError = serverError && serverError.toJS()

          if (Iterable.isIterable(value)) {
            value = value.toJS()
          }

          const error = this.validateInputField(
            inputName,
            value,
            current.get('validationRunner')
          ) || serverError

          setInputValidationStatus(formName, inputName, error)

          if (error) {
            var errorMessageType = (error.message && error.message.type)
            return errorMessageType !== MESSAGE_TYPE.INFO
          }
        }

        return reduced
      }, false)

      // if fields are not invalid, submit form
      if (!fieldError) {
        const formValues = this.getFormValues(store, formName)

        formSubmitting(formName)
        onSubmit(formValues, formName)
      }
    }
  }

  /**
   * Get the values of all the form's fields,
   * except the shadowed ones
   *
   * @param {Object} store - redux store containing all the forms
   * @param {string} formName - The name of the form
   *
   * @return {Object}
   */
  getFormValues(store, formName) {
    return store.getIn([ formName, 'fields' ]).reduce((reducedValue, field) => {
      if (!field.get('shadowed')) {
        var value = field.get('value');
        if (Iterable.isIterable(value)) {
          value = value.toJS();
        }
        reducedValue[field.get('inputName')] = field.get('isCheckable')
          ? field.get('checked') : value
      }
      return reducedValue;
    }, {})
  }

  /**
   * Running all the validations for the input field until one returns an error
   *
   * @param {String} inputName - input field name
   * @param {*} value - input field value
   * @param {Function} validationRunner - user-provided function that runs
   * the validation functions, bypassing built-in mechanism
   *
   * @return {*}
   */
  validateInputField(inputName, value, validationRunner) {
    const {
      formName,
      store
    } = this.props
    const validators = store.getIn([ formName, 'fields', inputName, 'validators' ], []) || []

    if (validationRunner) {
      return validationRunner(value, validators)
    }

    var error
    for (let i = 0; i < validators.length; i++) {
      error = validators[i](value)
      if (error) {
        return error
      }
    }

    return false
  }

  /**
   * Runs asynchronous validations
   * @param {boolean} clearValidation - whether reset validation
   * @param {*} value - input value
   * @param {string} inputName - name of the input field
   * @param {?function} asyncValidator - async validation
   */
  validateInputFieldAsync(clearValidation, value, inputName, asyncValidator) {
    if (!asyncValidator || (Array.isArray(asyncValidator) && asyncValidator.length === 0)) {
      this.clearValidation(clearValidation, inputName)
      return
    }

    const {
      formName,
      serverError,
      setFormAsyncPending,
    } = this.props

    setFormAsyncPending(formName, inputName, true)
    const promise = asyncValidator(value, inputName, formName)

    if (promise && isFunction(promise.then)) {
      promise
        .then(() => {
          setFormAsyncPending(formName, inputName, false)
          this.clearValidation(true, inputName)
        })
        .catch(response => {
          const {
            body,
            headers,
            request,
          } = response

          if (body && body.statusCode === 400) {
            const { errors } = (body.payload || {})

            if (errors) {
              const processedErrors = errors.map(error => ({
                ...error,
                attributeName: inputName,
              }))

              const safeRequest = request || {}

              serverError(
                headers,
                safeRequest.payload,
                safeRequest.methodName,
                400,
                processedErrors,
                { formName }
              )
            }
          }

          setFormAsyncPending(formName, inputName, false)
        })
    }
  }

  /**
   * Running all the validations for the form until one returns an error
   *
   * @param {function} validationRunner - user-provided function that runs
   * the validation functions, bypassing built-in mechanism
   * @param {Object} values - form fields values
   * @param {Array} validators - list of validators (strings, function of objects)
   *
   * @return {*}
   */
  validateForm(validationRunner, values, validators) {
    const {
      formName,
      store
    } = this.props

    validators = validators || store.getIn([ formName, 'validators' ]) || []
    values = values || this.getFormValues(store, formName)

    if (validationRunner) {
      return validationRunner(values, validators);
    }

    var error

    for (let i = 0; i < validators.length; i++) {
      error = validators[i](values)
      if (error) {
        return error
      }
    }

    return false
  }

  /**
   * Updates a React component (and it's children recursively)
   * adding form props to it if is an input field (has inputName props)
   * and it doesn't belong to another form
   *
   * @param {Object} child - React component to (conditionally) update
   * @param {Object} fields - current form's "fields" property
   * @param {string} formName - the name of the current form
   * @param {Object} status - input field status properties
   *
   * @return {Object} React component
   */
  updateChild(child, fields, formName, status) {
    // child can be null
    if (!child) {
      return child
    }

    var props = child.props
    // if it's an html element, just return it
    if (!props) {
      return child
    }

    const { children, inputName, formStatus } = props
    const belongsTo = props.formName
    // if it has children, update the children as well
    if (children) {
      var updatedChildren = React.Children.map(children, child =>
        this.updateChild(child, fields, formName, status)
      )
    }

    var errorComp = false
    // if the component needs to receive form errors
    if (formStatus) {
      errorComp = React.cloneElement(child, {
        formStatusProps: {
          error: status.error && status.error.toJS(),
          valid: status.valid,
          dirty: status.dirty,
          touched: status.touched,
          submitting: status.submitting
        }
      });
    }

    // if it's an input field and doesn't belong to another form,
    // add form props and updated children to it
    if (inputName && (isUndefined(belongsTo) || belongsTo === formName)) {
      if (fields && fields.get(inputName)) {
        return React.cloneElement(errorComp || child, {
          formProps: fields.get(inputName).toJS(),
          children: updatedChildren
        })
      }
      else {
        return React.cloneElement(errorComp || child, {
          formProps: {},
          children: updatedChildren
        })
      }
    }
    // if it's not an input field, but it has children,
    // update it's children prop
    else if (updatedChildren) {
      return React.cloneElement(errorComp || child, {
        children: updatedChildren
      })
    }
    else {
      return errorComp || child
    }
  }

  /**
   * Renders children (updated so that components with inputName prop
   * not belonging to another form have formProps prop)
   * enclosed in a <form> html tag
   *
   * @returns {ReactNode}
   */
  render() {
    const {
      id,
      children,
      className,
      formName,
      store
    } = this.props

    const fields = store.getIn([ formName, 'fields' ])
    const error = store.getIn([ formName, 'error' ])
    const valid = store.getIn([ formName, 'valid' ])
    const dirty = store.getIn([ formName, 'dirty' ])
    const touched = store.getIn([ formName, 'touched' ])
    const submitting = store.getIn([ formName, 'submitting' ])
    const status = {
      error,
      valid,
      dirty,
      touched,
      submitting
    }

    const updatedChildren = React.Children.map(children, child =>
      this.updateChild(child, fields, formName, status)
    )

    return (
      <form
        ref="form"
        onSubmit={this.submitForm}
        className={className}
        id={id}
      >
        {updatedChildren}
      </form>
    )
  }

}

export default connect(state => ({
  store: state.platform.form.get('forms'),
  defaultOptions: state.platform.form.get('options').toJS(),
  actionsToRun: state.platform.form.get('actionsToRun')
}), {
  addForm,
  resurrectForm,
  removeForm,
  resetForm,
  setFormValidationStatus,
  addInput,
  shadowInput,
  unshadowInput,
  updateInputValue,
  setInputValidationStatus,
  updateDynamicFormFields,
  uncheckRadios,
  formSubmitting,
  serverError,
  setFormAsyncPending,
}, null, { withRef: true })(Form)
