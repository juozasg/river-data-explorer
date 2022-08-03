<script lang="ts">
  import { fly } from 'svelte/transition';

  import { viewportHeight, showDataSelector, showTimeseries, showDataTable, selectedSites } from '../lib/stores';

  let width = 392;
  let height = 200;

  $: {
    if($showDataSelector || $showTimeseries) {
      height = $viewportHeight - 296;
    } else {
      height = $viewportHeight;
    }
  }
</script>

{#if $showDataTable }
  <div id='data-table' class='elevation'
        transition:fly="{{ x: -200, duration: 400 }}"
        style='width: {width}px; height: {height}px'>
    <div class='content'>

      <h2>Data Table</h2>
      <h3>{$selectedSites.size} site(s) selected</h3>
      <ul>
        {#each Array.from($selectedSites) as site}
        <li>{site}</li>
        {/each}

      </ul>
    </div>
  </div>
{/if}

<style lang="scss">
  #data-table {
    position: fixed;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background-color: white;
    z-index: 2;

    .content {
      padding: 0 0.5rem 0.5rem 1rem;
    }
  }
</style>