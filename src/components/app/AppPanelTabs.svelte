<script lang="ts">
	let { selectedPanel = $bindable("map") }: { selectedPanel: string } = $props();
</script>


<div class="app-panel-tabs">
	<ul>
		<li class:selected={selectedPanel === "map"}>
			<button onclick={() => selectedPanel = 'map'}>MAP</button>
		</li>

		<li class:selected={selectedPanel === "data1"}>
				<button onclick={() => selectedPanel = 'data1'}>DATA 1</button>
		</li>

		<li class:selected={selectedPanel === "data2"}>
			<button onclick={() => selectedPanel = 'data2'}>DATA 2</button>
		</li>

		<li class:selected={selectedPanel === "chart"}>
			<button onclick={() => selectedPanel = 'chart'}>GRAPH</button>
		</li>
	</ul>
</div>

<style>
	.app-panel-tabs {
		position: absolute;
		top: 0;
		display: inline-block;
		height: 100%;
		/* border: 2px greenyellow dashed; */
	}

	ul {
		display: flex;
		/* display: inline-block; */
		list-style: none;
		height: 100%;
		margin: 0;
		padding: 0;
		/* border: 1px red solid; */
	}

	li {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 70px;
		height: 100%;

		margin: 0;
		padding: 0;
		background: rgb(255, 255, 255);
		/* border: 1px solid black; */
		text-align: center;

		button {
			color: var(--stjoe-blue);
			height: 100%;
			width: 100%;
			border: none;
			box-shadow: none;
			font-weight: 600;
			border-radius: 0;
		}
/*
		&:hover {
			background: var(--color-lightGrey);
			button {
				color: var(--stjoe-blue);
			}
		} */
	}

	li.selected {
		background:var(--stjoe-blue);
		button {
			color: white;
			/* font-weight: 500 !important; */
		}
	}
</style>
