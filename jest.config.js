export default {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx|js)$": "ts-jest"
  },
  "setupFilesAfterEnv": [
    "jest-extended",
    "@australiangreens/ag-error-jest"
  ],
  "globals": {
    "ts-jest": {
      "isolatedModules": true
    }
  }
}