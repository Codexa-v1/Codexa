import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react({
    jsxRuntime: "automatic", // enables the new JSX transform everywhere
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',   // React Testing Library needs DOM
    setupFiles: './src/setupTests.jsx', // Jest-DOM matchers, etc.
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'], // required for Codecov + console output
      reportsDirectory: "./coverage",
      include: ['src/**/*.{js,jsx}'],
      exclude: ['**/*.test.{js,jsx}', 'src/setupTests.jsx'],
      reportOnFailure: true
    },
  },
})
