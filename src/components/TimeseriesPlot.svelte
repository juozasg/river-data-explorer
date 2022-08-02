<script lang="ts">
  // https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
  // https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/usage.html
  // https://echarts.apache.org/examples/en/editor.html?c=multiple-y-axis
  // https://echarts.apache.org/examples/en/editor.html?c=line-tooltip-touch
  // https://echarts.apache.org/handbook/en/basics/release-note/v5-feature/#time-axis
  // https://stackoverflow.com/questions/69735038/echarts-datazoom-make-height-bigger
  // https://codesandbox.io/s/chartjs-timeseries-odmnmh?file=/components/Chart.svelte
  // https://github.com/chartjs/chartjs-plugin-zoom/issues/649
  //
  // https://apexcharts.com/javascript-chart-demos/mixed-charts/multiple-yaxis/
  // one bright color easier to follow than two bright colors
  import Plotly from 'plotly.js-basic-dist'

  export let width, height;

  let plotlyElement;


  console.log('init timeseries plot', width, height);


  $: {
    console.log('update timeseries plot', width, height);
    plotlyReact(width, height);
  }


  function plotlyAction(container) {
    plotlyElement = container;
    plotlyReact(width, height);
  }

  function plotlyReact(width, height) {
    if(plotlyElement) {
      const data: Plotly.Data[] = [
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [20, 14, 23],
          type: 'bar'
        }
      ];
      Plotly.react(plotlyElement, data, {width: width, height: height});
    }

  }

</script>


<div id='plotly' use:plotlyAction></div>


<style lang="scss">

</style>