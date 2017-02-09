import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { injectIntl, FormatMessage } from 'react-intl'
import Immutable, { fromJS, Map } from 'immutable'

import CommonMessages from 'apollo-library/messages/common'
import FileUpload from 'apollo-library/components/Forms/FileUpload'
import Button from 'apollo-library/components/Forms/Button'
import Input from 'apollo-library/components/Forms/Input'
import Row from 'apollo-library/components/UI/Row'
import Col from 'apollo-library/components/UI/Col'

const
  // Default model form multi uploader
  defaultModel = fromJS({
    name: null,
    file: null,
    fileName: null
  }),
  // Variable event types
  EVENT_TYPES = {
    CHANGE: 'change',
    BLUR: 'blur',
    FOCUS: 'focus'
  }

/**
 * Multi file uploader
 *
 * @see Design {@url http://41ug3a.axshare.com/#p=fund_manager_-_09_-_document_management&g=1}
 *
 * @property {!string} inputName
 * @property {Array<{name: string, file: string, fileName: string}>} initialValue
 *    File in base64
 * @property {boolean} showFirstEmpty Show firs row for add file default: true
 * @property {boolean} disabled Disabled all fields default: false
 * @property {Object} inputFileNameProps @see {Input Component}
 * @property {Object} fileUploadProps @see {FileUpload Component}
 * @property {Object} addButtonProps @see {Button Component},
 * @property {Object} removeButtonProps @see {Button Component}
 * @property {string|ReactNode} addButtonLabel
 * @property {string|ReactNode} noDocumentSelectedLabel
 * @property {string|ReactNode} chooseFileLabel
 *
 * @module
 */
export class MultiFileUpload extends Component {

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    initialValue: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      file: PropTypes.string,
      fileName: PropTypes.string
    })),
    showFirstEmpty: PropTypes.bool,
    disabled: PropTypes.bool,
    inputFileNameProps: PropTypes.object,
    fileUploadProps: PropTypes.object,
    addButtonProps: PropTypes.object,
    removeButtonProps: PropTypes.object,
    addButtonLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    noDocumentSelectedLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    chooseFileLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    removeButtonLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ])
  }

  static defaultProps = {
    initialValue: [],
    showFirstEmpty: true,
    disabled: false,
    inputFileNameProps: {},
    fileUploadProps: {},
    addButtonProps: {},
    removeButtonProps: {}
  }

  /**
   * Handle file name input change
   * Set name to form value
   *
   * @param {number} index
   * @param {SyntheticEvent} event
   */
  handleInputChange(index, event) {
    const {
        currentTarget: el
      } = event, {
        formProps: { onChange }
      } = this.props,
      values = this.getFormValues()

    onChange(
      values.set(index,
        values.get(index, Map()).merge({ name: el.value })
      )
    )
  }

  /**
   * Handle set original file name
   * Set fileNeme to form value
   *
   * @param {number} index
   * @param {string} fileName
   */
  handleFileNameSet(index, fileName) {
    const { formProps: { onChange } } = this.props
    const values = this.getFormValues()

    onChange(
      values.set(index,
        values.get(index, Map()).merge({ fileName }))
    )
  }

  /**
   * Handle all form props events
   *
   * @param {number} index
   * @param {string} type
   * @param {string} file - Come only with change type
   */
  handleFormPropsAction(index, type, file) {
    const { formProps } = this.props

    switch (type) {
      
      case EVENT_TYPES.CHANGE: {
        const values = this.getFormValues()

        let newValues = values.set(index,
          values.get(index, fromJS({})).merge({file}))

        formProps.onChange(newValues)
        break
      }
      
      case EVENT_TYPES.BLUR: {
        // Send only filed values
        formProps.onBlur(this.filterDefaultItems())
        break
      }
      
      case EVENT_TYPES.FOCUS: {
        // Send only filed values
        formProps.onFocus(this.filterDefaultItems())
        break
      }

    }
  }

  /**
   * Handle add new file
   * Put default item to form values
   */
  handleAddNewFileClick() {
    if (this.hasSetDefaultItem()) {
      return
    }

    const { formProps } = this.props
    formProps.onChange(this.getFormValues().push(defaultModel))
  }

  /**
   * Handle remove file
   * Remove file by index
   *
   * @param {number} index
   */
  handleRemoveFileClick(index) {
    const { formProps } = this.props
    formProps.onChange(this.getFormValues().delete(index))
  }

  /**
   * Has default item in form values
   *
   * @return {boolean}
   */
  hasSetDefaultItem() {
    return this.getFormValues().findIndex(it => Immutable.is(it, defaultModel)) !== -1
  }

  /**
   * Filter default item from form values
   *
   * @return {Immutable.List}
   */
  filterDefaultItems() {
    return this.getFormValues().filter(it => Immutable.is(it, defaultModel))
  }

  /**
   * Prepare file uploader by from value
   *
   * @return {ReactNode}
   */
  render() {
    const {
        showFirstEmpty,
        inputName,
        disabled,
        inputFileNameProps,
        fileUploadProps,
        addButtonProps,
        removeButtonProps,
        addButtonLabel,
        noDocumentSelectedLabel,
        chooseFileLabel,
        removeButtonLabel,
        intl: { formatMessage }
      } = this.props,
      // Translates
      enterFileName = formatMessage(CommonMessages.enterFileName),
      noDocumentSelected = formatMessage(CommonMessages.noDocumentSelected),
      addFile = formatMessage(CommonMessages.addFile),
      chooseFile = formatMessage(CommonMessages.chooseFile),
      remove = formatMessage(CommonMessages.remove)

    var
      values = this.getFormValues()

    if (values.size === 0 && showFirstEmpty) {
      values = values.push(defaultModel)
    }

    return (
      <Row>
        {values.map((value, i) => {
          let
            nameInputName = inputName + '[' + i + '][name]',
            fileInputName = inputName + '[' + i + '][file]'

          return (
            <Row key={i}>
              <Col md={12}>
                <Col md={4}>
                  <Input
                    disabled={disabled}
                    placeholder={enterFileName}
                    {...inputFileNameProps}
                    initialValue={value.get('name')}
                    inputName={nameInputName}
                    onBlur={this.handleInputChange.bind(this, i)} />
                </Col>
                <Col md={3}>
                  <FileUpload
                    {...fileUploadProps}
                    disabled={disabled}
                    type='button'
                    noValidation={true}
                    inputName={fileInputName}
                    setFileName={this.handleFileNameSet.bind(this, i)}
                    formProps={{
                      onChange: this.handleFormPropsAction.bind(this, i, EVENT_TYPES.CHANGE),
                      onBlur: this.handleFormPropsAction.bind(this, i, EVENT_TYPES.BLUR),
                      onFocus: this.handleFormPropsAction.bind(this, i, EVENT_TYPES.FOCUS)
                    }}>
                    {chooseFileLabel || chooseFile}
                  </FileUpload>
                </Col>
                <Col md={5}>
                  <Col md={10} className='padding-v-s'>
                    {value.get('fileName') === null ?
                      <span className='text-muted'>
                        {noDocumentSelectedLabel || noDocumentSelected}
                      </span> :
                      <span>{value.get('fileName')}</span>
                    }

                  </Col>
                  <Col md={2} className='padding-v-xs'>
                    {value.get('fileName') !== null &&
                      <Button
                        option='link'
                        className='pull-right'
                        title={remove}
                        {...removeButtonProps}
                        type='button'
                        onClick={this.handleRemoveFileClick.bind(this, i)}>
                        {removeButtonLabel ? removeButtonLabel :
                        <span
                          className='glyphicon glyphicon-remove text-danger'
                          aria-hidden='true'></span>}
                      </Button>}
                  </Col>
                </Col>
              </Col>
            </Row>
          )
        }).toArray()}
        <Row>
          <Col md={12}>
            <Button
              type='button'
              option='link'
              disabled={disabled || this.hasSetDefaultItem()}
              {...addButtonProps}
              onClick={this.handleAddNewFileClick.bind(this)}>
              {addButtonLabel || '+ ' + addFile}
            </Button>
          </Col>
        </Row>
      </Row>
    )
  }

  /**
   * Form values getter
   *
   * @return {Immutable.List}
   */
  getFormValues() {
    const {
        formProps: { value, onChange }
      } = this.props

    return fromJS(value || [])
  }
}

const IntlMultiFileUpload = injectIntl(MultiFileUpload)

// Setting static props to injectIntl component
IntlMultiFileUpload.defaultProps = MultiFileUpload.defaultProps
IntlMultiFileUpload.propTypes = MultiFileUpload.propTypes

export default IntlMultiFileUpload
