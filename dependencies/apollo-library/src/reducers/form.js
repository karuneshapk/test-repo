import { Map, OrderedMap, List } from 'immutable'
import { isUndefined } from 'apollo-library/utils/common'

import {
  RESET_STORE,
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
  SERVER_ERROR,
  BULK_UNCHECK_RADIOS,
  BULK_SET_INPUT_VALUES,
  NOT_SUBMITTING,
  FORM_SUBMITTING,
  SET_FORM_ASYNC_PENDING,
} from 'apollo-library/constants/actions'
import { MESSAGE_TYPE } from 'apollo-library/constants/components'

const initialState = Map({
  options: Map(),
  forms: Map(),
  actionsToRun: List()
})

/**
 * @param {Object} action - redux action to be processed
 * @param {Immutable.Map} state - redux subtree store state
 *
 * @return {Object}
 */
function bulkSetValidation(action, state) {
  var {
    formName,
    formErrors,
    fieldErrors
  } = action

  return state.mergeIn([ 'forms', formName ], {
    valid: !formErrors && !state.getIn([ 'forms', formName, 'fields' ]).find(field =>
      field.get('valid') === false
    ),
    error: formErrors,
    fields: state.getIn([ 'forms', formName, 'fields' ]).update(fields => fields.map(field => {
      const err = fieldErrors.find(fieldError =>
        fieldError.name === field.get('inputName')
      )
      if (err) {
        const { message } = err
        const messageType = (message && message.type)
        return field.merge({
          valid: messageType === MESSAGE_TYPE.INFO,
          error: message,
          serverError: err.serverError
        })
      } else {
        return field
      }
    }))
  })
}

/**
 * Retruns whether the new value is empty
 * @param {*} newValue
 * @returns {boolean}
 */
function isEmpty(newValue) {
  return newValue === '' || newValue === null || newValue === [] || newValue === {}
}

/**
 * Redux data transformer for form container
 *
 * @param {Immutable.Map} state - redux subtree store state
 * @param {Object} action - redux action to be processed
 *
 * @return {Immutable.Map} new (transformed) redux state
 */
export function formReducer(state = initialState, action) {

  switch (action.type) {

    case ADD_FORM: {
      const {
        formName,
        fields,
        validators,
        onSumbit,
        formOptions,
        validateOn,
        validationRunner,
        error
      } = action

      return state.mergeIn([ 'forms' ], {
        [ formName ]: Map({
          formName,
          fields: OrderedMap(fields.map(field => [
            field.inputName, Map(field).merge({
              dirty: false,
              touched: false
            })
          ])),
          dirty: false,
          touched: false,
          valid: !error,
          error,
          validators,
          onSubmit: onSumbit,
          formOptions,
          validateOn,
          validationRunner,
          submitting: false
        })
      })
    }

    case RESURRECT_FORM: {
      const {
        formName,
        validators,
        onSumbit,
        formOptions,
        validateOn,
        validationRunner,
        error
      } = action

      let { fields } = action

      return state.mergeIn([ 'forms' ], {
        [ formName ]: Map({
          formName,
          fields: state.getIn([ 'forms', formName, 'fields' ]).map((field) => {
            const newField = fields.find(newField =>
              newField.inputName === field.get('inputName')
            )

            if (newField) {
              newField.value = field.get('value')
              newField.dirty = false
              newField.touched = false
              fields = fields.filter(newField =>
                newField.inputName !== field.get('inputName')
              )
              return Map(newField)
            } else {
              return field
            }
          }).merge(fields.map(field =>
            [
              field.inputName,
              Map(field).merge({
                dirty: false,
                touched: false
              })
            ]
          )),
          dirty: false,
          touched: false,
          valid: !error,
          error,
          validators,
          onSubmit: onSumbit,
          formOptions,
          validateOn,
          validationRunner,
          submitting: false
        })
      })
    }

    case SET_DEFAULT_FORM_OPTIONS: {
      return state.mergeIn([ 'options' ], action.options)
    }

    case REMOVE_FORM: {
      return state.deleteIn([ 'forms', action.formName ])
    }

    case RESET_FORM: {
      const { formName } = action

      return state.mergeIn(['forms', formName], {
        dirty: false,
        touched: false,
        valid: true,
        error: false,
        fields: state.getIn(['forms', formName, 'fields']).map(field => field.merge({
          // get those values
          value: field.get('initialValue'),
          displayValue: undefined,
          checked: field.get('defaultChecked'),
          dirty: false,
          touched: false,
          valid: true,
          error: false
        }))
      })
    }

    case SET_FORM_VALIDATION_STATUS: {
      const {
        formName,
        valid,
        error
      } = action

      return state.mergeIn([ 'forms' ], {
        [formName]: state.getIn([ 'forms', formName ]).merge({
          valid: (valid && !state
            .getIn([ 'forms', formName, 'fields' ])
            .find(field => field.get('valid') === false)
          ),
          error
        })
      })
    }

    case SET_FORM_ASYNC_PENDING: {
      const {
        formName,
        inputName,
        pending,
      } = action

      return state.setIn([ 'forms', formName, 'fields', inputName, 'asyncPending' ], pending)
    }

    case ADD_INPUT: {
      const { formName, field } = action

      return state.mergeIn([ 'forms', formName, 'fields' ], Map(field))
    }

    case SHADOW_INPUT: {
      const { formName, inputName } = action

      return state.mergeIn([ 'forms', formName, 'fields', inputName ], {
        shadowed: true
      })
    }

    case UNSHADOW_INPUT: {
      const { formName, inputName } = action

      return state.mergeIn(['forms', formName, 'fields', inputName], {
        shadowed: false
      })
    }

    case UPDATE_INPUT_VALUE: {
      const {
        formName,
        inputName,
        newValue,
        newDisplayValue,
        caretPosition,
        checked,
      } = action

      const form = state.getIn(['forms', formName])

      if (!form) {
        return state
      }

      const inputField = form.getIn(['fields', inputName])

      if (!inputField) {
        return state
      }

      const initValue = inputField.get('initialValue')
      const isCheckable = inputField.get('isCheckable')

      // field is dirty if the new value is not equal to initial value,
      // or if the initial value is 'undefined', if the new value is not empty
      const dirty = isCheckable
        ? (!initValue !== !checked)
        : !(newValue === initValue || (isUndefined(initValue) && isEmpty(newValue)))

      // form is dirty if the new value is dirty,
      // or if any of the non-shadowed fields are dirty
      const formDirty = dirty || form.get('fields').some(field =>
        field.inputName !== inputName && !field.shadowed && field.dirty
      )

      return state.mergeIn([ 'forms', formName ], {
        dirty: formDirty,
        touched: true,
        fields: state.getIn([ 'forms', formName, 'fields' ]).mergeIn(
          [ inputName ], {
            value: newValue,
            displayValue: newDisplayValue,
            checked,
            dirty,
            touched: true,
            caretPosition
          }
        )
      })
    }

    case SET_INPUT_VALIDATION_STATUS: {
      const {
        formName,
        inputName,
        valid,
        error
      } = action

      const message = (error && error.message)
      const messageType = (message && message.type)

      return state.mergeIn([ 'forms', formName, 'fields', inputName ], {
        valid: valid || messageType === MESSAGE_TYPE.INFO,
        error
      }).mergeIn([ 'forms', formName ], {
        valid: state.getIn([ 'forms', formName, 'valid' ])
          && !state.getIn([ 'forms', formName, 'fields' ]).find(field =>
            field.get('valid') === false
          )
      })
    }

    case UPDATE_DYNAMIC_FORM_FIELDS: {
      const {
        formName,
        toAdd,
        toUpdateMasks,
        toShadow,
        toUnshadow,
        toUpdateValidators,
        toUpdateInitValue
      } = action

      return state.updateIn([ 'forms', formName, 'fields' ], fields =>
        fields.map(field => { // update all the fields
          // if toUpdateValidators contains this field, update its validators
          const updateValidatorsField = toUpdateValidators.find(fld =>
            fld.inputName === field.get('inputName')
          )

          field = updateValidatorsField
            ? field.set('validators', updateValidatorsField.validators)
            : field

          // change inital value
          const updateInitField = toUpdateInitValue.find(fld =>
            fld.inputName === field.get('inputName')
          )
          if (updateInitField) {
            field = field.merge({
              initialValue: updateInitField.initialValue,
              value: updateInitField.value,
              checked: updateInitField.checked,
            })
          }

          // if toUpdateMasks contains this field, update its masks
          const updateMasksField = toUpdateMasks.find(fld =>
            fld.inputName === field.get('inputName')
          )

          field = updateMasksField
            ? (
              field.merge({
                masks: updateMasksField.masks,
                value: updateMasksField.value
              })
              )
            : field

          // if it's in toShadow array, shadow it
          if (toShadow.find(name => name === field.get('inputName'))) {
            return field.merge({ shadowed: true })
          }

          // if it's in toUnshadow array, unshadow it
          const unshadowField = toUnshadow.find(fld =>
            fld.inputName === field.get('inputName')
          )

          if (unshadowField) {
            if (unshadowField.resetValue) {
              return field.merge({
                shadowed: false,
                value: unshadowField.value,
                displayValue: null,
                checked: unshadowField.checked,
                dirty: false,
                touched: false,
                error: null
              })
            } else {
              return field.merge({ shadowed: false })
            }
          }
          // else return it as it is
          return field
        })
        //and then add new fields
        .concat(toAdd.map(field => [ field.inputName, Map(field) ]))
      )
    }

    case BULK_SET_VALIDATION_STATUS: {
      return bulkSetValidation(action, state)
    }

    case SERVER_ERROR: {
      const { formName } = action

      if (formName) {
        const formOptions = state.getIn(['forms', formName, 'formOptions'])
        const onServerError =
          (formOptions && formOptions.onServerError)
          || state.getIn([ 'options', 'onServerError' ])

        if (onServerError) {
          const serverErrorOptions = (formOptions && formOptions.serverErrorOptions)
          const fieldNames = state.getIn([ 'forms', formName, 'fields' ])
            .filter(field => !field.get('shadowed'))
            .map(field => field.get('inputName'))
            .toJS()
          const errorAction = onServerError(action, fieldNames, serverErrorOptions)

          if (errorAction) {
            return bulkSetValidation(errorAction, state.mergeIn(
              [ 'forms', formName ], { submitting: false }
            ))
          }
        }
      }
      return state
    }

    case BULK_UNCHECK_RADIOS: {
      const {
        formName,
        inputName
      } = action

      const name = state.getIn([ 'forms', formName, 'fields', inputName, 'name' ])

      return name
        ? state.updateIn([ 'forms', formName, 'fields' ], fields =>
            fields.map(field => {
              if (field.get('name') === name
                && field.get('isRadio')
                && field.get('inputName') !== inputName) {
                return field.merge({ checked: false })
              } else {
                return field
              }
            })
          )
        : state
    }

    case BULK_SET_INPUT_VALUES: {
      const {
        inputFields,
        formName
      } = action

      return state.updateIn([ 'forms', formName, 'fields' ], fields =>
        fields.map(field => {
          const inputName = field.get('inputName')

          return inputFields.hasOwnProperty(inputName)
            ? field.merge({ value: inputFields[inputName] })
            : field
        })
      )
    }

    case NOT_SUBMITTING: {
      const { formName } = action

      if (state.getIn([ 'forms', formName ])) {
        return state.mergeIn(
          [ 'forms', formName ], { submitting: false }
        )
      } else {
        return state
      }
    }

    case FORM_SUBMITTING: {
      const { formName } = action

      if (state.getIn([ 'forms', formName ])) {
        return state.mergeIn([ 'forms', formName ], {
          submitting: true
        })
      } else {
        return state
      }
    }

    case RESET_STORE: {
      return state.set('forms', initialState.get('forms'))
    }

  }

  return state
}
