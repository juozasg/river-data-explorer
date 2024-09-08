import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths';
import {svelteTesting} from '@testing-library/svelte/vite'


import checker from 'vite-plugin-checker'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		tsconfigPaths(),
    svelte(),
		svelteTesting(),
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

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
				@use "src/styles/variables.scss" as *;
				`
			}
		}
	}
})
