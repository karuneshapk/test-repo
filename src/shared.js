import {
  DATE_FORMATS_KEY,
  DATE_FORMAT_SHORT_KEY,
  DATE_FORMAT_LONG_KEY
} from 'apollo-library/constants/general'

export default {
  config: {
    [DATE_FORMATS_KEY]: {
      [DATE_FORMAT_SHORT_KEY]: 'DD.MM.',
      [DATE_FORMAT_LONG_KEY]: 'DD.MM.YYYY'
    }
  }
}
