<script lang="ts">
	import { getRandomColor } from "$src/lib/utils";

	let markerIds: number[] = [];
	for (let i = 0; i < 10000; i++) {
		markerIds.push(i);
	}

	function randomizeMarkers() {
		// markerIds = markerIds.map((id) => Math.floor(Math.random() * 1000));
		const markers = document.querySelectorAll('.marker') as NodeListOf<HTMLElement>;
		console.log(markers.length);

		markers.forEach((m: HTMLElement) => {
			const id = Math.floor(Math.random() * 1000);

			m.style.setProperty('background-color', getRandomColor());
			m.style.left = id % 590 + 'px';
			m.style.top = id ** 2.021 % 590 + 'px';
		});
	}
</script>

<div id="panel">
	{#each markerIds as id (id)}
		{@const left = id % 590}
		{@const right = id ** 2.021 % 590}
		<div style="left: {left}px; top: {right}px;" class="marker" id={'marker' + id}></div>
	{/each}
</div>

<input type="range" oninput={randomizeMarkers} />

<style>
	#panel {
		display: block;
		border: 2px solid plum;
		width: 600px;
		height: 600px;
	}

	.marker {
		width: 10px;
		height: 10px;
		background-color: red;
		margin: 2px;
		position: absolute;
	}
</style>

