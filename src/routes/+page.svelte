<script lang="ts">
  import AreaSelectorMap from '$src/components/maps/AreaSelectorMap.svelte';

</script>

<svelte:head>
	<title>St. Joseph River Basin Commission</title>
	<meta name="description" content="St Joseph River (Indiana) watershed water quality information, data and web map">
  <link rel="stylesheet" href="https://bulma.io/vendor/fontawesome-free-6.5.2-web/css/all.min.css">
</svelte:head>

<h1>St. Joseph River Basin Data</h1>

<div class="dropdown">
  <div class="dropdown-trigger">
    <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu3">
      <span class="dropdown-label">Layers</span>
      <span class="dropdown-arrow"></span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu3" role="menu">
    <div class="dropdown-content">
      <a href="#" class="dropdown-item"> Overview </a>
      <a href="#" class="dropdown-item"> Modifiers </a>
      <a href="#" class="dropdown-item"> Grid </a>
      <a href="#" class="dropdown-item"> Form </a>
      <a href="#" class="dropdown-item"> Elements </a>
      <a href="#" class="dropdown-item"> Components </a>
      <a href="#" class="dropdown-item"> Layout </a>
      <hr class="dropdown-divider" />
      <a href="#" class="dropdown-item"> More </a>
    </div>
  </div>
</div>

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
