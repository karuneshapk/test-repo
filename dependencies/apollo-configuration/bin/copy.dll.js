#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob-all')
const settings = require(path.resolve(__dirname, '../constants/settings'))
const utils = require(path.resolve(__dirname, '../utils/common'))

const libraryPath = path.join(settings.APOLLO_LIBRARY_ROOT_PATH, 'dll', process.env.NODE_ENV)

const libraryFiles = glob.sync([path.join(libraryPath, '*.js'), path.join(libraryPath, '*.map')])


libraryFiles.forEach(file => {
  utils.mkdirRecursive(settings.DLL_BUILD_PATH)
  fs.createReadStream(file).pipe(
    fs.createWriteStream(path.resolve(settings.DLL_BUILD_PATH, path.basename(file)))
  )
})
