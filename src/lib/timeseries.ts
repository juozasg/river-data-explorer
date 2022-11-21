import { labels } from "./definitions";
import { getSetFirst } from "./helpers";
import { model } from "./data/model";

export function prepareData(sites: Set<string>, series: string, color: string = '#abc'): Plotly.Data {
  const timeseries = model.getSitesTimeseries(sites, series);
  if(!timeseries || series === 'datainfo') {
    return {
      x: [],
      y: []
    };
  }

  const xs = timeseries.getIndex().toArray().map(i => new Date(i));
  const ys = timeseries.toArray();

  return {
    x: xs,
    y: ys,
    name: series,
    type: 'scatter',
    marker: {
      color,
    }
  };
}

export function axisLabel(sites: Set<string>, series: string) {
  if(series === 'datainfo') {
    return '';
  }

  const sitesLabel = sites.size == 1 ? getSetFirst(sites) : `${sites.size} sites`;
  const seriesLabel = labels[series];

  return `${sitesLabel}<br>${seriesLabel}`;
}

