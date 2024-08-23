<script lang="ts">
	let selectedVariable = $state('temp');

	export const selectedVarname = $derived(selectedVariable);
</script>

<!-- <div class="map-control">
	<select>
		<option value="topo">Topographic</option>
		<option value="satellite">Satellite</option>
	</select>
</div> -->

<div class="map-control dropdown" class:is-active={true}>
	<div class="dropdown-trigger">
		<button
			class="button"
			aria-haspopup="true"
			aria-controls="dropdown-menu3"
			onclick={() => {}}
		>
			<span class="dropdown-label">Temperature</span>
			<span class="dropdown-arrow"></span>
		</button>
	</div>
	<div class="dropdown-menu" id="dropdown-menu3" role="menu">
		<div class="dropdown-content">
			<a class="dropdown-item">pH</a>
			<a class="dropdown-item">Disolved Oxygen</a>
			<a class="dropdown-item">ECOLI</a>
		</div>
	</div>
</div>

<style>
	.map-control {
		position: absolute;
		top: 10px;
		left: 130px;
		z-index: 1000;


		.dropdown-menu {
			display: none;
		}
		/* select {
			font-size: 1.2rem;
			padding: 0.25rem;
			border: 1px solid #ccc;

		} */
	}
</style>
