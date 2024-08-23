<script lang="ts">
	const firstLabel = $state('Dec 30, 2015');
	const dateInputValue = $state('2017-06-01');
</script>

<div class="map-control">
	<div class="slider-labels">
		<span class="first-label">{firstLabel}</span>
		<span class="last-label">now</span>
	</div>
	<input class="date" type="date" value={dateInputValue} />
	<input class="range" type="range" />
</div>

<style>
	.slider-labels {
		position: absolute;
		top: 0;
		left: 160px;
		width: calc(100% - 160px);
		height: 16px;

		span {
			display: block;
			position: absolute;
			font-size: 0.9rem;
			top: 2px;
		}
		.first-label {
			left: -9px;
			@-moz-document url-prefix() {
				/* not great but input date native style */
				left: 0px;
			}
		}

		.last-label {
			right: 24px;
			@-moz-document url-prefix() {
				/* not great but input date native style */
				right: 12px;
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
			background-color: hsl(0, 0%, 96%);
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
			--c: #3D9CBE; /* active color */
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
