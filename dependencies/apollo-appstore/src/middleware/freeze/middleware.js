import { FREEZE_APP } from './constants'

/**
 * Creates redux middleware for application freeze, from time when
 * setFreeze is called every action will be discarted
 *
 * @returns {function}
 */
export const createAppFreezeMiddleware = () => {
  let freeze = false

  return () => next => action => {
    if (action.type === FREEZE_APP) {
      freeze = Boolean(action.payload)
    }

    if (freeze === false) {
      return next(action)
    }
  }
}
