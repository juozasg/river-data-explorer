import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	// https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md']
		})
	],
	preserveWhitespace: true,

	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		alias: {
			$src: './src',
			$components: './src/components',
			$routes: './src/routes',
			$assets: './src/assets',
		}
	},
	onwarn: (warning, handler) => {
    // suppress warnings on `vite dev` and `vite build`; but even without this, things still work
    if (warning.code === "a11y-missing-attribute") return;
    if (warning.code === "a11y-click-events-have-key-events") return;
    if (warning.code === "a11y-no-static-element-interactions") return;
    handler(warning);
  },
};

export default config;
