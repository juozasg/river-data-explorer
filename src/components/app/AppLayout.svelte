<script lang="ts">
	import Cookies from "js-cookie";
	import { basinObject1, basinObject2 } from "$src/appstate/selection/objectDataSelections.svelte";
	import { mapMaximized, selectedPanel, setMapMaximized, setSelectedPanel } from "$src/appstate/ui/layout.svelte";
	import { onMount } from "svelte";

	import AppMenu from "./AppMenu.svelte";
	import AppPanelTabs from "./AppPanelTabs.svelte";
	import PanelChart from "./PanelChart.svelte";
	import PanelData1 from "./PanelData1.svelte";
	import PanelData2 from "./PanelData2.svelte";
	import PanelMap from "./PanelMap.svelte";
	import { defineGlobal } from "$src/lib/utils";
	import { startTour } from "$src/lib/app/onboardingTour";

	let clientWidth = $state(0);
	let clientHeight = $state(0);
	const mobile = $derived(clientWidth <= 720 || clientHeight < 720);

	let mapWidth = $state(0);
	let mapHeight = $state(0);

	let tourMapMaximized = $state(false);

	// introjs-dontShowAgain

	onMount(() => {
		const hideIntroCookie = Cookies.get("introjs-dontShowAgain") === "true";
		const showIntro = !hideIntroCookie && !mobile && mapWidth > 430;
		console.log(' --- showIntro:', showIntro, hideIntroCookie, mobile, mapWidth);

		if(showIntro) startTour((maximized: boolean) => {
			tourMapMaximized = maximized;
		});
	});

	onMount(() => {
		if(mobile) {
			window.scrollTo(0, 1);
		}
	});

	function tourButtonClicked() {
		Cookies.set("introjs-dontShowAgain", "false")
		startTour((maximized: boolean) => {
			tourMapMaximized = maximized;
		});
	}

	$effect(() => {
		if((basinObject1.isSet || basinObject2.isSet) && !tourMapMaximized ) {
			setMapMaximized(false);
		} else {
			setMapMaximized(true);
		}
	});
</script>



<main bind:clientWidth bind:clientHeight class:mobile class:map-maximized={mapMaximized()}>
	<div class="app-header" data-intro='Welcome to the River Data Explorer'>
		<AppMenu {mobile} {tourButtonClicked}/>
		{#if mobile}
			<AppPanelTabs bind:selectedPanel={selectedPanel, setSelectedPanel} />
		{/if}
	</div>

	<div class="panel panel-map" class:selected={selectedPanel() === 'map'}
		bind:clientWidth={mapWidth} bind:clientHeight={mapHeight}>
		<div class="map-container" style="--map-width: {mapWidth}px; --map-height: {mapHeight}px;" >
			<PanelMap />
		</div>
	</div>

	<div class="panel panel-data1" class:selected={selectedPanel() === 'data1'}>
		<PanelData1 />
	</div>

	<div class="panel panel-data2" class:selected={selectedPanel() === 'data2'}>
		<PanelData2	/>
	</div>

	<div class="panel panel-chart" class:selected={selectedPanel() === 'chart'}>
		<PanelChart />
	</div>
</main>

<style>
	main {
		padding: 0;
		margin: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
	}

	.app-header {
		z-index: 10005;
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: var(--headerHeight);
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
		width: 50vw;
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

	main.map-maximized:not(.mobile) {
		.app-header {
			width: 100%;
		}

		.panel {
			display: none;
		}

		.panel-map {
			display: block;
			height: calc(100% - var(--headerHeight));
			top: var(--headerHeight);
			width: 100vw;
		}
	}

	.map-container {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
</style>