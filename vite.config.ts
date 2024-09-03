import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import checker from 'vite-plugin-checker'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
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
