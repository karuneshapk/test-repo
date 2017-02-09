import { Map } from 'immutable'

const emptyCl = Map({})
export const codeListDescription = (cl = emptyCl, item) => cl.getIn([item, 'description'], item)
