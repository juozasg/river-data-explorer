<script lang="ts">
	import "$src/styles/time-slider.scss";

		import { binaryClosestSearch } from '$src/lib/utils/arrays';
	import { fmtDateDMonY, UTCDayDate } from '$src/lib/utils/dates';

	let { validDates, onDateSelect }: { validDates: Date[]; onDateSelect: (d: Date) => void } = $props();


	export function setDate(date: Date) {
		// vardate = closestTo(date, validDates) || UTCDayDate();
		value = date.valueOf();
		snapToValidDate();
	}

	const validValues = $derived((validDates || []).map((d) => d.valueOf()));

	const startDate = $derived(validDates[0] || UTCDayDate("1990-01-01"));
	const endDate = $derived(validDates[validDates.length - 1] || UTCDayDate());

	let value: number = $state(UTCDayDate().valueOf());


	const firstLabel = $derived(fmtDateDMonY(startDate));
	const lastLabel = $derived(fmtDateDMonY(endDate));

	let firstLabelE = $state<HTMLElement>();
	let lastLabelE = $state<HTMLElement>();

	$effect(() => {
		const rangeFraction = (parseInt(value as any) - startDate.valueOf()) / (endDate.valueOf() - startDate.valueOf());

		if (firstLabelE) {
			firstLabelE.style.opacity = `${rangeFraction ** 0.7 * 1}`;
		}
		if (lastLabelE) {
			lastLabelE.style.opacity = `${(1 - rangeFraction) ** 0.7 * 1}`;
		}
	});

	const snapToValidDate = () => {
		if (validValues.length === 0) return;
		const closestValue = binaryClosestSearch(validValues, value);

		value = closestValue;
	};

	$effect(() => {
		onDateSelect(new Date(value));
	});

	$effect(() => {
		// console.log('SLIDER startDate', startDate.toISOString(), 'endDate', endDate.toISOString(), '. SLIDER value', value, 'value Date = ', new Date(value).toISOString());
	});

	const dateToFraction = (date: Date) => {
		return (date.valueOf() - startDate.valueOf()) / (endDate.valueOf() - startDate.valueOf());
	};
</script>

<div class="date-slider-input">
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
		class="date-slider-range range"
		type="range"
		bind:value
		min={startDate.valueOf()}
		max={endDate.valueOf()}
		step={86400000}
		onchange={snapToValidDate} />
</div>

<style>
	.date-slider-input {
		width: calc(100% - 185px);
		height: 29px;
		/* border: 1px solid plum; */
		position: relative;
		left: 5px;

		input.range {
			width: 100%;
			padding: 0 !important;
			margin: 0 !important;
			-webkit-box-shadow: none !important;
			box-shadow: none !important;

			position: relative;
			/* bottom: 9px; */
			cursor: col-resize !important;
			border: none !important;
			/* font-size: 1.2rem; */
		}

		.slider-ticks {
			position: absolute;
			/* border: 1px dotted darkolivegreen; */
			top: 0;
			left: 0px;
			width: calc(100% - 2px);
			height: 100%;

			.tick {
				position: absolute;
				bottom: 1px;
				width: 0.5px;
				height: 27px;
				background-color: #d6d6d6;
			}
		}
		.slider-labels {
			/* display: none; */
			position: absolute;
			top: 2px;
			left: 0px;
			width: 100%;
			height: 16px;

			span {
				display: block;
				position: absolute;

				background-color: white;
				font-size: 0.7rem;
				padding-bottom: 1px;
				top: -1px;
				/* padding: 0.25rem; */
				opacity: 1;
				z-index: 1000;
				pointer-events: none;
			}

			.first-label {
				left: 0px;
				padding-right: 3px;
			}

			.last-label {
				padding-left: 3px;
				right: 0px;
			}
		}

		&:hover {
			opacity: 1;
		}
	}
</style>
