<script lang="ts">
  import { fly } from 'svelte/transition';

  import { viewportHeight, showDataSelector, showTimeseries, showDataTable } from '../lib/stores';

  let width = 392;
  let height = 200;

  $: {
    if($showDataSelector || $showTimeseries) {
      height = $viewportHeight - 292;
    } else {
      height = $viewportHeight;
    }
  }
</script>

{#if $showDataTable }
  <div id='data-table'
        transition:fly="{{ x: -200, duration: 400 }}"
        style='width: {width}px; height: {height}px'>
    <h2>DATA-TABLE</h2>
  </div>
{/if}

<style lang="scss">
  #data-table {
    position: fixed;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background-color: blueviolet;
    z-index: 1;
  }
</style>