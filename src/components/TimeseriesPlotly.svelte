<script lang="ts">
  import Plotly from 'plotly.js-basic-dist'

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


<div id='plotly' use:plotlyAction></div>


<style lang="scss">

</style>