<script lang="ts">
	import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import { aremove } from "$src/lib/utils";
	import { varlabel, varlabelabbrev } from "$src/lib/utils/varHelpers";
	import InlineBlockIconify from "./InlineBlockIconify.svelte";

	const varnames = aremove(Object.keys(variablesMetadata), "default");
	let { varname = $bindable("ecoli"), small = false }: { varname: string; small?: boolean } = $props();

	let open = $state(false);

	const label = $derived(small ? varlabelabbrev(varname) : varlabel(varname));

	const onmouseleave = () => (open = false);
	const openDetails = (e: MouseEvent | any) => {
		if (e.sourceCapabilities?.firesTouchEvents) return;
		open = true;
	};

	// $effect(() => {
	// 	console.log("open", open);
	// });
</script>

<div class="map-control" {onmouseleave}>
	<div class="invisible-hover-target"></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<details {open} class="dropdown mainmenu">
		<summary class:small class="button outline" onmouseenter={openDetails}>
			<div class="summary-flex">
				<InlineBlockIconify icon="gridicons:line-graph" size="1.2rem" />

				{label}
				<DetailsOpenIcon {open} />
			</div>
		</summary>
		<div class="card">
			{#each varnames as vn}
				<a
					class:bg-primary={varname === vn}
					onclick={() => {
						varname = vn;
						open = false;
					}}>
					{varlabel(vn, true)}</a>
			{/each}
		</div>
	</details>
</div>

<style>
	.map-control {
		z-index: 1001;
		.card {
			max-height: 500px;
			overflow: auto;
		}

		.card a {
			padding: 0.5rem 1rem;
			display: block;
			cursor: pointer;
			color: var(--font-color);
			&:hover {
				background-color: var(--color-hover);
			}
		}
	}
</style>
