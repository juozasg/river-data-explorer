<!--
  @component
  Adds a brush component to create a range between 0 and 1. Bind to the `min` and `max` props to use them in other components. See the [brushable example](https://layercake.graphcics/example/Brush) for use.
 -->
<script>
	import { getContext } from "svelte";

	const { data, xGet } = getContext("LayerCake");

	import { clamp } from "$src/lib/utils";
	import { closestPointIndex } from "$src/lib/utils/chart";

	/** @type {Number|null} min - The brush's min value. Useful to bind to. */
	export let min;

	/** @type {Number|null} max - The brush's max value. Useful to bind to. */
	export let max;

	/** @type {Number|null} min - The brush's min value snapped to data index . Useful to bind to. */
	export let snappedMinIndex = null;

	/** @type {Number|null} max - The brush's max value snapped to data index. Useful to bind to. */
	export let snappedMaxIndex = null;

	$: snapPoints = $data.map((d) => $xGet(d));
	$: {
		if (brush) {
			const { left, right } = brush.getBoundingClientRect();
			const width = right - left;
			if (min !== null) {
				const minX = min * width;
				// const minSnapPoint = snapPoints.reduce((prev, curr) =>
				// 	Math.abs(curr - minX) < Math.abs(prev - minX) ? curr : prev
				// );

				// snappedMinIndex = snapPoints.indexOf(minSnapPoint);
				snappedMinIndex = closestPointIndex(snapPoints, minX);
			} else {
				snappedMinIndex = 0;
			}
			if (max !== null) {
				const maxX = max * width;
				// const maxSnapPoint = snapPoints.reduce((prev, curr) =>
				// 	Math.abs(curr - maxX) < Math.abs(prev - maxX) ? curr : prev
				// );

				snappedMaxIndex = closestPointIndex(snapPoints, maxX, false);
			} else {
				snappedMaxIndex = snapPoints.length - 1;
			}

			if (snappedMinIndex > snappedMaxIndex) {
				const temp = snappedMinIndex;
				snappedMinIndex = snappedMaxIndex;
				snappedMaxIndex = temp;
			}

			if (snappedMinIndex === snappedMaxIndex) {
				if (snappedMinIndex > 0) {
					snappedMinIndex--;
				} else {
					snappedMaxIndex++;
				}
			}
		}
	}

	let brush;

	const p = (x) => {
		const { left, right } = brush.getBoundingClientRect();
		return clamp((x - left) / (right - left), 0, 1);
	};

	const handler = (fn) => {
		return (e) => {
			if (e.type === "touchstart") {
				if (e.touches.length !== 1) return;
				e = e.touches[0];
			}

			const id = e.identifier;
			const start = { min, max, p: p(e.clientX) };

			const handle_move = (e) => {
				if (e.type === "touchmove") {
					if (e.changedTouches.length !== 1) return;
					e = e.changedTouches[0];
					if (e.identifier !== id) return;
				}

				fn(start, p(e.clientX));
			};

			const handle_end = (e) => {
				if (e.type === "touchend") {
					if (e.changedTouches.length !== 1) return;
					if (e.changedTouches[0].identifier !== id) return;
				} else if (e.target === brush) {
					clear();
				}

				window.removeEventListener("mousemove", handle_move);
				window.removeEventListener("mouseup", handle_end);

				window.removeEventListener("touchmove", handle_move);
				window.removeEventListener("touchend", handle_end);
			};

			window.addEventListener("mousemove", handle_move);
			window.addEventListener("mouseup", handle_end);

			window.addEventListener("touchmove", handle_move);
			window.addEventListener("touchend", handle_end);
		};
	};

	const clear = () => {
		min = null;
		max = null;
	};

	const reset = handler((start, p) => {
		min = clamp(Math.min(start.p, p), 0, 1);
		max = clamp(Math.max(start.p, p), 0, 1);
	});

	const move = handler((start, p) => {
		const d = clamp(p - start.p, -start.min, 1 - start.max);
		min = start.min + d;
		max = start.max + d;
	});

	const adjust_min = handler((start, p) => {
		min = p > start.max ? start.max : p;
		max = p > start.max ? p : start.max;
	});

	const adjust_max = handler((start, p) => {
		min = p < start.min ? p : start.min;
		max = p < start.min ? start.min : p;
	});

	$: left = 100 * min;
	$: right = 100 * (1 - max);
</script>

<div
	bind:this={brush}
	class="brush-outer"
	on:mousedown|stopPropagation={reset}
	on:touchstart|stopPropagation={reset}
	role="slider"
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuetext="{min} to {max}"
	aria-valuenow="{left}"
	tabindex="0">
	{#if min !== null}
		<div
			class="brush-inner"
			on:mousedown|stopPropagation={move}
			on:touchstart|stopPropagation={move}
			style="left: {left}%; right: {right}%"
			role="slider"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuetext="{min} to {max}"
			aria-valuenow={left}
			tabindex="0">
		</div>
		<div
			class="brush-handle"
			on:mousedown|stopPropagation={adjust_min}
			on:touchstart|stopPropagation={adjust_min}
			style="left: {left}%"
			role="slider"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuetext="{min} to {max}"
			aria-valuenow={left}
			tabindex="0">
		</div>
		<div
			class="brush-handle"
			on:mousedown|stopPropagation={adjust_max}
			on:touchstart|stopPropagation={adjust_max}
			style="right: {right}%"
			role="slider"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuetext="{min} to {max}"
			aria-valuenow={right}
			tabindex="0">
		</div>
	{/if}
</div>

<style>
	.brush-outer {
		position: relative;
		width: 100%;
		height: calc(100% + 5px);
		top: -5px;
	}

	.brush-inner {
		position: absolute;
		height: 100%;
		cursor: move;
		mix-blend-mode: multiply;
		background-color: #857aff90;
		/* border: 1px solid #000; */
	}

	.brush-handle {
		position: absolute;
		width: 0;
		height: 100%;
		cursor: ew-resize;
	}

	.brush-handle::before {
		position: absolute;
		content: "";
		width: 8px;
		left: -4px;
		height: 100%;
		background: transparent;
	}
</style>
