<script lang="ts">
  import { fly } from 'svelte/transition';

  import { viewportWidth, showDataSelector, showTimeseries, showDataTable } from '../lib/stores';

  let width = 100;
  let height = 292;

  $: {
    if($showDataSelector) {
      width = $viewportWidth - 392;
    } else {
      width = $viewportWidth;
    }
  }
</script>

{#if $showTimeseries }
  <div id='timeseries'
        transition:fly="{{ x: $viewportWidth, duration: 400 }}"
        style='width: {width}px; height: {height}px'>
    <h2>TIMESERIES...</h2>
  </div>
{/if}

<style lang="scss">
  #timeseries {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100px;
    background-color: rgb(223, 112, 112);
  }
</style>