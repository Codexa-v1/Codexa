import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,            // allows using global test(), expect()
    environment: 'jsdom',     // simulates browser for components
    coverage: {
      provider: 'v8',         // coverage provider
      reporter: ['text', 'lcov'], // text output + lcov for Codecov
      reportsDirectory: './coverage',
    },
  },
});
