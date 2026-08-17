import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['jest-extended/all', '@australiangreens/ag-error-jest'],
    server: {
      deps: {
        inline: [/@australiangreens\//],
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/**/*.test.ts'],
    },
  },
});
