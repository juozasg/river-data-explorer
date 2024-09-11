<script lang="ts">
	import "$src/styles/map-controls.scss";

	import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import { aremove } from "$src/lib/utils";
	import { varlabel } from "$src/lib/utils/varHelpers";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

	const varnames = aremove(Object.keys(variablesMetadata), "default");
	let { varname = $bindable("temp"), small = false }: { varname: string; small?: boolean } = $props();

	let open = $state(false);

	// onMount(() => {
	// 	document.body.addEventListener('click', (e) => {
	// 		showVarsDropdown = false;
	// 	});
	// });

	// const dropdownToggle = (e: Event) => {
	// 	e.stopPropagation();
	// 	showVarsDropdown = !showVarsDropdown;
	// };

	// const onclick = (e: Event) => {
	// 	console.log(e);
	// 	e.stopPropagation();
	// };
</script>

<div class="map-control" onmouseleave={() => (open = false)}>
	<div class="invisible-hover-target"></div>

	<details bind:open class="dropdown mainmenu" onmouseenter={() => (open = true)}>
		<summary class:small class="button outline">
			<div class="icon-spacer"><Icon height="none" width="none" icon="solar:layers-outline" /></div>

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
	}
</style>
