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
    if (warning.code === "a11y_missing_attribute") return;
    if (warning.code === "a11y_click_events_have_key_events") return;
    if (warning.code === "a11y_no_static_element_interactions") return;
    handler(warning);
  },
};

export default config;
