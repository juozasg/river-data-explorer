<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->

<script lang="ts">
</script>

<div class="map-control pico">

	<details class="dropdown">
		<summary>Dropdown</summary>
		<ul>
			<li>
				<label>
					<input type="checkbox" name="elkhart" />
					elkhart
				</label>
			</li>
			<li>
				<label>
					<input type="checkbox" name="usgs" />
					usgs
				</label>
			</li>
			<li>
				<label>
					<input type="checkbox" checked name="sjrbc" />
					sjrbc
				</label>
			</li>
			<li><hr/></li>
			<li><span class='caption'>Basemaps</span></li>
			<li>
				<label>
					<input type="radio" name="basemap" value="TOPO" checked/>
					Topographic
				</label>
			</li>
			<li>
				<label>
					<input type="radio" name="basemap" value="SATALLITE" />
					Satellite
				</label>
			</li>
		</ul>
		Hey there
	</details>
<!--
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
	</form> -->
</div>

<style>
	.map-control {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1002;
		background-color: white;

		/* font-size: 0.8rem; */

		summary {
			color: var(--pico-color) !important;
		}

		details {
			margin-bottom: 0;
		}

		details[open] {
			margin-bottom: 1rem;
		}
		/* fieldset legend {
			font-weight: 600;
		} */
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
