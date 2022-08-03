<script lang="ts">
  import { fly } from 'svelte/transition';

  import { viewportHeight, showDataSelector, showTimeseries, showDataTable, selectedSites, selectedSeries } from '../lib/stores';
  import DataTableContent from './DataTableContent.svelte';

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
      <DataTableContent/>

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

    overflow-y:auto;
  }
</style>