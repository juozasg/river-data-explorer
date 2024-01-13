<script lang="ts">
  import WebMap from '$src/components/WebMap.svelte';
</script>


<svelte:head>
	<title>St. Joseph River Basin Commission</title>
	<meta name="description" content="St Joseph River (Indiana) watershed water quality information, data and web map">
</svelte:head>

<h1>Welcome to the new website 'Home Page'</h1>
<!-- svelte-ignore a11y-distracting-elements -->
<marquee>🚧🏗️ UNDER CONSTRUCTION... 🏗️🚧</marquee>

<WebMap/>


<style lang="scss">
  marquee {
    color: orange;
    font-size: 30px;
    max-width: 630px;
  }
</style>
