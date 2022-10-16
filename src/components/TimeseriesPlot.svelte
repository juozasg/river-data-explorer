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

  import { leftSites, leftSeries } from '../lib/stores';
  import { prepareData, axisLabel } from '../lib/timeseries';

  export let width, height;

  let plotlyElement;


  console.log('init timeseries plot', width, height);


  $: {
    console.log('update timeseries plot', width, height);
    plotlyReact(width, height, $leftSites, $leftSeries);
  }


  function plotlyAction(container) {
    plotlyElement = container;
    plotlyReact(width, height, $leftSites, $leftSeries);
  }

  function plotlyReact(width, height, leftSites, leftSeries) {
    if(plotlyElement) {
      const layout = {
        width: width, 
        height: height,
        margin: {
          autoexpand: false,
          t: 30,
          l: 60
        },
        // legend: true,
        legend: {
          x: 0,
          y: 1.53,
          // xanchor: 'right'
        },

        xaxis: {
          // rangeselector: selectorOptions,
          rangeslider: {},
          tickformat: "%H:%M\n%Y-%m-%d",
          tickangle: 0,
          tickfont: {size: 10}
        },

        yaxis: {
          title: {
            text: axisLabel(leftSites, leftSeries) + 'aa',
          },
          fixedrange: false,
          color: '#345',
        },

        
      };

      const data = [prepareData(leftSites, leftSeries, '#345')];
      Plotly.react(plotlyElement, data, layout);
    }
  }



</script>


<div id='plotly' use:plotlyAction></div>


<style lang="scss">

</style>