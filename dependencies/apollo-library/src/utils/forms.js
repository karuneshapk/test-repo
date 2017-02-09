/**
 * @param {ReactElement} formRef - reference to the form component
 */
export const submitForm = formRef => {
  if (formRef) {
    // we need to postpone form submit to next tick
    // so the referenced component gets updated and binded to new values
    setTimeout(() => {
      formRef.wrappedInstance.submitForm()
    }, 0)
  }
}
