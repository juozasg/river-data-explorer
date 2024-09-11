<script lang="ts">

	import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import { aremove } from "$src/lib/utils";
	import { varlabel } from "$src/lib/utils/varHelpers";
	import Icon from "@iconify/svelte";

	const varnames = aremove(Object.keys(variablesMetadata), "default");
	let { varname = $bindable("temp"), small = false }: { varname: string; small?: boolean } = $props();

	let open = $state(false);


	// const onclick = (e: Event) => {
	// 	console.log(e);
	// 	e.stopPropagation();
	// };
</script>

<div class="map-control" onmouseleave={() => (open = false)}>
	<div class="invisible-hover-target"></div>

	<details bind:open class="dropdown mainmenu" onmouseenter={() => (open = true)}>
		<summary class:small class="button outline">
			<!-- <div class="icon-spacer"><Icon height="none" width="none" icon="gridicons:line-graph" /></div> -->

			{small ? "" : "Temperature"}
			<DetailsOpenIcon {open} /></summary>
		<div class="card">
			<!-- <ul> -->
			<a> Ecoli </a>
			<a> ph </a>
			<a> Dissolved Oxygen </a>
			<!-- </ul> -->
		</div>
	</details>
</div>

<style>
	.map-control {
		z-index: 1001;

		.card a {
			padding: 0.5rem 1rem;
			display: block;
			cursor: pointer;
			color: var(--font-color);
			&:hover {
				background-color: rgb(0 0 0/5%);
			}
		}
	}
</style>
