<script lang="ts">
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import type { Site } from "$src/lib/types/site";

	type Props = {
		site: Site;
		dataSelection: DataSelectionState;
	}

	const { dataSelection, site }: Props = $props();
</script>

	<h3 class="site-label">
		<div class="selection-hints">
			{#if dataSelection.ySite && dataSelection.ySite.id == site.id}
				<div class="y-selection"></div>
			{/if}
			{#if dataSelection.zSite && dataSelection.zSite.id == site.id}
				<div class="z-selection"></div>
			{/if}
		</div>

		<span class="pill">site</span>
		<span class="label">
			<span style="font-weight: 400">{site.name}</span>
			<span class="subtitle">{site.id}</span>
		</span>
	</h3>

<style>
	h3 {
		margin-bottom: 6px;
		margin-top: 0.5rem;
		text-align: right;

		.subtitle {
			font-size: 0.9rem;
			font-weight: 300;
			color: #444;
		}
	}

</style>

