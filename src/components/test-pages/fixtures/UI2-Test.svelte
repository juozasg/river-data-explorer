<script lang="ts">


	const isMobile = false;

</script>

<main>
	Congrats UI2!
	<div class="panel panel-map"></div>
	<div class="panel panel-data1"></div>
	<div class="panel panel-data2"></div>
	<div class="panel panel-chart"></div>
</main>

<style>
	main {
		padding: 0;
		margin: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;

		background: rgb(255, 218, 224);
		/* font-size: 120%; */
	}

	.panel {
		width: 50%;
		height: 50%;
		position: absolute;
	}

	.panel-map {
		top: 0;
		left: 0;
		background: rgb(184, 183, 255);
	}

	.panel-data1 {
		top: 0;
		right: 0;
		background: rgb(183, 255, 184);
	}

	.panel-data2 {
		bottom: 0;
		left: 0;
		background: rgb(255, 184, 183);
	}

	.panel-chart {
		bottom: 0;
		right: 0;
		background: rgb(255, 255, 183);
	}
</style>