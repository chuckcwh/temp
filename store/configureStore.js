const DEBUG = !process.argv.includes('release');

if (!DEBUG) {
  module.exports = require('./configureStore.prod')
} else {
  module.exports = require('./configureStore.dev')
}
