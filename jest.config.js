/** @type {import('jest').Config} */
export default {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'bundler',
          esModuleInterop: true,
          isolatedModules: true,
          types: ['node', 'jest', 'jest-extended', '@australiangreens/ag-error-jest'],
        },
      },
    ],
  },
  setupFilesAfterEnv: [
    'jest-extended/all',
    '@australiangreens/ag-error-jest',
  ],
  testEnvironment: 'node',
};
