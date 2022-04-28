import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {observeState} from 'lit-element-state';

import {app} from '../state/app.js';
import {labels} from '../data/definitions.js';

import Plotly from 'plotly.js-dist'


@customElement('river-timeseries')
class RiverTimeseries extends observeState(LitElement) {
  createRenderRoot() {
    return this;
  }


  firstUpdated() {
    // manually observe
    app.addObserver(() => this.updatePlotly(), ['leftTimeseries', 'rightTimeseries']);
    app.addObserver(() => this.requestUpdate(), ['showDataSelect', 'viewportWidth']);

    // firstUpdate render twice to fix layout
    this.updatePlotly();
  }

  updated() {
    this.updatePlotly();
  }

  updatePlotly() {
    let selectorOptions = {
      buttons: [{
          step: 'month',
          stepmode: 'backward',
          count: 1,
          label: '1m'
      }, {
          step: 'month',
          stepmode: 'backward',
          count: 6,
          label: '6m'
      }, {
          step: 'year',
          stepmode: 'todate',
          count: 1,
          label: 'YTD'
      }, {
          step: 'year',
          stepmode: 'backward',
          count: 1,
          label: '1y'
      }, {
          step: 'all',
      }],
    };

    // https://plotly.com/javascript/multiple-axes/
    let data = this.prepareData();
    let layout = {
      xaxis: {
        rangeselector: selectorOptions,
        rangeslider: {},
        tickformat: "%H:%M\n%Y-%m-%d",
        tickangle: 0,
        tickfont: {size: 10}
      },
      yaxis: {
        title: labels[app.leftTimeseries.seriesId],
        fixedrange: false,
        color: '#d81b60'
      },
      yaxis2: {
        title: labels[app.rightTimeseries.seriesId],
        titlefont: {color: '#33691e'},
        tickfont: {color: '#ccccc'},
        anchor: 'x',
        overlaying: 'y',
        side: 'right',
        fixedrange: false
      },
      legend: true,
      legend: {
        x: 0,
        y: 1.53,
        // xanchor: 'right'
      },
      width: this.width - 2,
      height: this.height - 2,
      margin: {
        autoexpand: false,
        t: 75
      }
    };

    let config = {responsive: true}

    Plotly.react('plotly', data, layout, config);
  }


  prepareData() {
    let leftData = {};
    let rightData = {};

    if(app.leftTimeseries.series) {
      leftData = this.prepareTimeseriesData(app.leftTimeseries);
      leftData.marker.color = '#d81b60';
    }

    if(app.rightTimeseries.series) {
      rightData = this.prepareTimeseriesData(app.rightTimeseries);
      rightData.marker.color = '#33691e';
      rightData.yaxis = 'y2';
    }

    return [leftData, rightData];
  }

  prepareTimeseriesData(ts) {
    let xs =_.map(ts.series.getIndex().toArray(), d => new Date(d));
    let ys = ts.series.toArray();
    let name = this.legendText(ts.seriesId, ts.siteIds);

    let data = {
      x: xs,
      y: ys,
      name: name,
      type: 'scatter',
      marker: {
        color: "#ccc",
      }

    };

    return data;
  }

  legendText(seriesId, siteIds) {
    let text = "";
    if(siteIds.length == 1) {
      text += model.sites[siteIds[0]].siteName;
    } else if(siteIds.length > 1) {
      text += `${siteIds.length} sites (mean)`;
    }

    text += ` - ${labels[seriesId]}`;

    return text;
  }



  render() {
    let ds = document.getElementsByTagName('river-data-select')[0]
    this.height = ds.height;
    this.width = app.viewportWidth;
    if(app.showDataSelect) {
      this.width = this.width - ds.width - 4;
    }
    const style = `width: ${this.width}px; height: ${this.height}px;`

    const hidePlotly = !app.leftTimeseries.series && !app.rightTimeseries.series;

    return html`
    <div id="timeseries" class="card" style="${style}">
    <div class="help" ?hide=${!hidePlotly}>
      <h5>Select sites, choose a variable and click <span class="material-icons">arrow_left</span> or <span class="material-icons">arrow_right</span> to graph</h5>
    </div>
    <div ?hide=${hidePlotly} id="plotly"></div>
    </div>
    `;
  }
}