<script lang="ts">
	import DateYMDSelects from './DateYMDSelects.svelte';

	import { fmtDate, fmtDateISO, fmtDateYmd } from '$src/lib/utils';

	const { startDate, endDate }: { startDate: Date; endDate: Date } = $props();

	$effect(() => {
		console.log(' ---> TimeSelector startDate ', startDate.toISOString(), 'endDate', endDate.toISOString());
	});


	let ymdSelector = $state<DateYMDSelects>();
	export const ymdSelectedDate = $derived(ymdSelector?.selectedDate);

	let rangeInputValue: number | string = $state(endDate.valueOf());
	export const rangeInputDate = $derived(new Date(parseInt(rangeInputValue as any)));
	$effect(() => {
		if(rangeInputDate < startDate) {
			rangeInputValue = startDate.valueOf();
			ymdSelector?.setSelectedDate(startDate);
		} else if(rangeInputDate > endDate) {
			rangeInputValue = endDate.valueOf();
			ymdSelector?.setSelectedDate(endDate);

		}
		// console.log('rangeInputDate', rangeInputDate.toISOString());
	});

	$effect(() => {
		ymdSelector?.setSelectedDate(rangeInputDate);
	});


	$effect(() => {
		// console.log('range input change', rangeInputValue, 'max', endDate.valueOf(), '!! min', startDate.valueOf());
		console.log('RANGE INPUT DATE', fmtDateISO(new Date(parseInt(rangeInputValue))), ' ----- max', fmtDateISO(endDate), '!! min', fmtDateISO(startDate));
	});


	// const rangeInputOnInput = (e: Event) => {
	// 	const rangeDate = new Date(rangeInputValue);
	// 	ymdSelector?.setSelectedDate(endDate);
	// };

	const firstLabel = $derived(fmtDateYmd(startDate));
	const lastLabel = $derived(fmtDateYmd(endDate));



	// $effect(() => {
	// 	console.log('rangeInputDate', rangeInputDate.toISOString());
	// 	console.log('ymdSelectedDate', ymdSelectedDate?.toISOString());
	// });

	$effect(() => {
		if (ymdSelectedDate) {
			if(ymdSelectedDate < startDate) {
				console.log('LOWER BOUND ymdSelectedDate < startDate');
				// ymdSelector!.setYMD(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
			} else if(ymdSelectedDate > endDate) {
				console.log('UPPER BOUND ymdSelectedDate > endDate');
				// ymdSelector!.setYMD(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
			}
		}

	});

	// const onYMDChange = (date: Date) => {
	// 	console.log('onYMDChange', date.toISOString());
	// 	if (date >= startDate && date <= endDate) {
	// 		rangeInputValue = date.valueOf();
	// 	}
	// };

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
</script>

<div class="map-control">
	<div class="slider-labels">
		<span class="first-label" bind:this={firstLabelE}>{firstLabel}</span>
		<span class="last-label" bind:this={lastLabelE}>{lastLabel}</span>
	</div>
	<input
		class="range"
		type="range"
		bind:value={rangeInputValue}
		min={startDate.valueOf()}
		max={endDate.valueOf()}
		step={86400000}
	/>

	<DateYMDSelects {startDate} {endDate} bind:this={ymdSelector} />
</div>

<style>
	.slider-labels {
		position: absolute;
		bottom: 0;
		left: 12px;
		width: calc(100% - 160px);
		height: 16px;

		span {
			display: block;
			position: absolute;
			font-size: 0.8rem;
			bottom: 5px;
			/* font-weight: 600; */
			padding: 0.25rem;
			background-color: hsla(0, 0%, 100%, 0.8);
			opacity: 1;
			border-radius: 4px;
			z-index: 1000;
			pointer-events: none;
		}
		.first-label {
			left: -6px;
		}

		.last-label {
			right: 46px;
		}
	}

	.map-control {
		opacity: 0.7;

		z-index: 1000;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: calc(100% - 2rem);
		height: 36px;
		margin: 1rem;

		margin-bottom: 18px;
		padding: 4px;
		padding-top: 8px;

		border-radius: 4px;
		background-color: hsl(0, 0%, 100%);
		/* background-color: greenyellow; */
		border-color: hsl(0, 0%, 86%);
		border-width: 1px;
		color: hsl(0, 0%, 21%);

		&:hover {
			opacity: 1;
		}

		input.range {
			width: calc(100% - 187px);
			/* position: relative; */
			position: absolute;
			bottom: 3px;
			left: 6px;
			cursor: col-resize !important;
		}

		input {
			font-size: 1.2rem;
			/* padding: 0.25rem; */
			/* border: 1px solid #ccc; */
			border: none;
		}

		/* fancy slider */
		input.range {
			--c: #18a0d1; /* active color */
			--l: 4px; /* line thickness*/
			--h: 30px; /* thumb height */
			--w: 5px; /* thumb width */

			/* width: 400px; */
			height: var(--h); /* needed for Firefox*/
			--_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			background: none;
			cursor: pointer;
			overflow: hidden;
		}
		input.range:focus-visible,
		input.range:hover {
			--p: 0%;
		}

		/* chromium */
		input[type='range' i]::-webkit-slider-thumb {
			z-index: 10001;

			height: var(--h);
			width: var(--w);
			background: var(--_c);
			border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2)
				100vw/0 100vw;
			-webkit-appearance: none;
			appearance: none;
			transition: 0.3s;
		}
		/* Firefox */
		input[type='range']::-moz-range-thumb {
			z-index: 10001;
			height: var(--h);
			width: var(--w);
			background: var(--_c);
			border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2)
				100vw/0 100vw;
			-webkit-appearance: none;
			appearance: none;
			transition: 0.3s;
		}
		@supports not (color: color-mix(in srgb, red, red)) {
			input {
				--_c: var(--c);
			}
		}
	}
</style>
