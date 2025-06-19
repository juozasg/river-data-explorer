<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<script lang="ts">
	import "$src/styles/map-controls.scss";

	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import InlineBlockIconify from "$src/components/icons/InlineBlockIconify.svelte";
	import { clickOutside } from "$src/lib/svelte/clickOutside";
	import type { Snippet } from "svelte";

	type Props = {
		small?: boolean;
		icon?: string;
		label?: string;
		children: Snippet;
		klass?: string;
	};

	let {
		small = false,
		icon = "solar:layers-outline",
		label = "Data",
		klass = "",
		children
	}: Props = $props();

	let open = $state(false);

	const onmouseleave = () => (open = false);
	const openDetails = (e: MouseEvent | any) => {
		if (e.sourceCapabilities?.firesTouchEvents) return;
		open = true;
	};

</script>

<div class={["map-control", klass]} {onmouseleave} aria-label="Data Controls" use:clickOutside={() => (open = false)} >
	<div class="invisible-hover-target"></div>

	<details bind:open class="dropdown mainmenu">
		<summary class:small class="button outline" onmouseenter={openDetails}>
			<div class="summary-flex">
				<InlineBlockIconify {icon} size="1.2rem" />

				{small ? "" : label}
				<DetailsOpenIcon {open} />
			</div>
		</summary>
		<div class="card">
			{@render children()}
		</div>
	</details>
</div>

<style>
	.map-control {
		z-index: 1003;
		font-size: 22px;

		:global(.inline-block-iconify) {
			position: relative;
			top: 1px;
			left: 2px;
			margin-right: 2px;
		}

		:global(label) {
			cursor: pointer;
			white-space: wrap;
		}

		:global(.section-heading) {
			white-space: wrap;
		}
	}

	.card {
		width: calc(var(--map-width) - 30px);
		max-width: 500px;
		padding-bottom: 6px !important;

	}
</style>
