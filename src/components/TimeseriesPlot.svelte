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

  import { leftSites, leftSeries, rightSites, rightSeries } from '../lib/stores';
  import { prepareData, axisLabel } from '../lib/timeseries';

  export let width, height;

  let plotlyElement;


  console.log('init timeseries plot', width, height);


  $: {
    console.log('update timeseries plot', $leftSeries);
    plotlyReact(width, height, $leftSites, $leftSeries, $rightSites, $rightSeries);
  }


  function plotlyAction(container) {
    plotlyElement = container;
    plotlyReact(width, height, $leftSites, $leftSeries, $rightSites, $rightSeries);
  }

  function plotlyReact(width, height, leftSites, leftSeries, rightSites, rightSeries) {
    if(plotlyElement) {
      const layout = {
        width: width, 
        height: height,
        margin: {
          autoexpand: false,
          t: 30,
          l: 79
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
            text: axisLabel(leftSites, leftSeries),
          },
          fixedrange: false,
          color: '#346',
        },

        yaxis2: {
          title: {
            text: axisLabel(leftSites, leftSeries),
          },
          titlefont: {color: '#d81b60'},
          tickfont: {color: '#ccccc'},
          anchor: 'x',
          overlaying: 'y',
          side: 'right',
          fixedrange: false
        },

        
      } as Partial<Plotly.Layout>;
      
      const leftData = prepareData(leftSites, leftSeries, '#345');
      const rightData = prepareData(rightSites, rightSeries, '#d81b60');
      rightData['yaxis'] = 'y2';

      const data = [leftData, rightData];
      Plotly.react(plotlyElement, data, layout);
    }
  }



</script>


<div id='plotly' use:plotlyAction></div>


<style lang="scss">

</style>