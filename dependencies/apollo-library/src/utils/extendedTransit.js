var transit = require('transit-js')
var Immutable = require('immutable')

/* eslint no-underscore-dangle: 0 */
const recordName = record => (record._name || record.constructor.name || 'Record')

/**
 * factory for reader function
 *
 * @param {Object} recordMap
 * @param {function} missingRecordHandler
 *
 * @return {function}
 */
const createReader = (recordMap, missingRecordHandler) => transit.reader('json', {

  mapBuilder: {
    init() {
      return {}
    },
    add(m, k, v) {
      m[k] = v
      return m
    },
    finalize(m) {
      return m
    }
  },

  handlers: {
    iM(v) {
      var m = Immutable.Map().asMutable()
      for (var i = 0; i < v.length; i += 2) {
        m = m.set(v[i], v[i + 1])
      }
      return m.asImmutable()
    },
    iOM(v) {
      var m = Immutable.OrderedMap().asMutable()
      for (var i = 0; i < v.length; i += 2) {
        m = m.set(v[i], v[i + 1])
      }
      return m.asImmutable()
    },
    iL(v) {
      return Immutable.List(v)
    },
    iS(v) {
      return Immutable.Set(v)
    },
    iOS(v) {
      return Immutable.OrderedSet(v)
    },
    iR(v) {
      var RecordType = recordMap[v.n]
      return RecordType
        ? new RecordType(v.v)
        : missingRecordHandler(v.n, v.v)
    },
    func(v) {
      return eval.bind(null, v)
    },
    es6M(v) {
      return new Map(v)
    },
    es6S(v) {
      return Symbol(v.split('Symbol(')[1].slice(0, -1))
    }
  }
})

/**
 * factory for writer function
 *
 * @param {Object} recordMap
 * @param {function} predicate - filtering function
 *
 * @return {function}
 */
function createWriter(recordMap, predicate) {

  /**
   * Immutable.Map serializer
   *
   * @param {Immutable.Map} m
   *
   * @return {Object} serialized object
   */
  function mapSerializer(m) {
    var i = 0
    if (predicate) {
      m = m.filter(predicate)
    }
    var a = new Array(2 * m.size)
    m.forEach((v, k) => {
      a[i++] = k
      a[i++] = v
    })
    return a
  }

  var handlers = transit.map([
    Immutable.Map, transit.makeWriteHandler({
      tag() {
        return 'iM'
      },
      rep: mapSerializer
    }),
    Immutable.OrderedMap, transit.makeWriteHandler({
      tag() {
        return 'iOM'
      },
      rep: mapSerializer
    }),
    Immutable.List, transit.makeWriteHandler({
      tag() {
        return 'iL'
      },
      rep(v) {
        if (predicate) {
          v = v.filter(predicate)
        }
        return v.toArray()
      }
    }),
    Immutable.Set, transit.makeWriteHandler({
      tag() {
        return 'iS'
      },
      rep(v) {
        if (predicate) {
          v = v.filter(predicate)
        }
        return v.toArray()
      }
    }),
    Immutable.OrderedSet, transit.makeWriteHandler({
      tag() {
        return 'iOS'
      },
      rep(v) {
        if (predicate) {
          v = v.filter(predicate)
        }
        return v.toArray()
      }
    }),
    Function, transit.makeWriteHandler({
      tag() {
        return 'func'
      },
      rep(v) {
        return String(v)
      }
    }),
    Map, transit.makeWriteHandler({
      tag() {
        return 'es6M'
      },
      rep(v) {
        return [ ...v ]
      }
    }),
    Symbol, transit.makeWriteHandler({
      tag() {
        return 'es6S'
      },
      rep(v) {
        return String(v)
      }
    }),
    'default', transit.makeWriteHandler({
      tag() {
        return 'iM'
      },
      rep(m) {
        if (!('toMap' in m)) {
          var e = `Error serializing unrecognized object ${String(m)}`
          throw new Error(e)
        }
        return mapSerializer(m.toMap())
      }
    })
  ]);

  Object.keys(recordMap).forEach(name => {
    handlers.set(recordMap[name], makeRecordHandler(name, predicate));
  })

  return transit.writer('json', { handlers })
}

/**
 * fascade for record writer factory
 *
 * @param {string} name
 *
 * @return {function}
 */
function makeRecordHandler(name) {
  return transit.makeWriteHandler({
    tag() {
      return 'iR'
    },
    rep(m) {
      return {
        n: name,
        v: m.toObject()
      }
    }
  })
}

/**
 * Builder for service locator table that returns
 * singleton based on its name
 *
 * @param {Array<object>} recordClasses
 *
 * @return {Object} lookup table
 */
function buildRecordMap(recordClasses) {
  var recordMap = {}

  recordClasses.forEach(function(RecordType) {
    var rec = new RecordType({})
    var recName = recordName(rec)

    if (!recName || recName === 'Record') {
      throw new Error('Cannot (de)serialize Record() without a name')
    }

    if (recordMap[recName]) {
      throw new Error(`There\'s already a constructor for a Record named ${recName}`)
    }
    recordMap[recName] = RecordType
  })

  return recordMap
}

/**
 * Exception for missing record name
 *
 * @param {string} recName - the name of a singleton (className)
 */
function defaultMissingRecordHandler(recName) {
  throw new Error(`Tried to deserialize Record type named '${recName}',
    but no type with that name was passed to withRecords()`)
}

/**
 * Singleton class factory for extended transit
 *
 * @param {Object} options
 *
 * @return {Object} transit serializer/deserializer
 */
function createInstance(options = {}) {
  var records = options.records || {}
  var filter = options.filter || false
  var missingRecordFn = options.missingRecordHandler || defaultMissingRecordHandler

  var reader = createReader(records, missingRecordFn)
  var writer = createWriter(records, filter)

  return {
    toJSON(data) {
      return writer.write(data)
    },
    fromJSON(json) {
      return reader.read(json)
    },
    withFilter(predicate) {
      return createInstance({
        records,
        filter: predicate,
        missingRecordHandler: missingRecordFn
      })
    },
    withRecords(recordClasses, missingRecordHandler) {
      var recordMap = buildRecordMap(recordClasses)
      return createInstance({
        records: recordMap,
        filter,
        missingRecordHandler
      })
    }
  }
}

module.exports = createInstance()
