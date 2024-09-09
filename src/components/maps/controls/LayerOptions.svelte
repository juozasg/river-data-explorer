<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->

<script lang="ts">
</script>

<div class="map-control pico">
	<form>
		<fieldset>
			<legend>Basemap</legend>
			<label>
				<input type="radio" name="basemap" checked />
				Topographic
			</label>
			<label>
				<input type="radio" name="basemap" />
				Satellite
			</label>

		</fieldset>
	</form>
</div>

<style>
	.map-control {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1002;
		background-color: white;

		font-size: 0.8rem;

		fieldset legend {
			font-weight: 600;
		}
	}

	/* .dropdown-menu {
		width: 16rem !important;
	}

	div.dropdown-item:hover {
		background-color: hsl(0, 0%, 96%);
		color: hsl(0, 0%, 4%);
	}

	input[type="checkbox"] {
		margin-right: 4px;
		position: relative;
		bottom: -1px;
	} */
</style>
