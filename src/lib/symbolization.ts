import * as d3 from "d3";
import hexToHsl from 'hex-to-hsl';

import { model } from "./data/model"
import { scales, radiusRange } from "./definitions"

export function getSiteColor(siteId: string, seriesId: string): string | undefined {
  const value = model.getValue(siteId, seriesId);
  if(value !== undefined) {
    const colorScale = scales[seriesId];
    try {
      const color = d3.color(colorScale(value)).formatHex();
      return color;
    } catch(e) {
      console.log(siteId, seriesId, value, colorScale(value));
      console.log(e);
    }

  }
}

export function getSiteRadius(siteId: string, seriesId: string) {
  const value = model.getValue(siteId, seriesId);
  if(value !== undefined) {
    try {
      const colorScale = scales[seriesId];
      const radiusScale = colorScale.copy().range(radiusRange);
      return radiusScale(value);
    } catch(e) {
      console.log(siteId, seriesId, value);
      console.log(e);
    }
  }
}


export function getSiteSelectedColor(color: string) {
  const colorHsl = hexToHsl(color);
  const invertHsl = [
    (colorHsl[0] + 270) % 360,
    100 - colorHsl[1],
    100 - colorHsl[2]
  ];

  // console.log(color, colorHsl, invertHsl);

  return `hsl(${invertHsl[0]}, ${invertHsl[1]}%, ${invertHsl[2]}%)`;
}
