<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->

<script lang="ts">
</script>

<div class="map-control">
	<div class="pure-menu custom-restricted-width">
		<ul class="pure-menu-list">
			<form class="pure-form">
				<li class="pure-menu-item">
					<label for="checkbox-radio-option-one" class="pure-radio">
						<input type="radio" id="checkbox-radio-option-one" name="optionsRadios" value="a" />
						Topographic
					</label>
				</li>
				<li class="pure-menu-item">
					<label for="checkbox-radio-option-two" class="pure-radio">
						<input type="radio" id="checkbox-radio-option-two" name="optionsRadios" value="b" />
						Satellite
					</label>
				</li>
			</form>
			<li class="pure-menu-item">
				<label for="river" class="pure-checkbox">
					<input type="checkbox" id="river" /> Mainstem and Tributaries
				</label>
			</li>

			<li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
				<a id="menuLink1" class="pure-menu-link">Datasets</a>
				<ul class="pure-menu-children">
					<li class="pure-menu-item">
						<label for="usgs" class="pure-checkbox">
							<input type="checkbox" id="usgs" /> elkhart
						</label>
					</li>
					<li class="pure-menu-item">
						<label for="elkhart" class="pure-checkbox">
							<input type="checkbox" id="elkhart" /> usgs
						</label>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</div>

<style>
	.map-control {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1002;

		.pure-menu {
			background-color: white;
			/* border: 1px solid var(--pico-color);
			border-radius: 5px;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
			font-size: 0.8rem;
			padding: 0;
			width: 16rem; */
		}

		/* menu .radio {
			display: block;
		} */
		/* background-color: white; */

		/* font-size: 0.8rem; */

		/* summary {
			color: var(--pico-color) !important;
		}

		ul {
			margin-top: 5px !important;
		}

		details {
			margin-bottom: 0;
		}

		li.submenu {
			summary {
				border: none;
			}
			ul {
				position: absolute;
				left: 10rem;
				top: 0rem;
			}
		} */

		/* details[open] {
			margin-bottom: 1rem;
		} */
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
