<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	let showLayersDropdown = $state(false);

	interface Props {
		baseStyleId: string;
		showRiverLayer: boolean;
	}

	let { baseStyleId = $bindable(), showRiverLayer = $bindable() }: Props = $props();

	const setTopographic = () => {
		baseStyleId = 'TOPO';
		// console.log('TOPO')
	};

	const setSatellite = () => {
		baseStyleId = 'SATELLITE';
		// console.log('SATELLITE')
	};

	onMount(() => {
		document.body.addEventListener('click', (e) => {
			showLayersDropdown = false;
		});
	});

	const dropdownToggle = (e: Event) => {
		e.stopPropagation();
		showLayersDropdown = !showLayersDropdown;
	};
</script>

<div class="map-layer-switcher dropdown" class:is-active={showLayersDropdown}>
	<div class="dropdown-trigger">
		<button
			class="button is-small"
			aria-haspopup="true"
			aria-controls="dropdown-menu3"
			onclick={dropdownToggle}
		>
			<span class="dropdown-label">Layers</span>
			<span class="dropdown-arrow"></span>
		</button>
	</div>
	<div class="dropdown-menu" id="dropdown-menu3" role="menu">
		<div class="dropdown-content">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<a class="dropdown-item" onclick={setTopographic}>Topographic</a>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<a class="dropdown-item" onclick={setSatellite}>Satellite</a>
			<hr class="dropdown-divider" />
			<div class="dropdown-item">
				<label class="checkbox">
					<input type="checkbox" bind:checked={showRiverLayer} />
					Mainstem and Tributaries
				</label>
			</div>
		</div>
	</div>
</div>

<style>
	.map-layer-switcher {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1000;
	}

	div.dropdown-item:hover {
		background-color: hsl(0, 0%, 96%);
		color: hsl(0, 0%, 4%);
	}
</style>
