<script lang="ts">
  import AreaSelectorMap from '$src/components/maps/AreaSelectorMap.svelte';

</script>


<svelte:head>
	<title>St. Joseph River Basin Commission</title>
	<meta name="description" content="St Joseph River (Indiana) watershed water quality information, data and web map">
</svelte:head>

<h1>St. Joseph River Basin Data</h1>


<AreaSelectorMap zoom={7.8}/>


<!-- svelte-ignore a11y-distracting-elements -->
<marquee>🚧🏗️ UNDER CONSTRUCTION... 🏗️🚧</marquee>

<style lang="scss">
  marquee {
    color: orange;
    font-size: 30px;
    max-width: 630px;
  }
</style>
