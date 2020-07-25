require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'ES2018',
    typeRoots: ['node_modules/@types', 'src/@types'],
    jsx: 'preserve',
    lib: ['dom', 'esnext'],
    strict: true,
    noEmit: true,
    isolatedModules: true,
    esModuleInterop: true,
    noUnusedLocals: false,
    noImplicitAny: false,
  },
  exclude: ['node_modules', 'public', '.cache'],
})

exports.createPages = require('./gatsby/createPages').createPages
exports.onCreateWebpackConfig = require('./gatsby/onCreateWebpackConfig').onCreateWebpackConfig
