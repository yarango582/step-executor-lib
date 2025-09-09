module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.ts', // Exclude entry point from coverage
    '!src/**/*.d.ts', // Exclude type definitions
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      useESM: false,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 10000, // Increase timeout for async tests
};