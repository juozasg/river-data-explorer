<script lang="ts">
	import { base } from '$app/paths';
	import * as sr from 'svelte/reactivity';

	import { sites, Sites } from '$src/appstate/sites.svelte';
	import { onMount } from 'svelte';
	import { data } from '@maptiler/sdk';
	import { setEnabledDatasets } from '$src/appstate/ui/layers.svelte';

	let showLayersDropdown = $state(false);
	const datasets = $derived(sites.allDatasets);
	const datasetsEnabled: { [key: string]: boolean } = $state({});

	$effect(() => {
		setEnabledDatasets(Object.keys(datasetsEnabled).filter((ds) => datasetsEnabled[ds]));
	});

	$effect(() => {
		for (const ds of datasets) {
			datasetsEnabled[ds] = false;
			// datasetsEnabled[ds] = true;
		}

		datasetsEnabled['sjrbc'] = true;
		// datasetsEnabled['usgs'] = true;
		// datasetsEnabled['invert'] = false;
	});

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

<div class="map-control dropdown" class:is-active={showLayersDropdown}>
	<div class="dropdown-trigger">
		<button
			class="button"
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
			{#each Object.entries(datasetsEnabled) as [ds]}
				<div class="dropdown-item">
					<label class="checkbox">
						<input type="checkbox" bind:checked={datasetsEnabled[ds]} />
						<tt>{ds}</tt> Sites
					</label>
				</div>
			{/each}

			<hr class="dropdown-divider" />
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a class="dropdown-item" onclick={setTopographic}>
				<form>
						<input type="radio" name="topographic" checked={baseStyleId == 'TOPO'} />
						Topographic
				</form>
			</a>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a class="dropdown-item" onclick={setSatellite}>
				<input type="radio" name="satellite" checked={baseStyleId == 'SATELLITE'} />
				Satellite
			</a>
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
	.map-control {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1000;
	}

	div.dropdown-item:hover {
		background-color: hsl(0, 0%, 96%);
		color: hsl(0, 0%, 4%);
	}

	input[type='checkbox'] {
		margin-right: 4px;
		position: relative;
		bottom: -1px;
	}
</style>
