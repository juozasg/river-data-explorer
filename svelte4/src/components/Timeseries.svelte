<script lang="ts">
  import { fly } from 'svelte/transition';
  import TimeseriesPlot from './TimeseriesPlot.svelte';

  import { viewportWidth, showDashboard, showTimeseries } from '../lib/stores';

  let width = 100;
  let height = 292;

  $: {
    if($showDashboard) {
      width = $viewportWidth - 396;
    } else {
      width = $viewportWidth;
    }
  }

</script>

{#if $showTimeseries }
  <div id='timeseries' class='elevation'
        transition:fly="{{ x: $viewportWidth, duration: 400 }}"
        style='width: {width}px; height: {height}px'>
    <TimeseriesPlot width={width} height={height}/>
  </div>
{/if}

<style lang="scss">
  #timeseries {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100px;
    z-index: 2;
    background-color: purple;
  }
</style>