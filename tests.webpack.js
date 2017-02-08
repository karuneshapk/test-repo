var context = require.context(__dirname + '/src/modules', true, /test\/.*spec\.js$/)
context.keys().forEach(context)
var projectModuleIds = context.keys().map(module =>
  String(context.resolve(module)))

beforeEach(() => {
  // Remove our modules from the require cache before each test case.
  projectModuleIds.forEach(id => delete require.cache[id])
})

