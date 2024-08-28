<script lang="ts">
	import DateYMDSelects from './DateYMDSelects.svelte';

	import { binarySearch, fmtDateYmd, UTCDayDate } from '$src/lib/utils';

	let {
		startDate,
		endDate,
		validDates,
		vardate = $bindable(UTCDayDate())
	}: { startDate: Date; endDate: Date; validDates: Date[]; vardate?: Date } = $props();

	const validDateValues = $derived((validDates || []).map((d) => d.valueOf()));

	// $effect(() => {
	// 	console.log(
	// 		' ---> TimeSelector startDate ',
	// 		startDate.toISOString(),
	// 		'endDate',
	// 		endDate.toISOString()
	// 	);
	// 	// console.log(' ---> TimeSelector validDates ', validDates);
	// });

	let ymdSelector = $state<DateYMDSelects>();
	export const ymdSelectedDate = $derived(ymdSelector?.selectedDate);

	let rangeInputValue: number | string = $state(endDate.valueOf());
	export const selectedDate = $derived(UTCDayDate(parseInt(rangeInputValue as any)));
	$effect(() => {
		vardate = selectedDate;
	});

	// keep range input value within bounds
	$effect(() => {
		if (selectedDate < startDate) {
			rangeInputValue = startDate.valueOf();
			ymdSelector?.setSelectedDate(startDate);
		} else if (selectedDate > endDate) {
			rangeInputValue = endDate.valueOf();
			ymdSelector?.setSelectedDate(endDate);
		}
	});

	// updated YMD with range input
	$effect(() => {
		ymdSelector?.setSelectedDate(selectedDate);
	});

	// update range input with YMD
	$effect(() => {
		if (ymdSelectedDate) {
			rangeInputValue = ymdSelectedDate.valueOf();
			// snapToValidDate();
		}
	});

	const firstLabel = $derived(fmtDateYmd(startDate));
	const lastLabel = $derived(fmtDateYmd(endDate));

	let firstLabelE = $state<HTMLElement>();
	let lastLabelE = $state<HTMLElement>();

	$effect(() => {
		const rangeFraction =
			(parseInt(rangeInputValue as any) - startDate.valueOf()) /
			(endDate.valueOf() - startDate.valueOf());

		if (firstLabelE) {
			firstLabelE.style.opacity = `${rangeFraction ** 0.7 * 1}`;
		}
		if (lastLabelE) {
			lastLabelE.style.opacity = `${(1 - rangeFraction) ** 0.7 * 1}`;
		}
	});

	$effect(() => {
		if (validDateValues.length === 0) return;
	});

	const snapToValidDate = () => {
		if (validDateValues.length === 0) return;
		const closestValue = binarySearch(validDateValues, parseInt(rangeInputValue as any));
		rangeInputValue = closestValue;
	};

	const dateToFraction = (date: Date) => {
		return (date.valueOf() - startDate.valueOf()) / (endDate.valueOf() - startDate.valueOf());
	};
</script>

<div class="map-control">
	<div class="slider-labels">
		<span class="first-label" bind:this={firstLabelE}>{firstLabel}</span>
		<span class="last-label" bind:this={lastLabelE}>{lastLabel}</span>
	</div>
	<div class="slider-ticks">
		{#each validDates || [] as date}
			<div class="tick" style="left: {dateToFraction(date) * 100}%"></div>
		{/each}
	</div>
	<input
		class="time-slider-range range"
		type="range"
		bind:value={rangeInputValue}
		min={startDate.valueOf()}
		max={endDate.valueOf()}
		step={86400000}
		onchange={snapToValidDate}
	/>

	<DateYMDSelects {startDate} {endDate} {validDates} bind:this={ymdSelector} />
</div>

<style>
	.slider-ticks {
		position: absolute;
		top: 0;
		left: 6px;
		width: calc(100% - 189px);
		height: 100%;

		.tick {
			position: absolute;
			bottom: 4px;
			width: 2px;
			height: 12px;
			background-color: #ababab;
		}
	}
	.slider-labels {
		position: absolute;
		top: 0;
		left: 12px;
		width: calc(100% - 160px);
		height: 16px;

		span {
			display: block;
			position: absolute;
			font-size: 0.8rem;
			top: -5px;
			padding: 0.25rem;
			opacity: 1;
			z-index: 1000;
			pointer-events: none;
		}

		.first-label {
			left: -10px;
		}

		.last-label {
			right: 30px;
		}
	}

	.map-control {
		opacity: 0.7;

		z-index: 1000;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: calc(100% - 28px);
		height: 36px;
		margin: 1rem;

		margin-bottom: 18px;
		padding: 4px;
		padding-top: 8px;

		border-radius: 4px;
		background-color: hsl(0, 0%, 100%);
		border-color: hsl(0, 0%, 86%);
		border-width: 1px;
		color: hsl(0, 0%, 21%);

		&:hover {
			opacity: 1;
		}

		input.range {
			width: calc(100% - 187px);
			position: absolute;
			bottom: 3px;
			left: 6px;
			cursor: col-resize !important;
		}

		input {
			font-size: 1.2rem;

			border: none;
		}
	}
</style>
