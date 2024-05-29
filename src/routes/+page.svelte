<script lang="ts">
	import AreaSelectorMap from '$src/components/maps/AreaSelectorMap.svelte';
	import { onMount } from 'svelte';

	let showLayersDropdown = $state(false);

	let showRiverLayer = $state(false);

	const setTopographic = () => {
		console.log('setTopographic');
	};

	const setSatellite = () => {
		console.log('setSatellite');
	};

	onMount(() => {
		document.body.addEventListener('click', (e) => {
      console.log('document click', e.target)
			showLayersDropdown = false;
		});
	});

	const dropdownToggle = (e) => {
    console.log('toggle', e.target)
		// console.log(e);
    e.stopPropagation();
		showLayersDropdown = !showLayersDropdown;
	};
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

<div class="dropdown" class:is-active={showLayersDropdown}>
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

<AreaSelectorMap zoom={7.8} />

<!-- svelte-ignore a11y-distracting-elements -->
<marquee>🚧🏗️ UNDER CONSTRUCTION... 🏗️🚧</marquee>

<style lang="scss">
	marquee {
		color: orange;
		font-size: 30px;
		max-width: 630px;
	}
</style>
