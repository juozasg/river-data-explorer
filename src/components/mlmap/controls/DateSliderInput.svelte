<script lang="ts">
	import "$src/styles/time-slider.scss";

	import { binaryClosestSearch } from "$src/lib/utils/arrays";
	import { fmtDateDMonY, nowRoundedToNearest15Minutes, oldestDate } from "$src/lib/utils/date";

	let { validDates, onDateSelect }: { validDates: Date[]; onDateSelect: (d: Date) => void } = $props();

	export function setDate(date: Date) {
		value = date.valueOf();
	}

	// const validValues = $derived((validDates || []).map((d) => d.valueOf()));

	const startDate = oldestDate;
	const endDate = nowRoundedToNearest15Minutes();

	let value: number = $state(endDate.valueOf());

	// const firstLabel = $derived(fmtDateDMonY(startDate));
	// const lastLabel = $derived(fmtDateDMonY(endDate));

	let firstLabelE = $state<HTMLElement>();
	let lastLabelE = $state<HTMLElement>();

	// $effect(() => {
	// 	const rangeFraction = (parseInt(value as any) - startDate.valueOf()) / (endDate.valueOf() - startDate.valueOf());

	// 	if (firstLabelE) {
	// 		firstLabelE.style.opacity = `${rangeFraction ** 0.7 * 1}`;
	// 	}
	// 	if (lastLabelE) {
	// 		lastLabelE.style.opacity = `${(1 - rangeFraction) ** 0.7 * 1}`;
	// 	}
	// });

	const onchange = (e: Event) => {
		// console.log('slider onchange', value);
		onDateSelect(new Date(value));
	};


	const dateToFraction = (date: Date) => {
		return (date.valueOf() - startDate.valueOf()) / (endDate.valueOf() - startDate.valueOf());
	};
</script>

<div class="date-slider-input">
	<!-- <div class="slider-labels">
		<span class="first-label" bind:this={firstLabelE}>{firstLabel}</span>
		<span class="last-label" bind:this={lastLabelE}>{lastLabel}</span>
	</div> -->
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
		{onchange}
		onmousemove={onchange}
	/>
</div>

<style>
	.date-slider-input {
		width: 100%;
		height: 20px;
		position: relative;
		left: 0px;

		input.range {
			width: 100% !important;
			border: 4px solid greenyellow;
			padding: 0 !important;
			margin: 0 !important;
			-webkit-box-shadow: none !important;
			box-shadow: none !important;

			position: relative;
			cursor: col-resize !important;
			outline: none !important;

			&:focus {
				outline: none !important;
			}
		}

		.slider-ticks {
			position: absolute;
			top: 0;
			left: 0px;
			width: calc(100% - 2px);
			height: 100%;

			.tick {
				position: absolute;
				bottom: -7px;
				width: 0.5px;
				height: 25px;
				background-color: #063b3a;
			}
		}
		/* .slider-labels {
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
		} */

		&:hover {
			opacity: 1;
		}
	}
</style>
