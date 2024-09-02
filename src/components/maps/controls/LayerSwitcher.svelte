<script lang="ts">
	import { sites } from '$src/appstate/sites.svelte';
	import {
		isDatasetEnabled,
		setEnabledDatasets,
		toggleDatasetEnable
	} from '$src/appstate/ui/layers.svelte';
	import type { MapLayersParams } from '$src/lib/types/mapControls';
	import { onMount } from 'svelte';

	let { layersParams = $bindable() }: { layersParams: MapLayersParams } = $props();
	const datasets = $derived(sites.allDatasets);

	$effect(() => {
		// setEnabledDatasets(aremove(datasets, 'invert'));
		setEnabledDatasets(['sjrbc', 'steuben', 'usgs']);
	});
	const a = 1;

	let showLayersDropdown = $state(false);
	const dropdownToggle = (e: Event) => {
		e.stopPropagation();
		showLayersDropdown = !showLayersDropdown;
	};

	onMount(() => {
		document.body.addEventListener('click', (e) => {
			const checkboxContainer = (e.target as HTMLElement).closest('.dropdown-keep-open');
			if (checkboxContainer) return;
			showLayersDropdown = false;
		});
	});
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
			{#each datasets as dsname}
				<div class="dropdown-item dropdown-keep-open">
					<label class="checkbox" style="width: 100%">
						<input
							type="checkbox"
							checked={isDatasetEnabled(dsname)}
							onclick={() => toggleDatasetEnable(dsname)}
						/>
						<tt>{dsname}</tt> Sites
					</label>
				</div>
			{/each}

			<hr class="dropdown-divider" />
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a class="dropdown-item" onclick={() => (layersParams.baseStyleId = 'TOPO')}>
				<form>
					<input type="radio" name="topographic" checked={layersParams.baseStyleId == 'TOPO'} />
					Topographic
				</form>
			</a>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a class="dropdown-item" onclick={() => (layersParams.baseStyleId = 'SATELLITE')}>
				<input type="radio" name="satellite" checked={layersParams.baseStyleId == 'SATELLITE'} />
				Satellite
			</a>
			<hr class="dropdown-divider" />
			<div class="dropdown-item">
				<label class="checkbox">
					<input type="checkbox" bind:checked={layersParams.riverLayerVisible} />
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
		z-index: 1002;
		/* width: 200px; */
	}

	.dropdown-menu {
		width: 16rem !important;
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
