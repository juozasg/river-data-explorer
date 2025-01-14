import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [
    tsconfigPaths() as any,

    svelte({
      // hot: !process.env.VITEST,
      onwarn(warning, defaultHandler) {
        // don't warn on <marquee> elements, cos they're cool
        if (warning.code === 'a11y-distracting-elements') return;
        if (warning.code === 'a11y-click-events-have-key-events') return;
        if (warning.code === 'a11y_invalid_attribute') return;
        if (warning.code === 'a11y_no_noninteractive_element_to_interactive_role') return;
      }
    }) as any,

    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),

    svelteTesting(),
  ],
  test: {
    // include: ['./**/*.spec.ts'],
    exclude: ['tests-e2e/**/*', 'node_modules/**/*'],
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    globals: true,
  },

  resolve: {
    "conditions": ["browser"]
  }
})
