<script lang="ts">
	import { page } from "$app/stores";
	// import Dropdown from './Dropdown.svelte';
	// import NavbarItem from './Item.svelte';

	import DropdownItem from "./DropdownItem.svelte";

	const counties = [
		"Berrien",
		"Branch",
		"Steuben"
	];

	const huc10s = [
		"Coldwater River",
		"Headwaters Saint Joseph River",
		"Dowagiac River",
	];
	// 0405000101,Coldwater River,765.09,"18,26"
	// 0405000102,Headwaters Saint Joseph River,573.87,26
	// 0405000123,Dowagiac River,733.81,26

	const isRoute = (routeId: string) => $page.route?.id === routeId

</script>



{#snippet dropdownBox(sublabels)}
	<div class="navbar-dropdown is-boxed">
			{#each sublabels as label}
				{@render item(label, false)}
			{/each}
	</div>
{/snippet}


{#snippet item(label, isSelected)}
	<a href="/basin" class="navbar-item" class:navbar-item-selected={isSelected}>
		{label}
	</a>
{/snippet}

{#snippet link(label, isSelected)}
	<a class="navbar-link" class:navbar-item-selected={isSelected}>
		{label}
	</a>
{/snippet}






<DropdownItem isSelected={false}>
	{@render link("Basin", isRoute('/basin'))}
	<div class="navbar-dropdown is-boxed">
		{@render item("Search...", isRoute('/basin'))}
		<hr class="navbar-divider">
		{@render item("Indiana", false)}
		{@render item("Michigan", false)}
		<DropdownItem isSelected={isRoute('/basin/counties')}>
			{@render link("Counties", false)}
			{@render dropdownBox(counties)}
		</DropdownItem>

		<DropdownItem isSelected={isRoute('/basin/huc10')}>
			{@render link("Rivers", false)}
			{@render dropdownBox(huc10s)}
		</DropdownItem>

		{@render item("HUC12", false)}

	</div>
</DropdownItem>

