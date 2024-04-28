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


<WebMap/>

<a href="/regions/indiana">Indiana</a>

<style>
	h4 {
		margin-bottom: 0.2rem;
	}
</style>