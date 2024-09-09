<script lang="ts">
	// TODO: this is not necessary
	import { onMount } from 'svelte';

	let {
		element,
		width = $bindable(),
		height = $bindable(),
		contentRect = $bindable()
	}: {
		element: HTMLDivElement;
		width?: number;
		height?: number;
		contentRect?: DOMRectReadOnly;
	} = $props();

	let observer: ResizeObserver | undefined = $state();

	onMount(() => {
		observer = new window.ResizeObserver((entries) => {
			const entry = entries[0];
			// console.log('element contentRect', entry.contentRect);

			width = entry.contentRect.width;
			height = entry.contentRect.height;
			contentRect = entry.contentRect;
		});
	});

	$effect(() => {
		if (element && observer) {
			// console.log('OBSERVE element', element);
			observer.observe(element);
		}
	});
</script>
