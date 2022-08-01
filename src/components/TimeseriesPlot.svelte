<script lang="ts">
  // https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
  // https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/usage.html
  // https://echarts.apache.org/examples/en/editor.html?c=multiple-y-axis
  // https://echarts.apache.org/examples/en/editor.html?c=line-tooltip-touch
  // https://echarts.apache.org/handbook/en/basics/release-note/v5-feature/#time-axis
  // https://stackoverflow.com/questions/69735038/echarts-datazoom-make-height-bigger
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