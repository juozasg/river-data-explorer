<script lang="ts">
	import WebMap from "$src/components/WebMap.svelte";
</script>

<svelte:head>
	<title>Search the Basin</title>
</svelte:head>

<h4 class="has-text-centered">Select watershed region</h4>


<div class="tabs is-toggle is-centered">
  <ul>
    <li class="is-active">
      <a>
        <span>State</span>
      </a>
    </li>
    <li>
      <a>
        <span>County</span>
      </a>
    </li>
    <li>
      <a>
        <span>River (HUC10)</span>
      </a>
    </li>
    <li>
      <a>
        <span>Stream (HUC12)</span>
      </a>
    </li>
    <li>
      <a>
        <span>Custom Area...</span>
      </a>
    </li>
  </ul>
</div>

<div class="areas">
  <WebMap --map-height="700px"/>
</div>

<h4 class="has-text-centered">Select data</h4>


<div class="details">
  <div class="columns">
    <div class="column col1">
      <WebMap --map-height="400px"/>
    </div>
    <div class="column col2">Sites and variables here</div>
  </div>
</div>


<h4 class="has-text-centered">Statistics/results go here...</h4>



<a href="/regions/indiana">Indiana</a>

<style>
	h4 {
		margin-bottom: 0.2rem;
	}

  .areas {
    margin-bottom: 2.5rem;
  }

  .columns {
    margin: 0;
  }

  .col1 {
    margin-right: 1rem;
  }

  .column {
    padding: 0;
    margin-bottom: 1rem;

  }

  .col2 {
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