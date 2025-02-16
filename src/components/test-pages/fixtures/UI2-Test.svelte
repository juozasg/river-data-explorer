<script lang="ts">
	import AppMenu from "$src/components/ui2/AppMenu.svelte";



	const isMobile = false;

</script>

<main>
	Congrats UI2!
	<div class="app-header">
		<AppMenu />
	</div>
	<div class="panel panel-map">
		<h1>Map</h1>
	</div>
	<div class="panel panel-data1">
		<h1>Data 1</h1>
	</div>
	<div class="panel panel-data2">
		<h1>Data 2</h1>
	</div>
	<div class="panel panel-chart">
		<h1>Graph</h1>
	</div>
</main>

<style>
	:global(*) {
		overflow: visible;
	}
	main {
		padding: 0;
		margin: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;

		background: rgb(255, 218, 224);
		/* font-size: 120%; */
	}

	.app-header {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 36px;
		background: #ffbcee;
	}

	.panel {
		width: 50%;
		height: 50%;
		position: absolute;
		h1 {
			position: absolute;
			top: 50%;
			width: 100%;
			text-align: center;
		}
	}

	.panel-map {
		top: 36px;
		left: 0;
		background: rgb(184, 183, 255);
	}

	.panel-data1 {
		top: 0px;
		right: 0;
		background: rgb(183, 255, 184);
	}

	.panel-data2 {
		bottom: 0;
		right: 0;
		background: rgb(255, 184, 183);
	}

	.panel-chart {
		bottom: 0;
		left: 0;
		background: rgb(255, 255, 183);
	}
</style>