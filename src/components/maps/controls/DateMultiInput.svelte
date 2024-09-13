<script lang="ts">
	import DateSliderInput from "./DateSliderInput.svelte";
	import DateYMDSelects from "./DateYMDSelects.svelte";
	import { binaryClosestSearch, UTCDayDate } from "$src/lib/utils";
	import { untrack } from "svelte";

	let { validDates, vardate = $bindable(UTCDayDate()) }: { validDates: Date[]; vardate: Date } = $props();
	const validValues = $derived((validDates || []).map((d) => d.valueOf()));

	const isValidDate = (date: Date) =>
		validValues.length > 0 && binaryClosestSearch(validValues, date.valueOf()).valueOf() === date.valueOf();

	let dateSliderInput = $state<DateSliderInput>();
	let ymdSelects = $state<DateYMDSelects>();

	export function setDate(d: Date) {
		if (isValidDate(d)) dateSliderInput?.setDate(d);
	}

	// works great - do not touch!
	const onYmdDateSelect = (date: Date) => {
		// console.log('onYmdDateSelect', date.toISOString());
		if (isValidDate(date)) {
			untrack(() => {
				// console.log('set data slider input date', date.toISOString());
				dateSliderInput?.setDate(date);
			});
			vardate = date;
		}
	};

	const onRangeDateSelect = (date: Date) => {
		// console.log('onRangeDateSelect', date.toISOString());

		const closestValid = binaryClosestSearch(validValues, date.valueOf());
		if (closestValid) {
			untrack(() => {
				// console.log('set YMD date', new Date(closestValid).toISOString());
				ymdSelects?.setDate(new Date(closestValid));
			});
		}

	};
</script>

{#if validDates.length > 0}
	<div class="map-control">
		<DateSliderInput {validDates} onDateSelect={onRangeDateSelect} bind:this={dateSliderInput} />
		<DateYMDSelects {validDates} onDateSelect={onYmdDateSelect} bind:this={ymdSelects} />
	</div>
{/if}

<style>
	.map-control {
		z-index: 1000;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: calc(100% - 20px);
		height: 29px;

		padding: 0;
		margin: 10px;

		border-radius: var(--border-radius);
		background-color: hsl(0, 0%, 100%);
		border: none !important;
		color: hsl(0, 0%, 21%);
	}
</style>
