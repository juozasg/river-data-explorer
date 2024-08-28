<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { sites } from '$src/appstate/sites.svelte';
	import VarDataMap from '$src/components/maps/VarDataMap.svelte';
	import type { Site } from '$src/lib/types/site';
	import {
		MapFeatureSelectionState,
		toggleSelectedFeatureState
	} from '$src/appstate/map/featureState.svelte';

	let dataMap = $state<VarDataMap>();
	let selectedSite = $state<Site>();
	let yVarSite = $state<Site>();
	let zVarSite = $state<Site>();

	const selectedRegion = new MapFeatureSelectionState((c, u) =>
		toggleSelectedFeatureState(dataMap?.mlmMap, c, u)
	);
	const selectedRiver = new MapFeatureSelectionState((c, u) =>
		toggleSelectedFeatureState(dataMap?.mlmMap, c, u)
	);

	$effect(() => {
		selectedSite = sites.all.find((s) => s.id === 'sjrbc-1');
		yVarSite = sites.all.find((s) => s.id === 'steuben-1');
		zVarSite = sites.all.find((s) => s.id === 'sjrbc-6');
		// zVarSite = sites.all.find((s) => s.id === 'sjrbc-1');
	});

	function mapClick(map: ml.Map, p: ml.PointLike) {
		console.log('map click', p);
		console.log(
			dataMap?.hoveredRiver.feature,
			dataMap?.hoveredRegion.feature,
			dataMap?.hoveredSite
		);

		selectedSite = dataMap?.hoveredSite;
		selectedRegion.feature = dataMap?.hoveredRegion.feature;
		selectedRiver.feature = dataMap?.hoveredRiver.feature;
	}
</script>

<svelte:head>
	<title>St. Joseph River Basin Commission</title>
	<meta
		name="description"
		content="St Joseph River (Indiana) watershed water quality information, data and web map"
	/>
	<link
		rel="stylesheet"
		href="https://bulma.io/vendor/fontawesome-free-6.5.2-web/css/all.min.css"
	/>
</svelte:head>

<h1>St. Joseph River Basin Data</h1>

<VarDataMap
	bind:this={dataMap}
	zoom={8.2}
	{selectedSite}
	{yVarSite}
	{zVarSite}
	{mapClick}
	{selectedRegion}
	{selectedRiver}
	--map-width={'100%'}
	--map-height={'calc(90vh - 120px)'}
/>

<!-- svelte-ignore a11y_distracting_elements -->
<marquee>🚧🏗️ UNDER CONSTRUCTION... 🏗️🚧</marquee>

<!-- <math><mfrac>
	<mn>x</mn>
	<msup><mi>y</mi><mn>z</mn></msup>
</mfrac></math> -->

<style lang="scss">
	marquee {
		color: rgb(150, 73, 164);
		font-size: 30px;
		max-width: 630px;
	}
</style>
