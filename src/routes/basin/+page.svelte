<script lang="ts">
  import RegionTypeTabs from './RegionTypeTabs.svelte';
	import WebMap from "$src/components/WebMap.svelte";
</script>

<svelte:head>
	<title>Search the Basin</title>
</svelte:head>

<h4 class="has-text-centered">Select watershed region</h4>

<RegionTypeTabs></RegionTypeTabs>

<div class="areas">
  <WebMap --map-height="70vh" zoom={8.35}/>
</div>

<h4 class="has-text-centered">Select data</h4>


<div class="details">
  <div class="columns">
    <div class="column map-preview-column">
      <WebMap --map-height="400px"/>
    </div>
    <div class="column dataset-column">Sites and variables here</div>
  </div>
</div>


<h4 class="has-text-centered">Statistics/results go here...</h4>

<div class="results">
  <a href="/regions/indiana">Indiana</a>
</div>




<style>
	h4 {
		margin-bottom: 0.2rem;
	}

  .areas {
    margin-bottom: 2.5rem;
  }

  .details {
    margin-top: 1rem;
  }

  .columns {
    margin: 0;
    gap: 1rem;
  }

  .column {
    padding: 0;
    margin-bottom: 1rem;
  }


  .results {
    height: 400px;
    background-color: aquamarine;
  }

  .dataset-column {
    min-height: 400px;

    /* margin-left: 1rem; */
    background-color: #f0f0f0;
    font-size: 3rem;
    /* text-align: center; */
    padding: 1rem;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

  }
</style>