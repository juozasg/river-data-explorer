import * as d3 from "d3";
import type { ColorScale } from "../../types";

export function colorbarSvg(colorScale: ColorScale) : SVGElement {
  const svg = d3.create("svg")
    .attr("height", 42)
    // .attr("style", "border: 1px solid green;")
    .style("overflow", "visible")
    .style("display", "block");


    const dataUrl = colorGradientDataUrl(colorScale);

    let x0 = 0;
    let w = 300;
    svg.append("image")
      .attr("x", x0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", 20)
      .attr("preserveAspectRatio", "none")
      .attr("href", dataUrl);


    // safer manually defined ticks
    const ticks = [0, 0.25, 0.5, 0.75, 1];
    const nTicks = ticks.length;
    const textLabelScale = d3.scaleLinear().range(colorScale.domain())

    // https://observablehq.com/@d3/scale-ticks#format
    const tickFormat = colorScale.tickFormat(nTicks);

    svg.selectAll('text').data(ticks)
      .enter()
      .append("text")
      .attr("x", (d,i) => x0 + (w * i/(nTicks - 1)))
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text((d) => tickFormat(textLabelScale(d)));

    return svg.node();
}


function colorGradientDataUrl(scale: ColorScale) {
  let n = 256;

  scale = scale.copy().domain([0,1]);

  const canvas = document.createElement("canvas");
  canvas.width = n;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = scale(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }

  return canvas.toDataURL();
}