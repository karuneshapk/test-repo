/* global __DEV__ */
import React from 'react'
import deepmerge from 'deepmerge'
import scriptJS from 'scriptjs'

import { isNil, isDefined, joinRelativeURL } from 'apollo-library/utils/common'
import { setObjectAtKeyPath } from 'apollo-library/utils/object'

import { createRouteFromReactElement } from './router/RouteUtils'
import { setShared as setSharedAction } from './actions/sharedActions'
import { registerEndpoints } from './actions/endpointsActions'
import { isAuthenticated } from './utils/auth'
import { getModuleEndpointsName } from './middleware/api/utils'
import { getModulePathPrefix } from './utils/modules'
import { getModuleLocales } from './actions/localisation'

export const AS_MODULE_LOADED = '@@modules/LOADED'
export const AS_MODULE_UNLOADED = '@@modules/UNLOADED'
export const AS_MODULE_NOT_AVAILABLE = '@@modules/NOT_AVAILABLE'
export const AS_MODULES_UPDATED = '@@modules/UPDATED'
export const AS_MODULES_READY = '@@modules/READY'

const SET_AVAILABLE_MODULES = '@@moduleLoader/SET_AVAILABLE_MODULES'

const LOADED_MODULES = 'loadedModules'
const AVAILABLE_MODULES = 'availableModules'
const LOADING_MODULES = 'loadingModules'
const MOUNTED_MODULES = 'mountedModules'
const DYNAMIC_SHARED = 'dynamicShared'
const REDUCERS = 'reducers'
const ROOT_MODULE_NODE = 'rootModuleNode'
const CACHE = 'cache'
const READY = 'ready'
const APPLICATION_SHARED = 'appShared'
const ONLOAD_QUEUE = 'onLoadQueue'

/**
 * Creates module node
 * @param {Object} module - module's data
 * @param {?Object} parent
 *
 * @returns {Object}
 */
const createNode = (module, parent) => ({
  id: module.name,
  data: module,
  parent,
  children: []
})

/**
 * Add child to node's children
 *
 * @param {Object} node - module node
 * @param {Object} child - child module node
 *
 * @returns {number}
 */
const addChildrenToNode = (node, child) =>
  node.children.push(child)

/**
 * Evaluates UI script with some environment variables
 *
 * @param {Object} env
 * @param {String} script
 *
 * @returns {Object}
 */
const evalModule = (env = {}, script) => {
  /*
   * All of local variables of this function are global for the evaluated
   * script, so it has access to __MODULE_NAME__ where is module's name
   */

  try {
    /* eslint-disable no-unused-vars */
    const {
      name: __MODULE_NAME__
    } = env
    /* eslint-enable no-unused-vars */

    return eval(`
      (function() {
        return ${script}
      })();
    `)
  } catch(e) {
    if (__DEV__) {
      console.error(e) // eslint-disable-line no-console
    }
    return undefined
  }
}

/**
 * Create modules wrapper providing module info in context
 *
 * @param {ReactNode} Component - a React component to be wrapped
 * @param {string} moduleName - module name
 *
 * @returns {ReactNode}
 */
export const createModuleWrapper = (Component, moduleName) => {

  /**
   * Module wrapper component providing module name in context
   */
  class ModuleWrapper extends React.Component {

    static childContextTypes = {
      moduleName: React.PropTypes.string
    };

    /**
     * Returns context with module name property
     *
     * @returns {Object}
     */
    getChildContext() {
      return {
        moduleName
      }
    }

    /**
     * Renders wrapped module component
     *
     * @returns {ReactNode}
     */
    render() {
      return <Component {...this.props} />
    }

  }

  ModuleWrapper.moduleName = moduleName
  ModuleWrapper.origComponent = Component
  return ModuleWrapper
}

/**
 * Creates AS_MODULE_NOT_AVAILABLE action
 *
 * @param {string} name - module name
 *
 * @returns {Object} redux action
 */
export const moduleNotAvailable = name => ({
  type: AS_MODULE_NOT_AVAILABLE,
  name
})

/**
 * Creates AS_MODULE_LOADED action
 *
 * @param {string} name - module name
 * @param {Object} module - loaded module
 *
 * @returns {Object} redux action
 */
export const moduleLoaded = (name, module) => ({
  type: AS_MODULE_LOADED,
  name,
  module
})

/**
 * Creates AS_MODULE_UNLOAD action
 *
 * @param {string} name - module name
 * @param {boolean} force - force removal of module (caused by error)
 *
 * @returns {Object} redux action
 */
export const moduleUnloaded = name => ({
  type: AS_MODULE_UNLOADED,
  name
})

/**
 * Redux action creator for available modules
 * @param {Array} availableModules - list of available modules
 * @returns {Object}
 */
export const setAvailableModules = availableModules => ({
  type: SET_AVAILABLE_MODULES,
  availableModules
})

/**
 * Creates redux middleware
 *
 * @param {Object} moduleLoader - module loader instance
 *
 * @returns {function}
 */
export const moduleLoaderMiddleware = moduleLoader => store => next => action => // eslint-disable-line no-unused-vars, max-len
  action.type === SET_AVAILABLE_MODULES
    ? moduleLoader.setAvailableModules(action.availableModules)
    : next(action)

/**
 * Factory for module loader. It creates closure and exports some methods.
 *
 * @returns {Object}
 */
export const createModuleLoader = () => {

  let store = {
    dispatch() {
      console.error('Redux store is not provided!') // eslint-disable-line no-console
    }
  }

  const moduleState = new Map([
    [CACHE, new Map()],
    [AVAILABLE_MODULES, new Map()],
    [LOADED_MODULES, new Map()],
    [LOADING_MODULES, new Map()],
    [MOUNTED_MODULES, new Map()],
    [ROOT_MODULE_NODE, undefined],
    [DYNAMIC_SHARED, new Map()],
    [REDUCERS, new Map()],
    [READY, true],
    [APPLICATION_SHARED, {}],
    [ONLOAD_QUEUE, []]
  ])

  const listeners = []

  /**
   * Returns available modules from module's state
   * @returns {Map}
   */
  const getAvailableModules = () => moduleState.get(AVAILABLE_MODULES)

  /**
   * Returns loaded modules from module's state
   * @returns {Map}
   */
  const getLoadedModules = () => moduleState.get(LOADED_MODULES)

  /**
   * Gets loaded module
   * @param {string} moduleName
   * @returns {Object}
   */
  const getLoadedModule = moduleName =>
    getLoadedModules().get(moduleName)

  /**
   * Returns loaded modules from module's state
   * @returns {Map}
   */
  const getLoadingModules = () =>
    moduleState.get(LOADING_MODULES)

  /**
   * Saves loading module's promise
   * @param {string} moduleName
   * @param {Promise} promise
   *
   * @returns {Promise}
   */
  const setLoadingModule = (moduleName, promise) =>
    getLoadingModules().set(moduleName, promise).get(moduleName)

  /**
   * Returns loading promise for given module
   *
   * @param {string} moduleName
   * @returns {?Promise}
   */
  const getLoadingModulePromise = moduleName =>
    getLoadingModules().get(moduleName)

  /**
   * Adds module to on load queue
   *
   * @param {string} moduleName
   * @returns {*}
   */
  const queueModuleOnLoad = moduleName =>
    moduleState.get(ONLOAD_QUEUE).push(moduleName)

  /**
   * Runs onLoad handlers for queued modules
   */
  const processOnLoadQueue = () => {
    moduleState.get(ONLOAD_QUEUE).forEach(moduleName => handleOnLoad(moduleName))
    moduleState.set(ONLOAD_QUEUE, [])
  }

  /**
   * Get reducers
   * @returns {Map}
   */
  const getReducers = () => moduleState.get(REDUCERS)

  /**
   * Add new reducer
   * @param {string} moduleName
   * @param {function} reducer
   *
   * @returns {Map}
   */
  const addReducer = (moduleName, reducer) => getReducers().set(moduleName, reducer)

  /**
   * Sets dynamic shared data for module
   *
   * @param {string} moduleName
   * @param {Object} value
   * @returns {Map}
   */
  const setDynamicShared = (moduleName, value) =>
    moduleState.get(DYNAMIC_SHARED).set(moduleName, value)

  /**
   * Returns cache storage
   * @returns {Map}
   */
  const getCache = () =>
    moduleState.get(CACHE)

  /**
   * Sets value in a cache and retruns stored value
   *
   * @param {string} key
   * @param {*} value
   *
   * @returns {*}
   */
  const setCache = (key, value) => {
    getCache().set(key, value)
    return value
  }

  /**
   * Gets data from cache
   * @param {string} key
   * @returns {*}
   */
  const getFromCache = key =>
    getCache().get(key)

  /**
   * Clears cache
   *
   * @returns {Object}
   */
  const clearCache = () => getCache().clear()

  /**
   * Sets not ready state for modules
   * @param {boolean} isReady
   */
  const setReady = isReady => {
    moduleState.set(READY, isReady)
    store.dispatch({
      type: AS_MODULES_READY,
      payload: isReady
    })
    if (isReady) {
      processOnLoadQueue()
    }
  }

  /**
   * Returns whether the modules are ready or not
   * @returns {boolean}
   */
  const isReady = () => moduleState.get(READY)

  /**
   * Caches promise when successfuly resolved
   * @param {string} cacheKey
   * @param {Promise} promise
   * @returns {Promise}
   */
  const cachePromise = (cacheKey, promise) =>
    promise.then(data => Promise.resolve(setCache(cacheKey, data)))

  /**
   * Fetches module's ui part
   *
   * @param {string} name - module name
   * @param {string} path - url for ui module
   *
   * @returns {Promise}
   */
  const fetchModule = (name, path) => {
    const cacheKey = `ui_${name}`
    const cached = getFromCache(cacheKey)

    if (cached) {
      return Promise.resolve(cached)
    } else {
      return fetch(path).then(response => (
        response.ok
          ? cachePromise(cacheKey, response.text())
          : Promise.reject(new Error(`Cannot retrieve module ${name}: ${response.status}`))
      ))
    }
  }

  /**
   * Registers loaded module and returns promise with resolved module
   *
   * @param {string} name - module's name
   * @param {Object} ui - loaded and evaluated UI
   * @param {boolean} triggerNotify - whether trigger notification when registered (default true)
   *
   * @returns {Promise}
   */
  const registerModule = (name, ui, triggerNotify) => {
    const module = {
      name,
      root: ui.MainView && createModuleWrapper(ui.MainView, name),
      ...ui
    }

    getLoadedModules().set(name, module)
    getLoadingModules().delete(name)

    if (isDefined(module)) {
      if (module.routes) {
        module.routes = createRouteFromReactElement(module.routes)
      }

      // Register new reducers
      if (module.reducer) {
        addReducer(name, module.reducer)
      }

      // Register endpoints of this module
      if (module.endpoints) {
        store.dispatch(registerEndpoints(getModuleEndpointsName(name), module.endpoints))
      }
    }

    store.dispatch(moduleLoaded(name, module))

    if (triggerNotify) {
      notify()
    }

    if (module.onLoad) {
      queueModuleOnLoad(module.name)
    }

    return Promise.resolve(module)
  }

  /**
   * Loads modules ui
   *
   * @param {string} name - name of the module to be loaded
   * @returns {Promise}
   */
  const loadModuleFile = name => {
    const modulePathPrefix = getModulePathPrefix(name)
    const modulePath = joinRelativeURL(modulePathPrefix, 'main.js')

    if (__DEV__) {
      return fetchModule(name, modulePath).then(script =>
        Promise.resolve(evalModule({ name }, script))
      )
    }

    return new Promise((resolve, reject) => {
      scriptJS.urlArgs(process.env.BUILD_NUMBER)
      scriptJS(modulePath, () => {
        global['__MODULE_NAME__'] = name
        if (typeof global[`module_${name}`] === 'function') {
          resolve(global[`module_${name}`](1))
        } else {
          reject(new Error(`Cannot resolve module: ${name}`))
        }
        delete global['__MODULE_NAME__']
      })}
    )
  }

  /**
   * Checks whether module is loaded or not
   * @param {string} moduleName
   * @returns {?Object}
   */
  const getAvailableModule = moduleName =>
    getAvailableModules().get(moduleName)

  const getMountedModules = () =>
    moduleState.get(MOUNTED_MODULES)

  const setModuleMountState = (moduleName, mounted) => {
    const mountedModules = getMountedModules()
    if (!mounted) {
      mountedModules.delete(moduleName)
      handleOnUnmount(moduleName)
    } else {
      mountedModules.set(moduleName, true)
      handleOnMount(moduleName)
    }
  }

  /**
   * Checks whether module is loaded or not
   * @param {string} moduleName
   * @returns {boolean}
   */
  const isModuleLoaded = moduleName =>
    getLoadedModules().has(moduleName)

  /**
   * Checks whether module is mounted
   * @param {string} moduleName
   * @returns {boolean}
   */
  const isModuleMounted = moduleName =>
    moduleState.get(MOUNTED_MODULES).has(moduleName)

  /**
   * Checks whether module is loaded or not
   * @param {string} moduleName
   * @returns {boolean}
   */
  const isModuleLoading = moduleName =>
    getLoadingModules().has(moduleName)

  /**
   * Removes module from loading
   * @param {string} moduleName
   * @returns {*}
   */
  const removeLoadingModule = moduleName =>
    getLoadingModules().delete(moduleName)

  /**
   * Checks whether module is available or not
   * @param {string} moduleName
   * @returns {boolean}
   */
  const isModuleAvailable = moduleName =>
    !!getAvailableModule(moduleName)

  const setRootModuleNode = node =>
    moduleState.set(ROOT_MODULE_NODE, node)

  const getRootModuleNode = () =>
    moduleState.get(ROOT_MODULE_NODE)

  /**
   * Loads requested module if not loaded yet. Module consists of API (optional)
   * and UI. It returns promise which is resolved when all parts are loaded (API and UI).
   *
   * @param {string} name - name of the module to be loaded
   * @param {boolean} triggerNotify - whether load triggers notify (default true)
   *
   * @returns {promise}
   */
  const loadModule = (name, triggerNotify) => {

    if (!isDefined(triggerNotify)) {
      triggerNotify = true
    }

    if (!isModuleLoaded(name) && !isModuleLoading(name)) {
      const module = getAvailableModule(name)

      if (!module) {
        store.dispatch(moduleNotAvailable(name))
        return Promise.resolve(null)
      }

      module.lastError = undefined

      return setLoadingModule(
        name,
        loadModuleFile(name).then(data => {
          return store.dispatch(getModuleLocales(name))
            .then(() => registerModule(name, data, triggerNotify))
        })
      ).catch(error => {
        module.lastError = error
        removeLoadingModule(name)
      })
    } else {
      if (isModuleLoading(name)) {
        return getLoadingModulePromise(name)
      }

      return Promise.resolve(getLoadedModule(name))
    }
  }

  /**
   * Unloads module
   *
   * @param {string} moduleName - module to unload
   * @param {boolean} triggerNotify - whether trigger notify on unload (default true)
   */
  const unloadModule = (moduleName, triggerNotify = true) => {
    getLoadedModules().delete(moduleName)

    store.dispatch(moduleUnloaded(moduleName))
    if (triggerNotify) {
      notify()
    }
  }

  /**
   * Loads modules structure and adds it to parent node
   * @param {Object} module - module object
   * @param {?Object} parent - parent node
   * @returns {Promise}
   */
  const loadModuleStructure = (module, parent) => {
    const moduleRoutes = module.routes

    if (moduleRoutes) {
      const node = createNode(module, parent)

      if (parent) {
        addChildrenToNode(parent, node)
      }

      const promises = [
        Promise.resolve(node)
      ]

      if (moduleRoutes.childRoutes) {
        moduleRoutes.childRoutes.forEach(route => {
          if (route.module) {
            promises.push(loadModule(route.module, false).then(module => {
              if (isNil(module)) {
                return Promise.resolve(null)
              } else {
                return loadModuleStructure(module, node)
              }
            }).catch(notLoaded => {
              if (__DEV__) {
                console.error(`Module ${route.module} not loaded`, notLoaded) // eslint-disable-line no-console, max-len
              }
              return Promise.resolve(null)
            }))
          }
        })
      }

      return Promise.all(promises)
        .then(() => Promise.resolve(node))
        .catch(() => Promise.resolve(node))
    }

    return Promise.resolve(parent)
  }

  /**
   * Sets global default shared data for application
   * @param {Object} shared
   */
  const setApplicationShared = (shared) => {
    if (isDefined(shared) && shared !== null && typeof shared === 'object') {
      moduleState.set(APPLICATION_SHARED, shared)
    }
  }

  /**
   * Get shared data for application by context
   * @returns {?Object}
   */
  const getApplicationShared = () => {
    const applicationShared = moduleState.get(APPLICATION_SHARED)

    if (isDefined(applicationShared)) {
      return isAuthenticated()
        ? applicationShared.private
        : applicationShared.public
    }

    return undefined
  }

  /**
   * Merges shared data recursively from all modules and it's children
   *
   * @param {Object} shared - shared data object
   * @param {Object} module - module's node
   *
   * @returns {Object}
   */
  const buildSharedRecursive = (shared, module) => {
    const moduleDataShared = module.data.shared
    const dynamicShared = moduleState.get(DYNAMIC_SHARED)

    if (module.children && module.children.length) {
      module.children.forEach(childModule =>
        shared = buildSharedRecursive(shared, childModule)
      )
    }

    if (moduleDataShared) {
      if (moduleDataShared.onLoad) {
        shared = deepmerge(shared, moduleDataShared.onLoad)
      }

      if (moduleDataShared.onMount && isModuleMounted(module.id)) {
        shared = deepmerge(shared, moduleDataShared.onMount)
      }
    }

    if (dynamicShared.has(module.id)) {
      shared = deepmerge(shared, dynamicShared.get(module.id))
    }

    return shared
  }

  const buildShared = () => {
    const applicationShared = moduleState.get(APPLICATION_SHARED)
    const sharedConfig = applicationShared && applicationShared['config']
    const shared = buildSharedRecursive({}, getRootModuleNode())
    store.dispatch(setSharedAction({
      modules: shared,
      config: sharedConfig,
    }))
  }

  /**
   * Notifies listeners
   *
   * @returns {void}
   */
  const notify = () => {
    listeners.forEach(listener =>
      listener({
        availableModules: getAvailableModules(),
        loadedModules: getLoadedModules()
      })
    )

    store.dispatch({
      type: AS_MODULES_UPDATED,
      loadedModules: getLoadedModules(),
      availableModules: getAvailableModules(),
      mountedModules: getMountedModules()
    })
  }

  const getReducer = () => {
    // If there is new reducer we store it.
    // It's not advised to remove old reducers as some connected
    // components might rely on it and it would throw unexpected errors
    const dynamicReducers = getReducers()

    return (state = {}, action) => {
      if (!isReady()) {
        return state
      }

      const newState = {}

      dynamicReducers.forEach((reducer, moduleName) => {
        const moduleLoaded = isModuleLoaded(moduleName)

        newState[moduleName] = reducer(
          moduleLoaded ? state[moduleName] : undefined,
          action
        )
      })

      return newState
    }
  }

  /**
   * Sets shared data without building it, for updating set shared data and propagation
   * to store, use setShared function instead
   *
   * @param {string} moduleName - module which invokes set shared data
   * @param {string} destinationModule - module to receive shared data
   * @param {string} key - comma separated path where each part is a key of object in the structure
   * @param {*} value - value to be set
   */
  const setShared = (moduleName, destinationModule, key, value) => {
    const dynamicShared = moduleState.get(DYNAMIC_SHARED)
    const rootNode = dynamicShared.get(moduleName) || {}

    const keyParts = key.split('.')
    const lastKey = keyParts.pop()
    const keys = [ destinationModule, ...keyParts ]

    const updatedRootNode = setObjectAtKeyPath(rootNode, `${destinationModule}.${key}`, value)
    setDynamicShared(moduleName, updatedRootNode)
    buildShared()
  }

  /**
   * Invoke callback on module if present
   *
   * @param {string} moduleName - name of module to invoke the callback on
   * @param {string} callbackName - name of the callback exported on module
   */
  const callModuleEventCallback = (moduleName, callbackName) => {
    const module = getLoadedModule(moduleName)
    if (module && typeof module[callbackName] === 'function') {
      const shared = store.getState().root.shared.getIn(['modules', moduleName])
      const fakeStore = {
        dispatch: store.dispatch,
        getState: store.getState,
      }
      module[callbackName].call(module, fakeStore, shared, (...args) => setShared(moduleName, ...args))
    }
  }

  /**
   * On mount handler for modules
   *
   * @param {string} moduleName
   */
  const handleOnMount = moduleName => { callModuleEventCallback(moduleName, 'onMount') }

  /**
   * On load handler for modules
   *
   * @param {string} moduleName
   */
  const handleOnLoad = moduleName => { callModuleEventCallback(moduleName, 'onLoad') }

  /**
   * On unmount handler for modules
   *
   * @param {string} moduleName
   */
  const handleOnUnmount = moduleName => { callModuleEventCallback(moduleName, 'onUnmount') }

  return {
    setStore(reduxStore) {
      if (reduxStore) {
        store = reduxStore
      }
    },
    setActiveRouterModules(activeModules = []) {
      const mountedModules = moduleState.get(MOUNTED_MODULES)
      const dynamicShared = moduleState.get(DYNAMIC_SHARED)

      // remove not active modules
      mountedModules.forEach((value, mountedModule) => {
        if (!activeModules.includes(mountedModule)) {
          setModuleMountState(mountedModule, false)
          dynamicShared.delete(mountedModule)

          // trigger onUnmount
          const module = getLoadedModule(mountedModule)
          if (module && typeof module.onUnmount === 'function') {
            module.onUnmount({
              dispatch: store.dispatch,
              getState: store.getState
            })
          }
        }
      })

      activeModules.forEach(activeModule => {
        if (!mountedModules.has(activeModule)) {
          setModuleMountState(activeModule, true)
        }
      })

      buildShared()
      notify()
      setReady(true)
    },
    setAvailableModules(modules = []) {
      setReady(false)

      const availableModules = getAvailableModules()

      availableModules.clear()
      modules.forEach(module => availableModules.set(module.name, module))

      const loadedModules = getLoadedModules()
      loadedModules.forEach((loadedModule, moduleName) => {
        if (!isModuleAvailable(moduleName)) {
          this.unloadModule(moduleName, false)
        }
      })

      notify()
    },
    getLoadedModule,
    getLoadedModules,
    getLoadingModules,
    getAvailableModules,
    getRootModuleNode,
    loadModules(rootRoute) {

      const appModule = {
        name: 'APPLICATION',
        routes: rootRoute,
        shared: getApplicationShared()
      }

      return loadModuleStructure(appModule, null).then(rootNode => {
        setRootModuleNode(rootNode)
        notify()
        return Promise.resolve(rootNode)
      })
    },
    isModuleLoaded,
    isModuleLoading,
    isModuleAvailable,
    isModuleMounted,
    loadModule,
    unloadModule,
    setModuleMountState,
    clearCache,
    getReducer,
    setShared,
    setApplicationShared,
    subscribe(listener) {
      const index = listeners.push(listener)
      return () => listeners.splice(index, 1)
    }
  }
}
