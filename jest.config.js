export default {
  testEnvironment: 'jsdom',
  injectGlobals: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'app.js',
    '!node_modules/**',
  ],
  coverageDirectory: 'coverage',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true
};
