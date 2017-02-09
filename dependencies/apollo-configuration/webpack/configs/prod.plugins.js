const webpack = require('webpack')
const Config = require('webpack-config').Config

const MergeDuplicateChunksPlugin = require('webpack/lib/optimize/MergeDuplicateChunksPlugin')
const RemoveEmptyChunksPlugin = require('webpack/lib/optimize/RemoveEmptyChunksPlugin')

module.exports = (new Config()).merge({
  filename: __filename,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      sourceMap: true,
      compress: {
        sequences     : true,  // join consecutive statemets with the “comma operator”
        properties    : false, // optimize property access: a["foo"] → a.foo
        dead_code     : true,  // discard unreachable code
        drop_debugger : true,  // discard “debugger” statements
        unsafe        : false, // some unsafe optimizations (see below)
        conditionals  : true,  // optimize if-s and conditional expressions
        comparisons   : true,  // optimize comparisons
        evaluate      : true,  // evaluate constant expressions
        booleans      : true,  // optimize boolean expressions
        loops         : true,  // optimize loops
        unused        : true,  // drop unused variables/functions
        hoist_funs    : true,  // hoist function declarations
        hoist_vars    : false, // hoist variable declarations
        if_return     : true,  // optimize if-s followed by return/continue
        join_vars     : true,  // join var declarations
        cascade       : true,  // try to cascade `right` into `left` in sequences
        side_effects  : true,  // drop side-effect-free statements
        warnings      : false,  // warn about potentially dangerous optimizations/code
        global_defs   : {}     // global definitions
      },
      output: {
        comments: false
      }
    }),
    new MergeDuplicateChunksPlugin(),
    new RemoveEmptyChunksPlugin()
  ]
})
