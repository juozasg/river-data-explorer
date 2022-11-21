<script lang="ts">
  import Plotly from 'plotly.js-basic-dist'

  import { leftSites, leftSeries, rightSites, rightSeries } from '../lib/stores';
  import { prepareData, axisLabel } from '../lib/timeseries';

  export let width, height;

  let plotlyElement;


  const leftColor = '#42124a';
  const rightColor = '#5caded';


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
          tickfont: {color: '#ccccc'},
          fixedrange: false,
          color: leftColor,
        },

        yaxis2: {
          title: {
            text: axisLabel(rightSites, rightSeries),
          },
          titlefont: {color: rightColor},
          tickfont: {color: '#ccccc'},
          anchor: 'x',
          overlaying: 'y',
          side: 'right',
          fixedrange: false
        },


      } as Partial<Plotly.Layout>;

      const leftData = prepareData(leftSites, leftSeries, leftColor);
      const rightData = prepareData(rightSites, rightSeries, rightColor);

      rightData['yaxis'] = 'y2';

      const data = [leftData, rightData];
      Plotly.react(plotlyElement, data, layout);
    }
  }



</script>


<div id='plotly' use:plotlyAction></div>


<style lang="scss">

</style>