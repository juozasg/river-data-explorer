<script lang="ts">
	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import AutoComplete from "simple-svelte-autocomplete";
	import { sites } from "$src/appstate/sites.svelte";
	import type { Site } from "$src/lib/types/site";

	let {
		maxWidth = "100%",
		selectedSite,
		searchItemSelect
	}: { maxWidth?: string; selectedSite?: Site; searchItemSelect?: (item: Site) => void } = $props();

	let containerDiv = $state<HTMLDivElement>();
	const inputElement = $derived(
		containerDiv && (containerDiv.querySelector("input.autocomplete-input") as HTMLInputElement)
	);

	const onmouseleave = (e: MouseEvent) => {
		let esc = new KeyboardEvent("keydown", {
			key: "Escape"
		});
		inputElement?.dispatchEvent(esc);
	};

	const onmouseenter = (e: MouseEvent) => {
		// console.log("Mouse enter", e);
		inputElement?.click();
	};

	$effect(() => {
		console.log("autocomplete selected item", selectedSite);
		if (searchItemSelect && selectedSite) {
			searchItemSelect(selectedSite);
		}
	});

	const itemSortFunction = (a: Site, b: Site) => {
		const dsComp = a.dataset.localeCompare(b.dataset);
		if (dsComp !== 0) return dsComp;
		return a.num - b.num;
	};
</script>

<div
	class="sites-regions-autocomplete"
	{onmouseleave}
	{onmouseenter}
	bind:this={containerDiv}
	style="--maxWidth: {maxWidth}">
	<AutoComplete
		items={sites.allEnabled.sort(itemSortFunction)}
		labelFieldName="id"
		valueFieldName="id"
		keywordsFunction={(s: Site) => s.name + " " + s.dataset + " " + s.num + " " + s.id + " site"}
		bind:selectedItem={selectedSite}
		placeholder="Search sites..."
		hideArrow={true}>
		<div slot="item" let:item={s}>
			<p><strong>Site</strong> <i class="siteid">{s.id}</i></p>
			<p>{s.name}</p>
			<!-- <span style="color:{item.code}">{item.code}</span> -->
		</div>
	</AutoComplete>
</div>

<style>
	.sites-regions-autocomplete {
		padding: 0;
		margin: 0;

		:global(input.autocomplete-input) {
			padding: 0.5rem !important;
			margin: 0 !important;
			font-size: 1rem !important;
			border: none !important;

		}

		:global(.autocomplete-list) {
			position: absolute;
			width: auto;
			max-width: calc(var(--maxWidth, 100%) - 60px);
			top: 2rem !important;
			border: none !important;
			border-top: 1px solid #ccc !important;

			padding: 0;

			font-size: 1rem;

			:global(.autocomplete-list-item) {
				padding: 0.6rem 0.7rem;
				margin: 0;
				/* margin-left: 0./5rem; */
				/* margin-right: 0.5rem; */

				:global(p) {
					margin: 0;
					padding: 0;

					:global(strong) {
						font-size: 14px;
					}

					:global(.siteid) {
						font-size: 0.8em;
						color: #666;
					}
				}
			}

			:global(.autocomplete-list-item.selected) {
				background-color: #f0f0f0;
				color: black;
			}
		}

		:global(.autocomplete.select) {
			width: 100%;
			max-width: 24rem;
			position: relative;

			:global(::-webkit-scrollbar) {
				-webkit-appearance: none;
			}

			:global(::-webkit-scrollbar:vertical) {
				width: 10px;
			}

			:global(::-webkit-scrollbar-thumb) {
				border-radius: 8px;
				border: 2px solid white; /* should match background, can't be transparent */
				background-color: rgba(0, 0, 0, 0.5);
			}
		}
	}
</style>
