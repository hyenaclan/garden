/**
 * Jest configuration for the API application.
 * Uses ts-jest to compile TypeScript tests.
 */
module.exports = {
  // Use the ts-jest preset for TypeScript support
  preset: 'ts-jest', 
  
  // Test environment for Node.js
  testEnvironment: 'node', 
  
  // Root directory is the API app folder
  rootDir: '.',
  
  // Glob patterns to match test files
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts'
  ],
  
  // Module file extensions to resolve
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts'
  ],

  // Specify the compiler to use
  globals: {
    'ts-jest': {
      // Use the API's tsconfig.json file for compilation
      tsconfig: '<rootDir>/tsconfig.json', 
    },
  },

  // Test timeout (useful for async tests)
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true
};