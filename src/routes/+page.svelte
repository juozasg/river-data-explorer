<script lang="ts">
	import HomePageMap from "$src/components/maps/HomePageMap.svelte";


</script>

<svelte:head>
	<title>St. Joseph River Basin Commission</title>
	<meta
		name="description"
		content="St Joseph River (Indiana) watershed water quality information, data and web map"
	/>
	<link
		rel="stylesheet"
		href="https://bulma.io/vendor/fontawesome-free-6.5.2-web/css/all.min.css"
	/>
</svelte:head>

<h1>St. Joseph River Basin Data</h1>


<HomePageMap zoom={8.2} --map-width={'100%'} --map-height={'650px'} />

<!-- svelte-ignore a11y-distracting-elements -->
<marquee>🚧🏗️ UNDER CONSTRUCTION... 		 🏗️🚧</marquee>


<!-- <math><mfrac>
	<mn>x</mn>
	<msup><mi>y</mi><mn>z</mn></msup>
</mfrac></math> -->

<style lang="scss">
	marquee {
		color: rgb(150, 73, 164);
		font-size: 30px;
		max-width: 630px;
	}
</style>
