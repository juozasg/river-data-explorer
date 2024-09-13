<!--
  @component
  Generates an SVG line shape.
 -->
<script>
	// @ts-nocheck

	import { getContext } from "svelte";

	const { data, xGet, yGet, zGet } = getContext("LayerCake");

	/** @type {String} [ySource="y"] - "y" or "z" for data values */
	export let dataSource = "y";
	$: dataGet = dataSource === "y" ? $yGet : $zGet;

	/** @type {String} [stroke='#ab00d6'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let stroke = "#ab00d6";

	let path;
	$: {
		const pathpoints = $data
			.map((d) => {
				const val = dataGet(d);
				const x = $xGet(d);
				// console.log(d, val, x);
				if (typeof val === "number" && typeof x === "number") return x + "," + val;
				return null;
			})
			.filter((/** @type {number} */ coords) => coords !== null)
			.join("L");

		if (pathpoints.length > 0) {
			path = "M" + pathpoints;
		} else {
			path = "";
		}
	}
</script>

<path class="path-line" d={path} {stroke}></path>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
