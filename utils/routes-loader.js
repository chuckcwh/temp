const toRegExp = require('path-to-regexp');

function escape(text) {
  return text.replace('\'', '\\\'').replace('\\', '\\\\');
}

/**
 * Converts application routes from JSON to JavaScript. For example, a route like
 *
 *   {
 *     "path": "/about",
 *     "page": "./pages/about"
 *   }
 *
 * becomes
 *
 *   {
 *     path: '/about',
 *     pattern: /^\\/about(?:\/(?=$))?$/i,
 *     keys: [],
 *     page: './pages/about',
 *     load: function () { return new Promise(resolve => require(['./pages/about'], resolve)); }
 *   }
 */
module.exports = function routesLoader(source) {
  this.cacheable();

  const output = ['[\n'];
  const routes = JSON.parse(source);

  for (const route of routes) {
    const keys = [];
    const pattern = toRegExp(route.path, keys);
    const require = route.path === '/' || route.path === '/error' ?
      module => `Promise.resolve(require('${module}'))` :
      module => `new Promise(function (resolve, reject) {
        try {
          require.ensure(['${module}'], function (require) {
            resolve(require('${module}'));
          });
        } catch (err) {
          reject(err);
        }
      })`;
    output.push('  {\n');
    output.push(`    path: '${escape(route.path)}',\n`);
    output.push(`    pattern: ${pattern.toString()},\n`);
    output.push(`    keys: ${JSON.stringify(keys)},\n`);
    output.push(`    page: '${escape(route.page)}',\n`);
    output.push(`    load: function load() { return ${require(escape(route.page))}; },\n`);
    output.push('  },\n');
  }

  output.push(']');

  return `module.exports = ${output.join('')};`;
};
