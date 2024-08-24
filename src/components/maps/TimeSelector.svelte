<script lang="ts">
	import DateYMDSelects from './DateYMDSelects.svelte';

	import { fmtDate, fmtDateValue, fmtDateYmd } from '$src/lib/utils';

	// const startDate = new Date('2015-12-30');

	const {
		startDate = new Date('2015-12-30'),
		endDate = new Date()
	}: { startDate: Date; endDate?: Date } = $props();

	let dateInputValue = $state(fmtDateValue(endDate));
	let rangeInputValue: number | string = $state(endDate.valueOf());
	export const selectedDate = $derived(new Date(parseInt(rangeInputValue as any)));

	// $effect(() => {
	// 	console.log('SLIDERS startDate', startDate);
	// 	console.log('SLIDERS endDate', endDate);
	// 	console.log('SLIDERS rangeInputValue', rangeInputValue, typeof rangeInputValue);
	// 	console.log('SLIDERS selectedDate', selectedDate);
	// });

	// on input change update slider if date is valid
	const dateInputChange = (e: Event) => {
		if (dateInputValue?.length > 0) {
			const date = new Date(dateInputValue);
			if (date >= startDate && date <= endDate) {
				rangeInputValue = date.valueOf();
			}
		}
	};

	// on input blur update date input if range is valid
	// OR copy always valid range input value to the date input
	const dateinputOnBlur = (e: Event) => {
		if (dateInputValue?.length > 0) {
			const date = new Date(dateInputValue);
			if (date >= startDate && date <= endDate) {
				rangeInputValue = date.valueOf();
				return;
			}
		}

		// dont have a valid date in the date input. copy from range input
		dateInputValue = fmtDateValue(new Date(rangeInputValue));
	};

	const rangeInputOnInput = (e: Event) => {
		const rangeDate = new Date(rangeInputValue);
		dateInputValue = fmtDateValue(rangeDate);
	};

	const firstLabel = $derived(fmtDateYmd(startDate));
	const lastLabel = $derived(fmtDateYmd(endDate));

	const onYMDChange = (date: Date) => {
		console.log('YMD date', date);
	};

	let firstLabelE = $state<HTMLElement>();
	let lastLabelE = $state<HTMLElement>();

	$effect(() => {
		const rangeFraction =
			(parseInt(rangeInputValue as any) - startDate.valueOf()) /
			(endDate.valueOf() - startDate.valueOf());
			console.log(rangeFraction);

			if(firstLabelE){
				firstLabelE.style.opacity = `${rangeFraction * 1}`;
			}
			if(lastLabelE){
				lastLabelE.style.opacity = `${(1-rangeFraction) * 1}`;
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
		oninput={rangeInputOnInput}
	/>
	<!-- <input
		class="date"
		type="date"
		bind:value={dateInputValue}
		onchange={dateInputChange}
		onblur={dateinputOnBlur}
		min={fmtDateValue(startDate)}
		max={fmtDateValue(endDate)}
	/> -->

	<DateYMDSelects {startDate} {endDate} onChange={onYMDChange} />
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

		/* span:hover {
			display: none;
		} */
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
			width: calc(100% - 200px);
			/* position: relative; */
			position: absolute;
			bottom: 2px;
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

		/* normalize date input between chrome and firefox */
		/* input[type='date'] {
			-webkit-align-items: center;
			align-items: center;
			display: -webkit-inline-flex;
			overflow: hidden;
			-webkit-padding-start: 1px;
			padding: 0;
		} */
		input::-webkit-calendar-picker-indicator {
			/* padding-left: 10px; */
			/* padding-right: 10px; */
			/* left: 10px; */
			/* position: relative; */
		}
	}
</style>
