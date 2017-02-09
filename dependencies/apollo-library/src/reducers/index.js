import { combineReducers } from 'redux'

import { localisationReducer } from './localisations'
import { notificationsReducer } from './notifications'
import { dropdownReducer } from './dropdown'
import { modalContainerReducer } from './modalContainer'
import { formReducer } from './form'
import { tabComponentReducer } from './tab'

export default combineReducers({
  locales: localisationReducer,
  notifications: notificationsReducer,
  dropdown: dropdownReducer,
  modal: modalContainerReducer,
  form: formReducer,
  tabComponent: tabComponentReducer
})
