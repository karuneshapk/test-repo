import { FREEZE_APP } from './constants'

export const freezeApp = () => ({
  type: FREEZE_APP,
  payload: true
})

export const unfreezeApp = () => ({
  type: FREEZE_APP,
  payload: false
})
