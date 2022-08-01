<script lang="ts">
  import { fly } from 'svelte/transition';
  // https://stackoverflow.com/questions/39084438/how-to-import-plotly-js-into-typescript
  import * as Plotly from 'plotly.js';


  import { viewportWidth, showDataSelector, showTimeseries } from '../lib/stores';

  let width = 100;
  let height = 292;

  $: {
    if($showDataSelector) {
      width = $viewportWidth - 392;
    } else {
      width = $viewportWidth;
    }
  }

  function plotlyAction(container) {
    const data: Plotly.Data[] = [
    {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      type: 'bar'
    }
  ];

  Plotly.newPlot(container, data);

  }
</script>

{#if $showTimeseries }
  <div id='timeseries'
        transition:fly="{{ x: $viewportWidth, duration: 400 }}"
        style='width: {width}px; height: {height}px'>
    <div id='plotly' use:plotlyAction></div>
  </div>
{/if}

<style lang="scss">
  #timeseries {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100px;
    background-color: purple;
  }
</style>