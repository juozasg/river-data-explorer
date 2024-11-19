import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths';

import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		tsconfigPaths(),
    svelte({
			onwarn(warning, defaultHandler) {
        // don't warn on <marquee> elements, cos they're cool
        if (warning.code === 'a11y-distracting-elements') return;
        if (warning.code === 'a11y-click-events-have-key-events') return;
        if (warning.code === 'a11y_invalid_attribute') return;
        if (warning.code === 'a11y_no_noninteractive_element_to_interactive_role') return;
			}
		}),
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),

  ],
  // test: {
	// 	include: ['src/**/*.{test,spec}.{js,ts}'],
	// 	// globals: true,
	// 	// environment: 'jsdom'
	// },

	// css: {
	// 	preprocessorOptions: {
	// 		scss: {
	// 			additionalData: `
	// 			@use "src/styles/variables.scss" as *;
	// 			`
	// 		}
	// 	}
	// }
})
