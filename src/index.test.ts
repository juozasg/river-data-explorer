import { describe, it, expect, beforeEach } from 'vitest';
import { createRoot } from 'svelte';

import IndexPage from '$routes/+page.svelte'

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});

	let instance = null;

	beforeEach(() => {
		const host = document.createElement('div');
		document.body.appendChild(host);

		instance = createRoot(IndexPage, {target: host});
		instance.$set({foo: 'WIP'});
		console.log(instance);
		// TODO: https://github.com/testing-library/svelte-testing-library/issues/284
		// instance = render()
	});


});
