import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		// globals: true,
		// environment: 'jsdom'
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
				@use "src/styles/variables.scss" as *;
				`
			}
		}
	}
});
