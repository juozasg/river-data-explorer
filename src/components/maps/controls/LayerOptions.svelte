<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->

<script lang="ts">
	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import Icon from "@iconify/svelte";

	let open = $state(false);
	let datasetsOpen = $state(false);

	let small = $state(false);

	// $effect(() => {if(!open) open = true;});

	// $effect(() => {
	// 	console.log('open', open);
	// });
</script>

<div class="map-control" onmouseleave={() => (open = datasetsOpen = false)}>
	<div class="hover-target"></div>

	<details bind:open class="dropdown mainmenu" onmouseenter={() => (open = true)}>
		<!-- <summary class="button outline">Layers<ArrowDropRight class="icon"/></summary> -->
		<summary class="button outline">
			<div class="icon-spacer"><Icon height="none" width="none" icon="solar:layers-outline" /></div>

			{small ? "" : "Layers"}
			<DetailsOpenIcon {open} /></summary>
		<div class="card">
			<!-- DATASETS SUBMENU -->
			<details
				bind:open={datasetsOpen}
				onmouseenter={() => (datasetsOpen = true)}
				onmouseleave={() => (datasetsOpen = false)}
				class="dropdown submenu">
				<summary class="outline">Datasets<DetailsOpenIcon open={datasetsOpen} /></summary>
				<div class="card">
					<label for="usgs">
						<input type="checkbox" id="usgs" />
						elkhart
					</label>
					<label for="elkhart">
						<input type="checkbox" id="elkhart" />
						usgs
					</label>
					<label for="elkhart">
						<input type="checkbox" id="elkhart" />
						usgs
					</label>
					<label for="elkhart">
						<input type="checkbox" id="elkhart" />
						usgs
					</label>
					<label for="elkhart">
						<input type="checkbox" id="elkhart" />
						usgs
					</label>
				</div>
			</details>
			<hr />
			<span class="basemaps-heading">Basemap</span>
			<label for="topo">
				<input type="radio" id="topo" name="basemap" value="TOPO" />
				Topographic
			</label>
			<label for="satellite">
				<input type="radio" id="satellite" name="basemap" value="SATELLITE" />
				Satellite
			</label>
			<hr />
			<label for="river">
				<input type="checkbox" id="river" />
				Mainstem and tributaries
			</label>
		</div>
	</details>
</div>

<style>
	.map-control {
		border-radius: 4px;
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1002;
		font-weight: 300;

		--padding: 0.75rem;

		.hover-target {
			height: 60px;
			width: 100%;
			top: 0;
			right: 0;
			position: absolute;
			/* background-color: aqua; */
			opacity: 0;
		}

		details.dropdown {
			border-radius: inherit;
			summary {
				font-weight: 500;
				padding: 0.75rem 2rem 1rem 2rem;
			}
		}

		.mainmenu > .card {
			margin-top: 4px;
		}

		.card > label {
			display: block;
			padding: var(--padding);
		}

		.card,
		details.submenu {
			margin: 0;
			padding: 0;

			.card {
				position: absolute;
				left: 12rem;
				top: -2rem;
			}
		}

		details.submenu {
			width: 100%;
			summary {
				font-weight: 500;
				padding: var(--padding);
				padding-left: 2rem;
			}
		}

		.basemaps-heading {
			padding-left: 2rem;
			margin-top: 0.5rem;
			font-weight: 500;
			display: inline-block;
		}

		hr {
			margin: 0;
			padding: 0;
		}

		label:hover,
		details.submenu:hover {
			background-color: rgb(0 0 0/5%);
		}

		:global(.details-open-icon, .details-closed-icon) {
			position: relative;
			top: 3px;
			left: 2px;
		}

		.icon-spacer {
			width: 1rem;
			height: 1px;
			position: relative;
			display: inline-block;
			:global(.iconify) {
				position: absolute;
				/* top: 4px; */
				/* left: -2px; */
				top: -15px;
				left: -12px;
				width: 2rem;
				height: 2rem;
				margin-right: 0.5rem;
			}
		}

		details.submenu {
			summary {
				cursor: pointer;
				list-style: none;
			}
		}

		.dropdown {
			background-color: white;
		}
	}
</style>
