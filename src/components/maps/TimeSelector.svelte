<script lang="ts">
	import { fmtDate, fmtDateValue } from '$src/lib/utils';


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

	const firstLabel = $derived(fmtDate(startDate));
	const lastLabel = $derived(fmtDate(endDate));
</script>

<div class="map-control">
	<div class="slider-labels">
		<span class="first-label">{firstLabel}</span>
		<span class="last-label">{lastLabel}</span>
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
	<input
		class="date"
		type="date"
		bind:value={dateInputValue}
		onchange={dateInputChange}
		onblur={dateinputOnBlur}
		min={fmtDateValue(startDate)}
		max={fmtDateValue(endDate)}
	/>
</div>

<style>
	.slider-labels {
		position: absolute;
		top: 0;
		left: 12px;
		width: calc(100% - 160px);
		height: 16px;

		span {
			display: block;
			position: absolute;
			font-size: 0.9rem;
			top: 2px;
		}
		.first-label {
			left: 4px;
			@-moz-document url-prefix() {
				/* not great but input date native style */
				/* left: 0px; */
			}
		}

		.last-label {
			right: 22px;
			@-moz-document url-prefix() {
				/* not great but input date native style */
				right: 22px;
			}
		}
	}

	.map-control {
		opacity: 0.7;

		z-index: 1000;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: calc(100% - 2rem);
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

		input.date:hover {
			background-color: #18a0d1;
			color: hsl(0, 0%, 4%);
		}

		/* border: 1px dotted red; */

		input.date {
			width: 130px;
			@-moz-document url-prefix() {
				width: 140px;
			}

			padding: 0px;

			/* border-right: 1px solid hsl(0, 0%, 86%); */
			position: relative;
			top: 0px;
			margin-left: 6px;
			/* padding-right: 0px; */
			/* margin-right: */
			/* padding: 0; */
			/* margin: 0; */
		}

		input.range {
			width: calc(100% - 166px);
			position: relative;
			bottom: -6px;
			left: 6px;
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
			--h: 20px; /* thumb height */
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
		input[type='date'] {
			-webkit-align-items: center;
			align-items: center;
			display: -webkit-inline-flex;
			/* font-family: monospace; */
			overflow: hidden;
			-webkit-padding-start: 1px;
			padding: 0;
		}
		input::-webkit-calendar-picker-indicator {
			/* padding-left: 10px; */
			/* padding-right: 10px; */
			/* left: 10px; */
			/* position: relative; */
		}
	}
</style>
