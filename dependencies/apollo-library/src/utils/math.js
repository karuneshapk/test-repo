/**
 * Calculate median value from array of numbers
 *
 * @param {Array<number>} values
 *
 * @return {number} median value
 */
export const median = values => {
  values.sort((a, b) => a - b)

  const half = ~~(values.length / 2)

  return (values.length % 2)
    ? values[half]
    : ((values[half - 1] + values[half]) / 2.0)
}

/**
 * Checks if argument could be natural number
 *
 * @example '1' => false
 * @example 0 => true
 * @example -1 => false
 * @example 0 => false
 * @example null => false
 * @example undefined => false
 *
 * @param {number|string} n
 * @return {bool}
 */
export const isNatural = n =>
  n === +n && n === (n | 0) && n > 0 && Math.floor(n) === +n

/**
 * Checks if argument is number
 *
 * @example '1' => false
 * @example 0 => true
 * @example -1 => true
 * @example 0 => true
 * @example null => false
 * @example undefined => false
 *
 * @param {number} n
 * @return {bool}
 */
export const isNumber = n =>
  typeof n === 'number' && !isNaN(n)

/**
 * Generate 128bit UUID (Universally Unique IDentifier) with
 * cryptographically secure PRNG
 *
 * @see http://www.ietf.org/rfc/rfc4122.txt
 * @perf ~3ns per unit (0.000003ms)
 *
 * @return {string}
 */
export const generateKey = () => {
  // info: there is a little performance difference between this variable
  // inlining and pre-alocation (prealocation will give us 1ns boost) but in
  // support of functional programming lookup table should be part of this
  // function as is
  //
  // info, do not translate this lookup table into for-loop it will slow down
  // this code by the order of magnitude to ~7000ns (0.007ms) per unit
  const chars = [
    '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b',
    '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17',
    '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23',
    '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b',
    '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47',
    '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53',
    '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f',
    '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b',
    '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77',
    '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83',
    '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f',
    '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b',
    '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7',
    'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3',
    'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf',
    'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb',
    'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7',
    'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3',
    'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef',
    'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb',
    'fc', 'fd', 'fe', 'ff'
  ]

  let r = Math.random() * 0xffffffff | 0

  return chars[r & 0xff]
    + chars[r >> 8 & 0xff]
    + chars[r >> 16 & 0xff]
    + chars[r >> 24 & 0xff]
    + '-'
    + chars[(r = Math.random() * 0xffffffff | 0) & 0xff]
    + chars[r >> 8 & 0xff]
    + '-' + chars[r >> 16 & 0x0f | 0x40]
    + chars[r >> 24 & 0xff]
    + '-'
    + chars[(r = Math.random() * 0xffffffff | 0) & 0x3f | 0x80]
    + chars[r >> 8 & 0xff]
    + '-' + chars[r >> 16 & 0xff]
    + chars[r >> 24 & 0xff]
    + chars[(r = Math.random() * 0xffffffff | 0) & 0xff]
    + chars[r >> 8 & 0xff]
    + chars[r >> 16 & 0xff]
    + chars[r >> 24 & 0xff]
}

/**
 * Hash key with MurmurHash algorithm
 *
 * @see https://en.wikipedia.org/wiki/MurmurHash
 *
 * @param {string} key
 * @param {number} seed number
 * @return {number} 32-bit integer hash
 */
export const hash = (key:string, seed:number) => {
  const remainder = key.length & 3
  const bytes = key.length - remainder
  const c1 = 0xcc9e2d51
  const c2 = 0x1b873593

  let h1 = Math.max(seed)
  let i = 0
  let k1 = 0
  let h1b = 0

  while (i < bytes) {
    k1 =
    ((key.charCodeAt(i) & 0xff)) |
    ((key.charCodeAt(++i) & 0xff) << 8) |
    ((key.charCodeAt(++i) & 0xff) << 16) |
    ((key.charCodeAt(++i) & 0xff) << 24)
    ++i

    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff
    k1 = (k1 << 15) | (k1 >>> 17)
    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff

    h1 ^= k1
    h1 = (h1 << 13) | (h1 >>> 19)
    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff
    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16))
  }

  k1 = 0;

  switch (remainder) {
    case 3: {
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8
      k1 ^= (key.charCodeAt(i) & 0xff)
      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff
      k1 = (k1 << 15) | (k1 >>> 17)
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff
      h1 ^= k1
      break
    }
    case 2: {
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8
      k1 ^= (key.charCodeAt(i) & 0xff)
      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff
      k1 = (k1 << 15) | (k1 >>> 17)
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff
      h1 ^= k1
      break
    }
    case 1: {
      k1 ^= (key.charCodeAt(i) & 0xff)
      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff
      k1 = (k1 << 15) | (k1 >>> 17)
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff
      h1 ^= k1
      break
    }
  }

  h1 ^= key.length

  h1 ^= h1 >>> 16
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + (
    (((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff
  h1 ^= h1 >>> 13
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + (
    (((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff
  h1 ^= h1 >>> 16

  return h1 >>> 0
}

export default {
  isNatural,
  isNumber,
  generateKey,
  hash
}
