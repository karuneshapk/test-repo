var context = require.context(__dirname + '/', true, /spec\.js$/);
context.keys().forEach(context);
