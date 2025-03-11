<script lang="ts">
	// import App from "$src/App.svelte";
	import AppMenu from "./AppMenu.svelte";
	import AppPanelTabs from "./AppPanelTabs.svelte";
	import PanelChart from "./PanelChart.svelte";
	import PanelData1 from "./PanelData1.svelte";
	import PanelData2 from "./PanelData2.svelte";
	import PanelMap from "./PanelMap.svelte";

	let clientWidth = $state(0);
	let clientHeight = $state(0);
	const mobile = $derived(clientWidth <= 720 || clientHeight < 720);
	const mapMaximized = true;

	let selectedPanel:string = $state('map');
</script>

<main bind:clientWidth bind:clientHeight class:mobile class:map-maximized={mapMaximized}>
	<div class="app-header">
		<AppMenu {mobile}/>
		{#if mobile}
			<AppPanelTabs bind:selectedPanel />
		{/if}
	</div>

	<div class="panel panel-map" class:selected={selectedPanel === 'map'}>
		<PanelMap />
	</div>

	<div class="panel panel-data1" class:selected={selectedPanel === 'data1'}>
		<PanelData1 />
	</div>

	<div class="panel panel-data2" class:selected={selectedPanel === 'data2'}>
		<PanelData2	/>
	</div>

	<div class="panel panel-chart" class:selected={selectedPanel === 'chart'}>
		<PanelChart />
	</div>
</main>

<style>
	/* TODO: delete later */
	:global(*) {
		overflow: visible;
	}

	main {
		padding: 0;
		margin: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;
	}

	.app-header {
		z-index: 10005;
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: var(--headerHeight);
		/* background: #ffbcee; */
	}

	.panel {
		width: 50%;
		height: 50%;
		/* opacity: 0.7; */
		position: absolute;
	}

	.panel-map {
		top: var(--headerHeight);
		left: 0;
		height: calc(50% - var(--headerHeight));
		/* background: rgb(184, 183, 255); */
	}

	.panel-data1 {
		top: 0px;
		right: 0;
		/* background: rgb(183, 255, 184); */
	}

	.panel-data2 {
		bottom: 0;
		right: 0;
		/* background: rgb(255, 184, 183); */
	}

	.panel-chart {
		bottom: 0;
		left: 0;
		/* background: rgb(255, 255, 183); */
	}

	main.mobile {
		.app-header {
			width: 100%;
		}

		.panel {
			display: none;
			width: 100%;
			height: calc(100% - var(--headerHeight));
			top: var(--headerHeight);
		}

		.panel.selected {
			display: block;
		}
	}

	main.map-maximized {
		.app-header {
			width: 100%;
		}

		.panel {
			display: none;
			width: 100%;
			height: 100%;
			top: 0;
		}

		.panel-map {
			display: block;
		}
	}
</style>